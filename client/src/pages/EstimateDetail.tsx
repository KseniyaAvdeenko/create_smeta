import React, {FormEvent, useEffect, useMemo, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import styles from './pages.module.sass';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {useAppSelector} from '../hooks/useAppSelector';
import {deleteOrder, getOrderById, updateOrder} from '../store/actions/order.action';
import {getWorks} from '../store/actions/work.action';
import {
    addOrderWorkWithQuantities,
    deleteOrderWork,
    updateOrderWorkWithQuantities,
} from '../store/actions/orderWork.action';
import {deleteOrderFile, generateOrderFile} from '../store/actions/orderFile.action';
import {getGdriveStatus} from '../store/actions/gdrive.action';
import {IOrderWork} from '../interface/ISmetaOrders';
import {formatMoney} from '../utils/currency';

type QtyRow = {key: string; id?: number; measurement: string; quantity: string};

const EstimateDetail = () => {
    const {id} = useParams();
    const orderId = Number(id);
    const dispatch = useAppDispatch();
    const {order, isUpdating} = useAppSelector(state => state.ordersReducer);
    const {works} = useAppSelector(state => state.worksReducer);
    const {isCreating: isGenerating} = useAppSelector(state => state.orderFilesReducer);
    const {status: gdriveStatus, isLoading: isGdriveLoading} = useAppSelector(state => state.gdriveReducer);

    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [workId, setWorkId] = useState(0);
    const [qtyRows, setQtyRows] = useState<QtyRow[]>([]);
    const [editWorkId, setEditWorkId] = useState<number | null>(null);

    useEffect(() => {
        if (!orderId) return;
        dispatch(getOrderById(orderId));
        dispatch(getWorks());
        dispatch(getGdriveStatus());
    }, [dispatch, orderId]);

    useEffect(() => {
        if (!order) return;
        setName(order.name);
        setClient(order.client ?? '');
    }, [order]);

    const selectedWork = useMemo(
        () => works?.find(w => w.id === workId) ?? null,
        [works, workId],
    );

    useEffect(() => {
        if (!selectedWork) {
            setQtyRows([]);
            return;
        }
        setQtyRows(
            (selectedWork.workMeasurements ?? []).map(wm => ({
                key: String(wm.id ?? wm.measurementId),
                measurement: wm.measurement?.shortName ?? '',
                quantity: '',
            })),
        );
    }, [selectedWork]);

    const onSaveOrder = (e: FormEvent) => {
        e.preventDefault();
        if (!order) return;
        dispatch(updateOrder(order.id, {name: name.trim(), client: client.trim() || undefined}));
    };

    const onAddWork = (e: FormEvent) => {
        e.preventDefault();
        if (!order || !selectedWork) return;
        const rows = qtyRows
            .filter(r => r.measurement && r.quantity.trim())
            .map(r => ({measurement: r.measurement, quantity: Number(r.quantity)}))
            .filter(r => !Number.isNaN(r.quantity) && r.quantity > 0);
        if (!rows.length) return;
        dispatch(addOrderWorkWithQuantities(order.id, selectedWork, rows));
        setWorkId(0);
    };

    const startEditWork = (ow: IOrderWork) => {
        setEditWorkId(ow.id);
    };

    const onSaveEditWork = (ow: IOrderWork) => {
        if (!order) return;
        const rows = qtyRows
            .filter(r => r.measurement && r.quantity.trim())
            .map(r => ({
                id: r.id,
                measurement: r.measurement,
                quantity: Number(r.quantity),
            }))
            .filter(r => !Number.isNaN(r.quantity) && r.quantity > 0);
        dispatch(updateOrderWorkWithQuantities(order.id, ow, rows));
        setEditWorkId(null);
        setQtyRows([]);
    };

    const openEditRows = (ow: IOrderWork) => {
        startEditWork(ow);
        setQtyRows(
            (ow.orderWorkQuantities ?? []).map(q => ({
                key: String(q.id ?? q.measurement),
                id: q.id,
                measurement: q.measurement,
                quantity: String(q.quantity),
            })),
        );
    };

    const formatWorkLine = (ow: IOrderWork) => {
        const workName = ow.work?.name ?? `#${ow.workId}`;
        const qty =
            ow.orderWorkQuantities?.map(q => `${q.measurement}: ${q.quantity}`).join(', ') || '—';
        return `${workName} (${qty}) — ${formatMoney(ow.total ?? 0)}`;
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
                <p className={styles.pageSubtitle}>Редактирование позиций и выгрузка файла</p>
            </header>

            <div className={styles.stack}>
                <section className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Основное</h3>
                    <form className={styles.inlineForm} onSubmit={onSaveOrder}>
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
                            Удалить смету
                        </button>
                    </form>
                </section>

                <section className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Работы</h3>

                    {editWorkId ? (
                        <div className={styles.inlineForm}>
                            {qtyRows.map(row => (
                                <div key={row.key} className={styles.qtyRow}>
                                    <span className={styles.qtyLabel}>{row.measurement}</span>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={row.quantity}
                                        onChange={e =>
                                            setQtyRows(prev =>
                                                prev.map(r =>
                                                    r.key === row.key
                                                        ? {...r, quantity: e.target.value}
                                                        : r,
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            ))}
                            <div className={styles.inlineActions}>
                                <button
                                    className={styles.btn}
                                    type="button"
                                    onClick={() => {
                                        const ow = order.orderWorks?.find(w => w.id === editWorkId);
                                        if (ow) onSaveEditWork(ow);
                                    }}
                                >
                                    Сохранить объёмы
                                </button>
                                <button
                                    className={styles.btnGhost}
                                    type="button"
                                    onClick={() => setEditWorkId(null)}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form className={styles.inlineForm} onSubmit={onAddWork}>
                                <select
                                    className={styles.select}
                                    value={workId || ''}
                                    onChange={e => setWorkId(Number(e.target.value))}
                                >
                                    <option value="">Выбери работу</option>
                                    {(works ?? []).map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                            {w.category?.name ? ` (${w.category.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {selectedWork &&
                                    qtyRows.map(row => (
                                        <div key={row.key} className={styles.qtyRow}>
                                            <span className={styles.qtyLabel}>{row.measurement}</span>
                                            <input
                                                className={styles.input}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Кол-во"
                                                value={row.quantity}
                                                onChange={e =>
                                                    setQtyRows(prev =>
                                                        prev.map(r =>
                                                            r.key === row.key
                                                                ? {...r, quantity: e.target.value}
                                                                : r,
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                <button
                                    className={styles.btn}
                                    type="submit"
                                    disabled={!selectedWork}
                                >
                                    Добавить работу
                                </button>
                            </form>

                            <ul className={styles.list}>
                                {(order.orderWorks ?? []).map(ow => (
                                    <li key={ow.id} className={styles.listItem}>
                                        <div className={styles.listItemMeta}>{formatWorkLine(ow)}</div>
                                        <div className={styles.inlineActions}>
                                            <button
                                                className={styles.btnGhost}
                                                type="button"
                                                onClick={() => openEditRows(ow)}
                                            >
                                                Объёмы
                                            </button>
                                            <button
                                                className={styles.btnDanger}
                                                type="button"
                                                onClick={() =>
                                                    dispatch(deleteOrderWork(ow.id, order.id))
                                                }
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {!order.orderWorks?.length && (
                                <p className={styles.empty}>Работ в смете пока нет</p>
                            )}
                        </>
                    )}
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
                            <p className={styles.ok}>
                                Google Drive: {gdriveStatus.email}
                            </p>
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
