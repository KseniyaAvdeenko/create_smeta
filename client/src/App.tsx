import {HashRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Header/header";
import {useEffect, useState} from "react";
import {useAppSelector} from "./hooks/useAppSelector";
import {useAppDispatch} from "./hooks/useAppDispatch";
import {getCurrentThemeMode} from "./store/actions/app.action";
import MainPage from "./pages/MainPage";


function App() {
    const {currentMode} = useAppSelector(state => state.appReducer);
    const [colorMetaTag] = useState<HTMLElement | null>(() => document.getElementById('theme-color-meta') as HTMLElement | null);
    const dispatch = useAppDispatch();

    useEffect(()=> {
        dispatch(getCurrentThemeMode())
    }, [dispatch])

    useEffect(() => {
        if (colorMetaTag) {
            colorMetaTag.content = currentMode === 'light' ? '#ffffff' : '#0F1C2E';
        }
        document.documentElement.setAttribute('data-theme', currentMode || 'light');
    }, [currentMode, colorMetaTag]);

    return (
        <HashRouter>
            <Header/>
            <Routes>
                <Route index element={<MainPage/>}/>
                <Route path="*" element={<MainPage/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App
