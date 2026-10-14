import React, {FormEvent, useEffect, useMemo, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import styles from './pages.module.sass';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {useAppSelector} from '../hooks/useAppSelector';
import {deleteOrder, getOrderById, updateOrder} from '../store/actions/order.action';
import {updateOrderWorkWithQuantities} from '../store/actions/orderWork.action';
import {deleteOrderFile, generateOrderFile} from '../store/actions/orderFile.action';
import {getGdriveStatus} from '../store/actions/gdrive.action';
import {IOrderWork} from '../interface/ISmetaOrders';
import {formatMoney} from '../utils/currency';

const isSquare = (unit: string) => {
    const u = unit.toLowerCase().replace(/\s/g, '').replace(/²/g, '2').replace(/\./g, '');
    return u === 'м2' || u === 'm2' || u.includes('кв');
};

const isLinear = (unit: string) => {
    const u = unit.toLowerCase().replace(/\s/g, '').replace(/\./g, '');
    return u === 'мп' || u === 'mp' || u.includes('пог');
};

const priceOf = (ow: IOrderWork, match: (unit: string) => boolean) =>
    ow.work?.workMeasurements?.find(wm => match(wm.measurement?.shortName ?? ''))?.cost ?? null;

const unitOf = (ow: IOrderWork, match: (unit: string) => boolean) =>
    ow.work?.workMeasurements?.find(wm => match(wm.measurement?.shortName ?? ''))?.measurement?.shortName ?? '';

const draftKey = (orderWorkId: number, unit: string) => `${orderWorkId}:${unit}`;

const parseQty = (raw: string) => {
    const trimmed = raw.trim().replace(',', '.');
    if (!trimmed) return 0;
    const value = Number(trimmed);
    return Number.isNaN(value) || value <= 0 ? 0 : value;
};

const lineTotal = (ow: IOrderWork, draft: Record<string, string>) => {
    const m2Unit = unitOf(ow, isSquare);
    const mpUnit = unitOf(ow, isLinear);
    const m2 = m2Unit ? parseQty(draft[draftKey(ow.id, m2Unit)] ?? '') : 0;
    const mp = mpUnit ? parseQty(draft[draftKey(ow.id, mpUnit)] ?? '') : 0;
    const priceM2 = priceOf(ow, isSquare) ?? 0;
    const priceMp = priceOf(ow, isLinear) ?? 0;
    return m2 * priceM2 + mp * priceMp;
};

const EstimateDetail = () => {
    const {id} = useParams();
    const orderId = Number(id);
    const dispatch = useAppDispatch();
    const {order, isUpdating} = useAppSelector(state => state.ordersReducer);
    const {isCreating: isGenerating} = useAppSelector(state => state.orderFilesReducer);
    const {status: gdriveStatus, isLoading: isGdriveLoading} = useAppSelector(state => state.gdriveReducer);

    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [draft, setDraft] = useState<Record<string, string>>({});
    const hydratedFor = useRef<number | null>(null);

    useEffect(() => {
        if (!orderId) return;
        dispatch(getOrderById(orderId));
        dispatch(getGdriveStatus());
    }, [dispatch, orderId]);

    useEffect(() => {
        if (!order || order.id !== orderId) return;
        setName(order.name);
        setClient(order.client ?? '');
        if (hydratedFor.current === order.id) return;
        hydratedFor.current = order.id;
        const next: Record<string, string> = {};
        for (const ow of order.orderWorks ?? []) {
            for (const q of ow.orderWorkQuantities ?? []) {
                next[draftKey(ow.id, q.measurement)] = String(q.quantity);
            }
        }
        setDraft(next);
    }, [order, orderId]);

    const groups = useMemo(() => {
        const map = new Map<string, IOrderWork[]>();
        const works = [...(order?.orderWorks ?? [])].sort((a, b) => {
            const cat = (a.work?.categoryId ?? 0) - (b.work?.categoryId ?? 0);
            return cat || a.id - b.id;
        });
        for (const ow of works) {
            const category = ow.work?.category?.name ?? 'Прочие работы';
            const list = map.get(category) ?? [];
            list.push(ow);
            map.set(category, list);
        }
        return [...map.entries()];
    }, [order]);

    const grandTotal = useMemo(
        () => (order?.orderWorks ?? []).reduce((sum, ow) => sum + lineTotal(ow, draft), 0),
        [order, draft],
    );

    const onSaveOrder = (e: FormEvent) => {
        e.preventDefault();
        if (!order) return;
        dispatch(updateOrder(order.id, {name: name.trim(), client: client.trim() || undefined}));
    };

    const setQty = (ow: IOrderWork, unit: string, value: string) => {
        setDraft(prev => ({...prev, [draftKey(ow.id, unit)]: value}));
    };

    const saveWork = (ow: IOrderWork) => {
        if (!order) return;
        const units = [unitOf(ow, isSquare), unitOf(ow, isLinear)].filter(Boolean);
        const rows = units.map(unit => {
            const existing = ow.orderWorkQuantities?.find(q => q.measurement === unit);
            return {
                id: existing?.id,
                measurement: unit,
                quantity: parseQty(draft[draftKey(ow.id, unit)] ?? ''),
            };
        });
        const same = rows.every(row => {
            const prev = ow.orderWorkQuantities?.find(q => q.measurement === row.measurement);
            const prevQty = prev ? Number(prev.quantity) : 0;
            return prevQty === row.quantity;
        });
        if (same) return;
        dispatch(updateOrderWorkWithQuantities(order.id, ow, rows, {silent: true}));
    };

    if (!orderId) {
        return <p className={styles.empty}>Некорректный id сметы</p>;
    }

    if (!order || order.id !== orderId) {
        return <p className={styles.empty}>Загрузка сметы...</p>;
    }

    const hasSavedFiles = (order.savedOrderFiles?.length ?? 0) > 0;
    const gdriveReady = Boolean(gdriveStatus?.connected) || hasSavedFiles;
    const showGdriveWarn = !isGdriveLoading && !gdriveReady;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <Link className={styles.backLink} to="/estimates">
                    ← К списку смет
                </Link>
                <h1 className={styles.pageTitle}>{order.name}</h1>
                <p className={styles.pageSubtitle}>
                    Каталог уже в смете. Пустые объёмы в Excel не попадают
                </p>
            </header>

            <div className={styles.stack}>
                <section className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Основное</h3>
                    <form className={styles.metaForm} onSubmit={onSaveOrder}>
                        <input
                            className={styles.input}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Название"
                        />
                        <input
                            className={styles.input}
                            value={client}
                            onChange={e => setClient(e.target.value)}
                            placeholder="Клиент"
                        />
                        <button className={styles.btn} type="submit" disabled={isUpdating}>
                            Сохранить
                        </button>
                        <button
                            className={styles.btnDanger}
                            type="button"
                            onClick={() => {
                                if (window.confirm('Удалить смету?')) dispatch(deleteOrder(order.id));
                            }}
                        >
                            Удалить
                        </button>
                    </form>
                </section>

                <section className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Работы</h3>
                    {!groups.length ? (
                        <p className={styles.empty}>В каталоге нет работ — смета пустая</p>
                    ) : (
                        groups.map(([category, works]) => {
                            const categorySum = works.reduce((sum, ow) => sum + lineTotal(ow, draft), 0);
                            return (
                                <div key={category} className={styles.categoryBlock}>
                                    <div className={styles.categoryHead}>
                                        <h4 className={styles.categoryTitle}>{category}</h4>
                                        <span className={styles.categorySum}>{formatMoney(categorySum)}</span>
                                    </div>
                                    <table className={styles.sheet}>
                                        <thead>
                                            <tr>
                                                <th className={styles.numCell}>№</th>
                                                <th>Работа</th>
                                                <th>м²</th>
                                                <th>цена м²</th>
                                                <th>м.п.</th>
                                                <th>цена м.п.</th>
                                                <th>Сумма</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {works.map((ow, index) => {
                                                const m2 = unitOf(ow, isSquare);
                                                const mp = unitOf(ow, isLinear);
                                                const priceM2 = priceOf(ow, isSquare);
                                                const priceMp = priceOf(ow, isLinear);
                                                return (
                                                    <tr key={ow.id}>
                                                        <td className={styles.numCell}>{index + 1}</td>
                                                        <td className={styles.nameCell}>{ow.work?.name ?? `#${ow.workId}`}</td>
                                                        <td>
                                                            {m2 ? (
                                                                <input
                                                                    className={styles.qtyInput}
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    placeholder="—"
                                                                    value={draft[draftKey(ow.id, m2)] ?? ''}
                                                                    onChange={e => setQty(ow, m2, e.target.value)}
                                                                    onBlur={() => saveWork(ow)}
                                                                />
                                                            ) : (
                                                                <span className={styles.dash}>—</span>
                                                            )}
                                                        </td>
                                                        <td className={styles.moneyCell}>
                                                            {priceM2 == null ? '—' : formatMoney(priceM2)}
                                                        </td>
                                                        <td>
                                                            {mp ? (
                                                                <input
                                                                    className={styles.qtyInput}
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    placeholder="—"
                                                                    value={draft[draftKey(ow.id, mp)] ?? ''}
                                                                    onChange={e => setQty(ow, mp, e.target.value)}
                                                                    onBlur={() => saveWork(ow)}
                                                                />
                                                            ) : (
                                                                <span className={styles.dash}>—</span>
                                                            )}
                                                        </td>
                                                        <td className={styles.moneyCell}>
                                                            {priceMp == null ? '—' : formatMoney(priceMp)}
                                                        </td>
                                                        <td className={styles.moneyCell}>{formatMoney(lineTotal(ow, draft))}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })
                    )}
                    <div className={styles.grandTotal}>
                        <span>Итого</span>
                        <span>{formatMoney(grandTotal)}</span>
                    </div>
                </section>

                <section className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Файлы</h3>
                    <div className={styles.filesSection}>
                        {isGdriveLoading ? (
                            <p className={styles.hint}>Проверка Google Drive...</p>
                        ) : showGdriveWarn ? (
                            <p className={styles.warn}>
                                Подключи Google Drive в настройках для выгрузки Excel
                            </p>
                        ) : gdriveStatus?.connected ? (
                            <p className={styles.ok}>Google Drive: {gdriveStatus.email}</p>
                        ) : null}

                        <div className={styles.inlineActions}>
                            <button
                                className={styles.btn}
                                type="button"
                                disabled={isGenerating || !gdriveReady}
                                onClick={() => dispatch(generateOrderFile(order))}
                            >
                                {isGenerating ? 'Генерация...' : 'Сгенерировать Excel'}
                            </button>
                        </div>

                        {!order.savedOrderFiles?.length ? (
                            <p className={styles.empty}>Файлов пока нет</p>
                        ) : (
                            <ul className={styles.list}>
                                {order.savedOrderFiles.map(file => (
                                    <li key={file.id} className={styles.listItem}>
                                        <a
                                            className={styles.fileLink}
                                            href={file.weblink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {file.name}
                                        </a>
                                        <button
                                            className={styles.btnDanger}
                                            type="button"
                                            onClick={() => dispatch(deleteOrderFile(file.id, order.id))}
                                        >
                                            Удалить
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EstimateDetail;
