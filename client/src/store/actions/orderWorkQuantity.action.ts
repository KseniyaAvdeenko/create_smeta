import {AppDispatch} from '../index';
import NtfAction from './ntf.action';
import {IOrderWorkQuantity} from '../../interface/ISmetaOrders';
import {getOrderById} from './order.action';

type QuantityInput = Pick<IOrderWorkQuantity, 'measurement' | 'quantity'>;

export const getOrderWorkQuantitiesByOrderWorkId = (orderWorkId: number) => async () => {
    return window.electron.getOrderWorkQuantitiesByOrderWorkId(orderWorkId) as Promise<IOrderWorkQuantity[]>;
};

export const createOrderWorkQuantity = (data: QuantityInput & {orderWorkId: number}) => async (dispatch: AppDispatch, getState: () => {ordersReducer: {order: {id: number} | null}}) => {
    try {
        await window.electron.createOrderWorkQuantity(data);
        const orderId = getState().ordersReducer.order?.id;
        if (orderId) dispatch(getOrderById(orderId));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка добавления объёма', type: 'error'});
    }
};

export const updateOrderWorkQuantity = (id: number, data: QuantityInput, orderId: number) => async (dispatch: AppDispatch) => {
    try {
        await window.electron.updateOrderWorkQuantity(id, data);
        dispatch(getOrderById(orderId));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка обновления объёма', type: 'error'});
    }
};

export const deleteOrderWorkQuantity = (id: number, orderId: number) => async (dispatch: AppDispatch) => {
    try {
        await window.electron.deleteOrderWorkQuantity(id);
        dispatch(getOrderById(orderId));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка удаления объёма', type: 'error'});
    }
};

export const syncOrderWorkQuantities = (
    orderId: number,
    orderWorkId: number,
    rows: (QuantityInput & {id?: number})[],
    existing: IOrderWorkQuantity[] = [],
    options?: {silent?: boolean},
) => async (dispatch: AppDispatch) => {
    try {
        const fresh = (await window.electron.getOrderWorkQuantitiesByOrderWorkId(orderWorkId)) as IOrderWorkQuantity[];
        const existingRows = fresh?.length ? fresh : existing;
        const active = rows.filter(r => r.measurement && r.quantity > 0);
        const keptIds = new Set<number>();

        for (const row of active) {
            const match = existingRows.find(item => item.measurement === row.measurement);
            if (match?.id) {
                keptIds.add(match.id);
                await window.electron.updateOrderWorkQuantity(match.id, {
                    measurement: row.measurement,
                    quantity: row.quantity,
                });
            } else {
                const created = await window.electron.createOrderWorkQuantity({
                    orderWorkId,
                    measurement: row.measurement,
                    quantity: row.quantity,
                });
                if (created?.id) keptIds.add(created.id);
            }
        }

        for (const item of existingRows) {
            if (item.id && !keptIds.has(item.id)) {
                await window.electron.deleteOrderWorkQuantity(item.id);
            }
        }

        dispatch(getOrderById(orderId));
        if (!options?.silent) {
            new NtfAction(dispatch).addNotification({message: 'Объёмы сохранены', type: 'success'});
        }
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка сохранения объёмов', type: 'error'});
    }
};
