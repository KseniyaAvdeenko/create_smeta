import {HashRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Header/header";
import {useEffect, useState} from "react";
import {useAppSelector} from "./hooks/useAppSelector";
import {useAppDispatch} from "./hooks/useAppDispatch";
import {getCurrentThemeMode, getScreenSizes} from "./store/actions/app.action";
import MainPage from "./pages/MainPage";
import Layout from "./components/Layout/layout";
import Estimates from "./pages/Estimates";
import EstimateSettings from "./pages/EstimateSettings";


function App() {
    const {currentMode, screen} = useAppSelector(state => state.appReducer);
    const [colorMetaTag] = useState<HTMLElement | null>(() => document.getElementById('theme-color-meta') as HTMLElement | null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getScreenSizes())
        dispatch(getCurrentThemeMode())
    }, [dispatch])

    useEffect(() => {
        if (colorMetaTag) {
            colorMetaTag.content = currentMode === 'light' ? '#ffffff' : '#0F1C2E';
        }
        document.documentElement.setAttribute('data-theme', currentMode || 'light');
        // if(screen.width && screen.height) {
        //     document.body.style.height = `${screen.height-40}px`;
        //     document.body.style.width = `${screen.width-40}px`;
        // }
    }, [currentMode, colorMetaTag]);

    return (
        <HashRouter>
            <Header/>
            <Layout>
                <Routes>
                    <Route index element={<MainPage/>}/>
                    <Route path={'/estimates'} element={<Estimates/>}/>
                    <Route path={'/estimate-settings'} element={<EstimateSettings/>}/>
                    <Route path="*" element={<MainPage/>}/>
                </Routes>
            </Layout>
        </HashRouter>
    )
}

export default App
