import React from 'react';
import {useAppSelector} from "../../hooks/useAppSelector";
import {useAppDispatch} from "../../hooks/useAppDispatch";
import {saveThemeSetting} from "../../store/actions/userSettings.action";
import styles from './ThemeSwitcher.module.sass';

const ThemeSwitcher = () => {
    const {currentMode} = useAppSelector(state => state.appReducer);
    const dispatch = useAppDispatch();

    const handleToggle = () => {
        const newTheme = currentMode === 'dark' ? 'light' : 'dark';
        dispatch(saveThemeSetting(newTheme));
    };

    return (
        <button 
            className={styles.switcher}
            onClick={handleToggle}
            aria-label={`Переключить на ${currentMode === 'dark' ? 'светлую' : 'темную'} тему`}
        >
            <div className={`${styles.track} ${currentMode === 'dark' ? styles.dark : styles.light}`}>
                <div className={`${styles.thumb} ${currentMode === 'dark' ? styles.thumbDark : styles.thumbLight}`}>
                    <span className={styles.icon}>
                        {currentMode === 'dark' ? '🌙' : '☀️'}
                    </span>
                </div>
            </div>
        </button>
    );
};

export default ThemeSwitcher;

