import React, {useEffect} from 'react';
import styles from './pages.module.sass';
import {useAppSelector} from '../hooks/useAppSelector';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {getOrders} from '../store/actions/order.action';
import {getWorkCategories} from '../store/actions/workCategory.action';
import {getWorks} from '../store/actions/work.action';

const MainPage = () => {
    const dispatch = useAppDispatch();
    const {orders} = useAppSelector(state => state.ordersReducer);
    const {workCategories} = useAppSelector(state => state.workCategoryReducer);
    const {works} = useAppSelector(state => state.worksReducer);

    useEffect(() => {
        dispatch(getOrders());
        dispatch(getWorkCategories());
        dispatch(getWorks());
    }, [dispatch]);

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Главная</h1>
                <p className={styles.pageSubtitle}>Обзор каталога и смет</p>
            </header>

            <div className={styles.cardGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Сметы</div>
                    <div className={styles.statValue}>{orders?.length ?? 0}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Категории работ</div>
                    <div className={styles.statValue}>{workCategories?.length ?? 0}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Работы в каталоге</div>
                    <div className={styles.statValue}>{works?.length ?? 0}</div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
