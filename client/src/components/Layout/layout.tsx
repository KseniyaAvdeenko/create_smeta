import React, {FC} from 'react';
import styles from './layout.module.sass';
import Sidebar from "../Sidebar/sidebar";

interface ILayoutProps {
    children: React.ReactNode;
}
const Layout: FC<ILayoutProps> = ({children}) => {
    return (
        <div className={styles.layout}>
            <Sidebar/>
            {children}
        </div>
    );
};

export default Layout;
