import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App";
import {setupStore} from "./store";
import {Provider} from "react-redux";

const store = setupStore();


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App/>
    </Provider>
)
