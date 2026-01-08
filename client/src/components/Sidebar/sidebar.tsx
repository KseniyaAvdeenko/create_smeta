import React from 'react';
import styles from './sidebar.module.sass';
import {links} from "../../routes";
import {NavLink} from "react-router-dom";


const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            {links.map(({path, name, icon, bg}) => (
                <NavLink
                    className={({isPending,isActive, isTransitioning}) =>
                        isPending || isActive || isTransitioning ? [styles.link, styles.link_active].join(' ') : styles.link
                    }
                    to={path}
                >
                    {icon(bg)}
                    <div>{name}</div>
                </NavLink>
            ))}
        </aside>
    );
};

export default Sidebar;
