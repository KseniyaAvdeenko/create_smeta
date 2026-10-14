import React, {useEffect, useState} from 'react';
import styles from './settings.module.sass';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {getMeasurements} from '../store/actions/measurement.action';
import {getWorkCategories} from '../store/actions/workCategory.action';
import {getWorks} from '../store/actions/work.action';
import CategoriesPanel from '../components/Settings/CategoriesPanel';
import MeasurementsPanel from '../components/Settings/MeasurementsPanel';
import WorksPanel from '../components/Settings/WorksPanel';
import IntegrationsPanel from '../components/Settings/IntegrationsPanel';
import AccountPanel from '../components/Settings/AccountPanel';

const TABS = [
    {id: 'categories', label: 'Категории'},
    {id: 'measurements', label: 'Единицы'},
    {id: 'works', label: 'Работы'},
    {id: 'integrations', label: 'Интеграции'},
    {id: 'account', label: 'Аккаунт'},
] as const;

type TabId = (typeof TABS)[number]['id'];

const EstimateSettings = () => {
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState<TabId>('categories');

    useEffect(() => {
        dispatch(getWorkCategories());
        dispatch(getMeasurements());
        dispatch(getWorks());
    }, [dispatch]);

    const renderPanel = () => {
        switch (tab) {
            case 'categories':
                return <CategoriesPanel />;
            case 'measurements':
                return <MeasurementsPanel />;
            case 'works':
                return <WorksPanel />;
            case 'integrations':
                return <IntegrationsPanel />;
            case 'account':
                return <AccountPanel />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h2>Настройки</h2>
                <p>Каталог работ, единицы измерения и интеграции</p>
            </header>

            <div className={styles.layout}>
                <nav className={styles.tabs}>
                    {TABS.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            className={
                                tab === item.id
                                    ? `${styles.tab} ${styles.tab_active}`
                                    : styles.tab
                            }
                            onClick={() => setTab(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <main className={styles.content}>{renderPanel()}</main>
            </div>
        </div>
    );
};

export default EstimateSettings;
