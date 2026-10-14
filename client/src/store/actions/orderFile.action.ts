import {AppDispatch} from '../index';
import NtfAction from './ntf.action';
import {orderFilesReducer} from '../reducers/orderFile.reducer';
import {IOrder, IOrderWork} from '../../interface/ISmetaOrders';
import {getOrderById} from './order.action';
import {getGdriveStatus} from './gdrive.action';

type ExcelWorkRow = {
    categoryName: string;
    workName: string;
    measurement: string;
    quantity: number;
    price: number;
};

export const flattenOrderWorksForExcel = (orderWorks: IOrderWork[] = []): ExcelWorkRow[] =>
    orderWorks.flatMap(ow => {
        const work = ow.work;
        if (!work) return [];
        const category = work.category?.name ?? 'Работы';
        return (ow.orderWorkQuantities ?? [])
            .filter(q => Number(q.quantity) > 0)
            .map(q => ({
            categoryName: category,
            workName: work.name,
            measurement: q.measurement,
            quantity: q.quantity,
            price:
                work.workMeasurements?.find(wm => wm.measurement?.shortName === q.measurement)?.cost ??
                0,
        }));
    });

export const getOrderFiles = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(orderFilesReducer.actions.fetchOrderFiles());
        const resp = await window.electron.getAllOrderFiles();
        dispatch(orderFilesReducer.actions.loadOrderFilesSuccess(resp));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({
            message: 'Ошибка загрузки файлов заказа (сметы)',
            type: 'error',
        });
        dispatch(orderFilesReducer.actions.loadOrderFilesFail());
    }
};

export const getOrderFilesByOrderId = (orderId: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(orderFilesReducer.actions.fetchOrderFiles());
        const resp = await window.electron.getAllOrderFilesByOrderId(orderId);
        dispatch(orderFilesReducer.actions.loadOrderFilesOrderIdSuccess(resp));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({
            message: 'Ошибка загрузки файлов заказа (сметы)',
            type: 'error',
        });
        dispatch(orderFilesReducer.actions.loadOrderFilesOrderIdFail());
    }
};

export const getOrderFileById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const resp = await window.electron.getOrderFileById(id);
        dispatch(orderFilesReducer.actions.loadOrderFileSuccess(resp));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({
            message: 'Ошибка загрузки файла заказа (сметы)',
            type: 'error',
        });
        dispatch(orderFilesReducer.actions.loadOrderFileFail());
    }
};

export const generateOrderFile = (order: IOrder) => async (dispatch: AppDispatch) => {
    try {
        dispatch(orderFilesReducer.actions.startCreating());
        const flatWorks = flattenOrderWorksForExcel(order.orderWorks);
        const resp = await window.electron.generateOrderFile(order, flatWorks as unknown as IOrderWork[]);
        if (resp) dispatch(orderFilesReducer.actions.createOrderFileSuccess(resp));
        dispatch(getOrderById(order.id));
        dispatch(getGdriveStatus());
        new NtfAction(dispatch).addNotification({message: 'Файл сметы создан', type: 'success'});
    } catch (e) {
        console.error(e);
        dispatch(orderFilesReducer.actions.createOrderFileFail());
        new NtfAction(dispatch).addNotification({
            message: e instanceof Error ? e.message : 'Ошибка создания файла (проверь Google Drive)',
            type: 'error',
        });
    }
};

export const deleteOrderFile = (id: number, orderId?: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(orderFilesReducer.actions.startDeleting());
        const resp = await window.electron.deleteOrderFile(id);
        if (Boolean(resp)) dispatch(orderFilesReducer.actions.deleteOrderFileSuccess(id));
        if (orderId) dispatch(getOrderById(orderId));
        new NtfAction(dispatch).addNotification({message: 'Файл удалён', type: 'success'});
    } catch (e) {
        console.error(e);
        dispatch(orderFilesReducer.actions.deleteOrderFileFail());
        new NtfAction(dispatch).addNotification({message: 'Ошибка удаления файла', type: 'error'});
    }
};
