import React, {FormEvent, useState} from 'react';
import styles from '../../pages/settings.module.sass';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {useAppSelector} from '../../hooks/useAppSelector';
import {
    createMeasurement,
    deleteMeasurement,
    updateMeasurement,
} from '../../store/actions/measurement.action';

const MeasurementsPanel = () => {
    const dispatch = useAppDispatch();
    const {measurements, isLoading, isCreating, isUpdating, isDeleting} = useAppSelector(
        state => state.measurementReducer,
    );
    const [shortName, setShortName] = useState('');
    const [fullName, setFullName] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editShort, setEditShort] = useState('');
    const [editFull, setEditFull] = useState('');

    const onCreate = (e: FormEvent) => {
        e.preventDefault();
        const short = shortName.trim();
        if (!short) return;
        dispatch(
            createMeasurement({
                shortName: short,
                fullName: fullName.trim() || undefined,
            }),
        );
        setShortName('');
        setFullName('');
    };

    const startEdit = (id: number, short: string, full?: string) => {
        setEditId(id);
        setEditShort(short);
        setEditFull(full ?? '');
    };

    const onUpdate = (e: FormEvent) => {
        e.preventDefault();
        if (editId === null) return;
        const short = editShort.trim();
        if (!short) return;
        dispatch(
            updateMeasurement(editId, {
                shortName: short,
                fullName: editFull.trim() || undefined,
            }),
        );
        setEditId(null);
    };

    const onDelete = (id: number, label: string) => {
        if (window.confirm(`Удалить единицу «${label}»?`)) {
            dispatch(deleteMeasurement(id));
        }
    };

    return (
        <div className={styles.panel}>
            <div>
                <h3 className={styles.panelTitle}>Единицы измерения</h3>
                <p className={styles.panelHint}>м², м.п., шт. и т.д.</p>
            </div>

            <div className={styles.card}>
                <form className={styles.form} onSubmit={onCreate}>
                    <span className={styles.label}>Новая единица</span>
                    <div className={styles.formRow}>
                        <input
                            className={styles.input}
                            placeholder="Кратко: м²"
                            value={shortName}
                            onChange={e => setShortName(e.target.value)}
                        />
                        <input
                            className={styles.input}
                            placeholder="Полное название (необязательно)"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                        <button className={styles.btn} type="submit" disabled={isCreating}>
                            {isCreating ? '...' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>

            {isLoading ? (
                <p className={styles.loading}>Загрузка...</p>
            ) : !measurements?.length ? (
                <p className={styles.empty}>Единиц измерения пока нет</p>
            ) : (
                <div className={styles.list}>
                    {measurements.map(m => (
                        <div key={m.id} className={styles.listItem}>
                            {editId === m.id ? (
                                <form className={styles.form} style={{flex: 1}} onSubmit={onUpdate}>
                                    <div className={styles.formRow}>
                                        <input
                                            className={styles.input}
                                            value={editShort}
                                            onChange={e => setEditShort(e.target.value)}
                                        />
                                        <input
                                            className={styles.input}
                                            value={editFull}
                                            onChange={e => setEditFull(e.target.value)}
                                        />
                                        <button className={styles.btn} type="submit" disabled={isUpdating}>
                                            Сохранить
                                        </button>
                                        <button
                                            className={styles.btnGhost}
                                            type="button"
                                            onClick={() => setEditId(null)}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className={styles.listItemMain}>
                                        <span className={styles.listItemTitle}>{m.shortName}</span>
                                        {m.fullName && (
                                            <span className={styles.listItemMeta}>{m.fullName}</span>
                                        )}
                                    </div>
                                    <div className={styles.listItemActions}>
                                        <button
                                            className={`${styles.btnGhost} ${styles.btnSmall}`}
                                            type="button"
                                            onClick={() => startEdit(m.id, m.shortName, m.fullName)}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            className={`${styles.btnDanger} ${styles.btnSmall}`}
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={() => onDelete(m.id, m.shortName)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeasurementsPanel;
