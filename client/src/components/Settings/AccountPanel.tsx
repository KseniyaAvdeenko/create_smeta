import React from 'react';
import styles from '../../pages/settings.module.sass';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {useAppSelector} from '../../hooks/useAppSelector';
import {logout} from '../../store/actions/auth.action';

const AccountPanel = () => {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.authReducer);

    return (
        <div className={styles.panel}>
            <div>
                <h3 className={styles.panelTitle}>Аккаунт</h3>
                <p className={styles.panelHint}>Текущий пользователь приложения</p>
            </div>

            <div className={styles.card}>
                <div className={styles.listItemMain}>
                    <span className={styles.listItemTitle}>{user?.username}</span>
                    <span className={styles.listItemMeta}>{user?.email}</span>
                    {user?.isAdmin && <span className={styles.badge}>Администратор</span>}
                </div>
                <div className={styles.divider} />
                <button
                    className={styles.btnGhost}
                    type="button"
                    onClick={() => dispatch(logout())}
                >
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default AccountPanel;
