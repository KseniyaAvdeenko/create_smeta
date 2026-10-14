import React from 'react';
import styles from './header.module.sass';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import ConnectionIndicator from '../ConnectionIndicator/ConnectionIndicator';
import {useAppSelector} from '../../hooks/useAppSelector';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {logout} from '../../store/actions/auth.action';
import {getOrders} from '../../store/actions/order.action';
import {getWorks} from '../../store/actions/work.action';
import {getWorkCategories} from '../../store/actions/workCategory.action';
import {getGdriveStatus} from '../../store/actions/gdrive.action';

const Header = () => {
    const {user} = useAppSelector(state => state.authReducer);
    const dispatch = useAppDispatch();

    const onRefresh = () => {
        dispatch(getOrders());
        dispatch(getWorks());
        dispatch(getWorkCategories());
        dispatch(getGdriveStatus());
    };

    return (
        <header className={styles.header}>
            <div className={styles.userBlock}>
                <span className={styles.userName}>{user?.username}</span>
                <button className={styles.logoutBtn} type="button" onClick={() => dispatch(logout())}>
                    Выйти
                </button>
            </div>
            <button className={styles.refreshBtn} type="button" onClick={onRefresh} title="Обновить данные">
                ⟳ Обновить
            </button>
            <ConnectionIndicator />
            <ThemeSwitcher />
        </header>
    );
};

export default Header;
