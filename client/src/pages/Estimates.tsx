import React from 'react';
import styles from "./pages.module.sass";
import {useAppSelector} from "../hooks/useAppSelector";
import {useAppDispatch} from "../hooks/useAppDispatch";
import {getOrders} from "../store/actions/order.action";
const Estimates = () => {
    const {orders, isLoading} = useAppSelector(state=>state.ordersReducer);
    const dispatch = useAppDispatch();
    console.log(orders)
    const update = ()=> dispatch(getOrders());
    return (
        <div className={styles.estimates}>
         orders
            <button onClick={update}>update</button>
        </div>
    );
};

export default Estimates;
