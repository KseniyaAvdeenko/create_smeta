import {AppDispatch} from "../index";
import {ntfReducer} from "../reducers/ntf.reducer";
import {INotification} from "../../interface/IApp";

abstract class BaseAction {
    protected dispatch: AppDispatch;

    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }

}

export default class NtfAction extends BaseAction{
    constructor(dispatch: AppDispatch) {
        super(dispatch);
    }
    removeNotification = (ntfId: number) =>this.dispatch(ntfReducer.actions.removeNtf(ntfId));

    addNotification = (ntf: Omit<INotification, 'id'>) => this.dispatch(ntfReducer.actions.setNtf(ntf));
}