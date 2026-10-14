import React, {useEffect, useState} from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header/header';
import {useAppSelector} from './hooks/useAppSelector';
import {useAppDispatch} from './hooks/useAppDispatch';
import {getScreenSizes} from './store/actions/app.action';
import {initAuth} from './store/actions/auth.action';
import MainPage from './pages/MainPage';
import Layout from './components/Layout/layout';
import Estimates from './pages/Estimates';
import EstimateDetail from './pages/EstimateDetail';
import EstimateSettings from './pages/EstimateSettings';
import AuthPage from './pages/AuthPage';

function App() {
    const {currentMode} = useAppSelector(state => state.appReducer);
    const {isAuthenticated, isLoading} = useAppSelector(state => state.authReducer);
    const [colorMetaTag] = useState<HTMLMetaElement | null>(() =>
        document.getElementById('theme-color-meta') as HTMLMetaElement | null,
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(getScreenSizes());
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (colorMetaTag) colorMetaTag.content = currentMode === 'light' ? '#ffffff' : '#0F1C2E';
        document.documentElement.setAttribute('data-theme', currentMode || 'light');
    }, [currentMode, colorMetaTag]);

    if (isLoading) {
        return <div className="appLoading">Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return <AuthPage />;
    }

    return (
        <HashRouter>
            <Header />
            <Layout>
                <Routes>
                    <Route index element={<MainPage />} />
                    <Route path="/estimates" element={<Estimates />} />
                    <Route path="/estimates/:id" element={<EstimateDetail />} />
                    <Route path="/estimate-settings" element={<EstimateSettings />} />
                    <Route path="*" element={<MainPage />} />
                </Routes>
            </Layout>
        </HashRouter>
    );
}

export default App;
