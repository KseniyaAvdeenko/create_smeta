import React, {FormEvent, useState} from 'react';
import styles from '../../pages/settings.module.sass';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {useAppSelector} from '../../hooks/useAppSelector';
import {
    createWorkCategory,
    deleteWorkCategory,
    updateWorkCategory,
} from '../../store/actions/workCategory.action';

const CategoriesPanel = () => {
    const dispatch = useAppDispatch();
    const {workCategories, isLoading, isCreating, isUpdating, isDeleting} = useAppSelector(
        state => state.workCategoryReducer,
    );
    const [name, setName] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const onCreate = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        dispatch(createWorkCategory({name: trimmed}));
        setName('');
    };

    const startEdit = (id: number, currentName: string) => {
        setEditId(id);
        setEditName(currentName);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditName('');
    };

    const onUpdate = (e: FormEvent) => {
        e.preventDefault();
        if (editId === null) return;
        const trimmed = editName.trim();
        if (!trimmed) return;
        dispatch(updateWorkCategory(editId, {name: trimmed}));
        cancelEdit();
    };

    const onDelete = (id: number) => {
        if (window.confirm('Удалить категорию? Работы в ней могут стать недоступны.')) {
            dispatch(deleteWorkCategory(id));
        }
    };

    return (
        <div className={styles.panel}>
            <div>
                <h3 className={styles.panelTitle}>Категории работ</h3>
                <p className={styles.panelHint}>Группировка работ в сметах</p>
            </div>

            <div className={styles.card}>
                <form className={styles.form} onSubmit={onCreate}>
                    <span className={styles.label}>Новая категория</span>
                    <div className={styles.formRow}>
                        <input
                            className={styles.input}
                            placeholder="Например: Отделочные работы"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <button className={styles.btn} type="submit" disabled={isCreating}>
                            {isCreating ? '...' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>

            {isLoading ? (
                <p className={styles.loading}>Загрузка...</p>
            ) : !workCategories?.length ? (
                <p className={styles.empty}>Категорий пока нет</p>
            ) : (
                <div className={styles.list}>
                    {workCategories.map(cat => (
                        <div key={cat.id} className={styles.listItem}>
                            {editId === cat.id ? (
                                <form className={styles.form} style={{flex: 1}} onSubmit={onUpdate}>
                                    <div className={styles.formRow}>
                                        <input
                                            className={styles.input}
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            autoFocus
                                        />
                                        <button className={styles.btn} type="submit" disabled={isUpdating}>
                                            Сохранить
                                        </button>
                                        <button
                                            className={styles.btnGhost}
                                            type="button"
                                            onClick={cancelEdit}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className={styles.listItemMain}>
                                        <span className={styles.listItemTitle}>{cat.name}</span>
                                        <span className={styles.listItemMeta}>
                                            {cat.works?.length ?? 0} работ
                                        </span>
                                    </div>
                                    <div className={styles.listItemActions}>
                                        <button
                                            className={`${styles.btnGhost} ${styles.btnSmall}`}
                                            type="button"
                                            onClick={() => startEdit(cat.id, cat.name)}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            className={`${styles.btnDanger} ${styles.btnSmall}`}
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={() => onDelete(cat.id)}
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

export default CategoriesPanel;
