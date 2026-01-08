import React from 'react';
import styles from './header.module.sass'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import ConnectionIndicator from '../ConnectionIndicator/ConnectionIndicator';


const Header = () => {
    return (
        <header className={styles.header}>
            <ConnectionIndicator/>
            <ThemeSwitcher/>
        </header>
    );
};

export default Header;