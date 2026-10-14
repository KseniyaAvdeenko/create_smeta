import React, {FormEvent, useState} from 'react';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {useAppSelector} from '../hooks/useAppSelector';
import {login, register} from '../store/actions/auth.action';
import styles from './pages.module.sass';

const AuthPage = () => {
    const dispatch = useAppDispatch();
    const {needsRegister, isLoading, error} = useAppSelector(state => state.authReducer);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginValue, setLoginValue] = useState('');

    const onRegister = (e: FormEvent) => {
        e.preventDefault();
        dispatch(register({username, email, password}));
    };

    const onLogin = (e: FormEvent) => {
        e.preventDefault();
        dispatch(login(loginValue, password));
    };

    return (
        <div className={styles.auth}>
            <div className={styles.authCard}>
                <h1 className={styles.authTitle}>Smeta</h1>
                <p className={styles.authSubtitle}>Учёт смет и расценок</p>

                {needsRegister ? (
                    <form className={styles.authForm} onSubmit={onRegister}>
                        <p className={styles.authHint}>Первый запуск — создай аккаунт</p>
                        <input
                            className={styles.authInput}
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <input
                            className={styles.authInput}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className={styles.authInput}
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button className={styles.authButton} type="submit" disabled={isLoading}>
                            {isLoading ? '...' : 'Создать аккаунт'}
                        </button>
                    </form>
                ) : (
                    <form className={styles.authForm} onSubmit={onLogin}>
                        <input
                            className={styles.authInput}
                            placeholder="Email или имя пользователя"
                            value={loginValue}
                            onChange={e => setLoginValue(e.target.value)}
                            required
                        />
                        <input
                            className={styles.authInput}
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button className={styles.authButton} type="submit" disabled={isLoading}>
                            {isLoading ? '...' : 'Войти'}
                        </button>
                    </form>
                )}

                {error && <p className={styles.authError}>{error}</p>}
            </div>
        </div>
    );
};

export default AuthPage;
