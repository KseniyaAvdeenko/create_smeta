import React, {FormEvent, useMemo, useState} from 'react';
import styles from '../../pages/settings.module.sass';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {useAppSelector} from '../../hooks/useAppSelector';
import {deleteWork, getWorks, saveWorkWithMeasurements} from '../../store/actions/work.action';
import {IWork, IWorkMeasurement} from '../../interface/ISmetaWorks';
import {formatMoney, priceInputLabel} from '../../utils/currency';

type PriceRow = {
    key: string;
    id?: number;
    measurementId: number;
    cost: string;
};

const emptyRow = (): PriceRow => ({
    key: crypto.randomUUID(),
    measurementId: 0,
    cost: '',
});

const WorksPanel = () => {
    const dispatch = useAppDispatch();
    const {works, isLoading, isCreating, isUpdating, isDeleting} = useAppSelector(
        state => state.worksReducer,
    );
    const {workCategories} = useAppSelector(state => state.workCategoryReducer);
    const {measurements} = useAppSelector(state => state.measurementReducer);

    const [showForm, setShowForm] = useState(false);
    const [editWork, setEditWork] = useState<IWork | null>(null);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number>(0);
    const [priceRows, setPriceRows] = useState<PriceRow[]>([emptyRow()]);
    const [filterCategoryId, setFilterCategoryId] = useState<number>(0);

    const filteredWorks = useMemo(() => {
        if (!works) return [];
        if (!filterCategoryId) return works;
        return works.filter(w => w.categoryId === filterCategoryId);
    }, [works, filterCategoryId]);

    const groupedWorks = useMemo(() => {
        const categories = (workCategories ?? [])
            .filter(category => !filterCategoryId || category.id === filterCategoryId)
            .map(category => ({
                id: category.id,
                name: category.name,
                works: filteredWorks.filter(work => work.categoryId === category.id),
            }));
        const uncategorizedWorks = filteredWorks.filter(
            work => !workCategories?.some(category => category.id === work.categoryId),
        );

        if (uncategorizedWorks.length) {
            categories.push({id: 0, name: 'Без категории', works: uncategorizedWorks});
        }

        return categories.filter(category => category.works.length > 0);
    }, [workCategories, filteredWorks, filterCategoryId]);

    const resetForm = () => {
        setShowForm(false);
        setEditWork(null);
        setName('');
        setCategoryId(workCategories?.[0]?.id ?? 0);
        setPriceRows([emptyRow()]);
    };

    const openCreate = () => {
        setEditWork(null);
        setName('');
        setCategoryId(workCategories?.[0]?.id ?? 0);
        setPriceRows([emptyRow()]);
        setShowForm(true);
    };

    const openEdit = (work: IWork) => {
        setEditWork(work);
        setName(work.name);
        setCategoryId(work.categoryId);
        setPriceRows(
            work.workMeasurements?.length
                ? work.workMeasurements.map(wm => ({
                      key: String(wm.id ?? crypto.randomUUID()),
                      id: wm.id,
                      measurementId: wm.measurementId,
                      cost: String(wm.cost),
                  }))
                : [emptyRow()],
        );
        setShowForm(true);
    };

    const addPriceRow = () => setPriceRows(prev => [...prev, emptyRow()]);

    const removePriceRow = (key: string) => {
        setPriceRows(prev => (prev.length > 1 ? prev.filter(r => r.key !== key) : prev));
    };

    const updatePriceRow = (key: string, patch: Partial<PriceRow>) => {
        setPriceRows(prev => prev.map(r => (r.key === key ? {...r, ...patch} : r)));
    };

    const formatPrices = (items?: IWorkMeasurement[]) => {
        if (!items?.length) return '—';
        return items
            .map(wm => {
                const unit = wm.measurement?.shortName ?? `#${wm.measurementId}`;
                return `${unit}: ${formatMoney(wm.cost)}`;
            })
            .join(' · ');
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed || !categoryId) return;

        const rows = priceRows
            .filter(r => r.measurementId > 0 && r.cost.trim() !== '')
            .map(r => ({
                id: r.id,
                measurementId: r.measurementId,
                cost: Number(r.cost.replace(',', '.')),
            }))
            .filter(r => !Number.isNaN(r.cost));

        await dispatch(
            saveWorkWithMeasurements({
                id: editWork?.id,
                name: trimmed,
                categoryId,
                priceRows: rows,
                existingMeasurements: editWork?.workMeasurements,
            }),
        );
        resetForm();
    };

    const onDelete = (id: number, workName: string) => {
        if (window.confirm(`Удалить работу «${workName}»?`)) {
            dispatch(deleteWork(id));
        }
    };

    const canSubmit =
        name.trim() &&
        categoryId &&
        !isCreating &&
        !isUpdating &&
        workCategories?.length &&
        measurements?.length;

    return (
        <div className={styles.panel}>
            <div>
                <h3 className={styles.panelTitle}>Работы и расценки</h3>
                <p className={styles.panelHint}>Название, категория, цена за единицу измерения</p>
            </div>

            {!workCategories?.length || !measurements?.length ? (
                <div className={styles.card}>
                    <p className={styles.panelHint}>
                        Сначала добавь хотя бы одну категорию и одну единицу измерения.
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.formRow}>
                        <select
                            className={styles.select}
                            value={filterCategoryId}
                            onChange={e => setFilterCategoryId(Number(e.target.value))}
                        >
                            <option value={0}>Все категории</option>
                            {workCategories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <button className={styles.btn} type="button" onClick={openCreate}>
                            + Новая работа
                        </button>
                        <button
                            className={styles.btnGhost}
                            type="button"
                            onClick={() => dispatch(getWorks())}
                        >
                            Обновить
                        </button>
                    </div>

                    {showForm && (
                        <div className={styles.card}>
                            <form className={styles.form} onSubmit={onSubmit}>
                                <span className={styles.label}>
                                    {editWork ? 'Редактирование' : 'Новая работа'}
                                </span>
                                <div className={styles.formRow}>
                                    <input
                                        className={styles.input}
                                        placeholder="Название работы"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <select
                                        className={styles.select}
                                        value={categoryId}
                                        onChange={e => setCategoryId(Number(e.target.value))}
                                    >
                                        {workCategories.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <span className={styles.label}>Расценки</span>
                                {priceRows.map(row => (
                                    <div key={row.key} className={styles.priceRow}>
                                        <select
                                            className={styles.select}
                                            value={row.measurementId || ''}
                                            onChange={e =>
                                                updatePriceRow(row.key, {
                                                    measurementId: Number(e.target.value),
                                                })
                                            }
                                        >
                                            <option value="">Единица</option>
                                            {measurements.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.shortName}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            className={styles.input}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder={priceInputLabel()}
                                            value={row.cost}
                                            onChange={e =>
                                                updatePriceRow(row.key, {cost: e.target.value})
                                            }
                                        />
                                        <button
                                            className={`${styles.btnGhost} ${styles.btnSmall}`}
                                            type="button"
                                            onClick={() => removePriceRow(row.key)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className={`${styles.btnGhost} ${styles.btnSmall}`}
                                    type="button"
                                    onClick={addPriceRow}
                                >
                                    + Ещё расценка
                                </button>

                                <div className={styles.formRow}>
                                    <button className={styles.btn} type="submit" disabled={!canSubmit}>
                                        {isCreating || isUpdating ? '...' : 'Сохранить'}
                                    </button>
                                    <button
                                        className={styles.btnGhost}
                                        type="button"
                                        onClick={resetForm}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {isLoading ? (
                        <p className={styles.loading}>Загрузка...</p>
                    ) : !filteredWorks.length ? (
                        <p className={styles.empty}>Работ пока нет</p>
                    ) : (
                        <div className={styles.workGroups}>
                            {groupedWorks.map(group => (
                                <section className={styles.workGroup} key={group.id || 'uncategorized'}>
                                    <div className={styles.workGroupHeader}>
                                        <h4 className={styles.workGroupTitle}>{group.name}</h4>
                                        <span className={styles.workGroupCount}>
                                            {group.works.length} {group.works.length === 1 ? 'работа' : 'работ'}
                                        </span>
                                    </div>
                                    <div className={styles.list}>
                                        {group.works.map(work => (
                                            <div key={work.id} className={styles.listItem}>
                                                <div className={styles.listItemMain}>
                                                    <span className={styles.listItemTitle}>{work.name}</span>
                                                    <span className={styles.listItemMeta}>
                                                        {formatPrices(work.workMeasurements)}
                                                    </span>
                                                </div>
                                                <div className={styles.listItemActions}>
                                                    <button
                                                        className={`${styles.btnGhost} ${styles.btnSmall}`}
                                                        type="button"
                                                        onClick={() => openEdit(work)}
                                                    >
                                                        Изменить
                                                    </button>
                                                    <button
                                                        className={`${styles.btnDanger} ${styles.btnSmall}`}
                                                        type="button"
                                                        disabled={isDeleting}
                                                        onClick={() => onDelete(work.id, work.name)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WorksPanel;
