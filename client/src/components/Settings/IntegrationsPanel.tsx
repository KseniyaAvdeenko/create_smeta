import React, {FormEvent, useEffect, useState} from 'react';
import styles from '../../pages/settings.module.sass';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {useAppSelector} from '../../hooks/useAppSelector';
import {
    connectGdrive,
    disconnectGdrive,
    getGdriveStatus,
    setGdriveDefaultFolder,
} from '../../store/actions/gdrive.action';

const IntegrationsPanel = () => {
    const dispatch = useAppDispatch();
    const {status, isLoading, isConnecting, error} = useAppSelector(state => state.gdriveReducer);
    const [folderId, setFolderId] = useState('');

    useEffect(() => {
        dispatch(getGdriveStatus());
    }, [dispatch]);

    useEffect(() => {
        if (status?.defaultFolder) setFolderId(status.defaultFolder);
    }, [status?.defaultFolder]);

    const onSaveFolder = (e: FormEvent) => {
        e.preventDefault();
        if (folderId.trim()) dispatch(setGdriveDefaultFolder(folderId.trim()));
    };

    return (
        <div className={styles.panel}>
            <div>
                <h3 className={styles.panelTitle}>Интеграции</h3>
                <p className={styles.panelHint}>Выгрузка смет в Google Drive</p>
            </div>

            <div className={styles.card}>
                <span className={styles.label}>Google Drive</span>

                {isLoading ? (
                    <p className={styles.loading}>Загрузка...</p>
                ) : status?.connected ? (
                    <div className={styles.cardStack}>
                        <p className={styles.ok}>Подключён: {status.email}</p>

                        <form className={styles.form} onSubmit={onSaveFolder}>
                            <span className={styles.label}>Папка для выгрузки (необязательно)</span>
                            <p className={styles.panelHint}>
                                При подключении создаётся папка «Smeta». Свой ID — только если папка
                                создана этим приложением.
                            </p>
                            <div className={styles.formRow}>
                                <input
                                    className={styles.input}
                                    placeholder="Авто: папка Smeta"
                                    value={folderId}
                                    onChange={e => setFolderId(e.target.value)}
                                />
                                <button className={styles.btn} type="submit">
                                    Сохранить папку
                                </button>
                            </div>
                        </form>

                        <div className={styles.cardActions}>
                            <button
                                className={styles.btnGhost}
                                type="button"
                                onClick={() => dispatch(disconnectGdrive())}
                            >
                                Отключить
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.cardStack}>
                        <p className={styles.panelHint}>Google Drive не подключён</p>
                        <div className={styles.cardActions}>
                            <button
                                className={styles.btn}
                                type="button"
                                disabled={isConnecting}
                                onClick={() => dispatch(connectGdrive())}
                            >
                                {isConnecting ? 'Ожидание авторизации...' : 'Подключить Google Drive'}
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

export default IntegrationsPanel;
