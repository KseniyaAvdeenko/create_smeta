import React, {useEffect} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector";
import {useAppDispatch} from "../../hooks/useAppDispatch";
import {getNetworkConnection} from "../../store/actions/app.action";
import styles from './ConnectionIndicator.module.sass';

const ConnectionIndicator = () => {
    const {isConnected} = useAppSelector(state => state.appReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getNetworkConnection());
        
        // Проверяем подключение каждые 5 секунд
        const interval = setInterval(() => {
            dispatch(getNetworkConnection());
        }, 5000);

        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <div className={styles.indicator} title={isConnected ? 'Подключено к интернету' : 'Нет подключения к интернету'}>
            <div className={styles.statusContainer}>
                <div className={styles.dotWrapper}>
                    <div className={`${styles.dot} ${isConnected ? styles.connected : styles.disconnected}`}></div>
                    <span className={styles.pulse}></span>
                </div>
                <span className={`${styles.text} ${isConnected ? styles.connected : styles.disconnected}`}>
                    {isConnected ? 'Онлайн' : 'Офлайн'}
                </span>
            </div>
        </div>
    );
};

export default ConnectionIndicator;

