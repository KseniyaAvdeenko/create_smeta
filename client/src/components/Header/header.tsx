import React from 'react';
import styles from './header.module.sass'


const Header = () => {
    return (
        <header className={styles.header}>
            {/*<div >*/}
            {/*    {isConnected*/}
            {/*        ? <img src={NetworkOn} alt="connected"/>*/}
            {/*        : <img src={NetworkOff} alt="not connected"/>*/}
            {/*    }*/}
            {/*</div>*/}
        </header>
    );
};

export default Header;