import React, {FormEvent, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './pages.module.sass';
import {useAppSelector} from '../hooks/useAppSelector';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {createOrder, deleteOrder, getOrders} from '../store/actions/order.action';

const Estimates = () => {
    const {orders, isLoading, isCreating} = useAppSelector(state => state.ordersReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const sorted = useMemo(
        () => [...(orders ?? [])].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
        [orders],
    );

    const onCreate = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        const created = await dispatch(
            createOrder({name: trimmed, client: client.trim() || undefined}),
        );
        setName('');
        setClient('');
        setShowForm(false);
        if (created) navigate(`/estimates/${created.id}`);
    };

    const onDelete = (id: number, orderName: string) => {
        if (window.confirm(`Удалить смету «${orderName}»?`)) {
            dispatch(deleteOrder(id));
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Сметы</h1>
                <p className={styles.pageSubtitle}>Создание, редактирование и выгрузка в Excel</p>
            </header>

            <div className={styles.panel}>
                <div className={styles.toolbar}>
                    <span className={styles.pageSubtitle} style={{margin: 0}}>
                        Всего: {orders?.length ?? 0}
                    </span>
                    <div className={styles.inlineActions}>
                        <button className={styles.btn} type="button" onClick={() => setShowForm(v => !v)}>
                            + Новая смета
                        </button>
                        <button className={styles.btnGhost} type="button" onClick={() => dispatch(getOrders())}>
                            Обновить
                        </button>
                    </div>
                </div>

                {showForm && (
                    <form className={styles.inlineForm} onSubmit={onCreate}>
                        <input
                            className={styles.input}
                            placeholder="Название сметы"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <input
                            className={styles.input}
                            placeholder="Клиент (необязательно)"
                            value={client}
                            onChange={e => setClient(e.target.value)}
                        />
                        <button className={styles.btn} type="submit" disabled={isCreating}>
                            {isCreating ? '...' : 'Создать'}
                        </button>
                    </form>
                )}

                {isLoading ? (
                    <p className={styles.empty}>Загрузка...</p>
                ) : !sorted.length ? (
                    <p className={styles.empty}>Смет пока нет</p>
                ) : (
                    <ul className={styles.list}>
                        {sorted.map(order => (
                            <li key={order.id} className={styles.listItem}>
                                <div>
                                    <Link className={styles.listItemTitle} to={`/estimates/${order.id}`}>
                                        {order.name}
                                    </Link>
                                    <div className={styles.listItemMeta}>
                                        {order.client || 'Клиент не указан'}
                                        {order.savedOrderFiles?.length
                                            ? ` · файлов: ${order.savedOrderFiles.length}`
                                            : ''}
                                    </div>
                                </div>
                                <div className={styles.inlineActions}>
                                    <Link className={styles.btnGhost} to={`/estimates/${order.id}`}>
                                        Открыть
                                    </Link>
                                    <button
                                        className={styles.btnDanger}
                                        type="button"
                                        onClick={() => onDelete(order.id, order.name)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Estimates;
