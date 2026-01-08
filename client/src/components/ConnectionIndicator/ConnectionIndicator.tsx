import React, {useEffect} from 'react';
import {useAppSelector} from "../../hooks/useAppSelector";
import {useAppDispatch} from "../../hooks/useAppDispatch";
import {getNetworkConnection} from "../../store/actions/app.action";
import styles from './ConnectionIndicator.module.sass';
import {connectedIcon, disConnectedIcon} from "../../assets/icons/icons";


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
        <div className={styles.statusContainer}
             title={isConnected ? 'Подключено к интернету' : 'Нет подключения к интернету'}>
            {isConnected ? connectedIcon(styles.icon_connected) : disConnectedIcon(styles.icon_disconnected)}
        </div>
    );
};

export default ConnectionIndicator;

