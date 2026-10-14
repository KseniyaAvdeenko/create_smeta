import React from 'react';
import styles from './header.module.sass';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import ConnectionIndicator from '../ConnectionIndicator/ConnectionIndicator';
import {useAppSelector} from '../../hooks/useAppSelector';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {logout} from '../../store/actions/auth.action';

const Header = () => {
    const {user} = useAppSelector(state => state.authReducer);
    const dispatch = useAppDispatch();

    return (
        <header className={styles.header}>
            <div className={styles.userBlock}>
                <span className={styles.userName}>{user?.username}</span>
                <button className={styles.logoutBtn} type="button" onClick={() => dispatch(logout())}>
                    Выйти
                </button>
            </div>
            <ConnectionIndicator />
            <ThemeSwitcher />
        </header>
    );
};

export default Header;
