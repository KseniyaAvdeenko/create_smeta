import React from 'react';
import styles from './sidebar.module.sass';
import {links} from '../../routes';
import {NavLink} from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.brandTitle}>Smeta</div>
                <div className={styles.brandSub}>Сметы и расценки</div>
            </div>

            <nav className={styles.nav}>
                {links.map(({path, name, icon}) => (
                    <NavLink
                        key={name}
                        to={path}
                        end={path === '/'}
                        className={({isActive}) =>
                            isActive ? `${styles.link} ${styles.link_active}` : styles.link
                        }
                    >
                        {({isActive}) => (
                            <>
                                {icon(isActive ? '#ffffff' : 'currentColor')}
                                <span>{name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
