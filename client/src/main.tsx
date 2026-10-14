import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App";
import {setupStore} from "./store";
import {Provider} from "react-redux";
import * as Sentry from '@sentry/react';
import { captureConsoleIntegration, init as initElectronSentry } from '@sentry/electron/renderer';

initElectronSentry({
    integrations: [captureConsoleIntegration({levels: ['error']})],
}, Sentry.init);
Sentry.setTag('process', 'renderer');

const store = setupStore();


createRoot(document.getElementById('root')!).render(
    <Sentry.ErrorBoundary fallback={<div>Произошла ошибка. Перезапустите приложение.</div>}>
        <Provider store={store}>
            <App/>
        </Provider>
    </Sentry.ErrorBoundary>
)
