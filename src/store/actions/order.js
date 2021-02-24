import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const successPurchase = (id, orderData) => {
  return {
    type: actionTypes.SUCCESS_PURCHASE,
    orderId: id,
    orderData: orderData,
  };
};

export const failPurchase = (error) => {
  return {
    type: actionTypes.FAIL_PURCHASE,
    error: error,
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.START_PURCHASE,
  };
};

export const purchaseBurger = (orderData, token) => {
  return (dispatch) => {
    dispatch(purchaseBurgerStart());
    axios
      .post('/orders.json?auth=' + token, orderData)
      .then((response) => {
        dispatch(successPurchase(response.data.name, orderData));
      })
      .catch((error) => {
        dispatch(failPurchase(error));
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.INIT_PURCHASE,
  };
};

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.SUCCESSED_FETCH_ORDERS,
    orders: orders,
  };
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FAILED_FETCH_ORDERS,
    error: error,
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS,
  };
};

export const fetchOrders = (token, userId) => {
  return (dispatch) => {
    dispatch(fetchOrdersStart());
    const queryParams =
      '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios
      .get('/orders.json' + queryParams)
      .then((response) => {
        const fetchedOrders = [];
        for (let key in response.data) {
          fetchedOrders.push({
            ...response.data[key],
            id: key,
          });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFail(error));
      });
  };
};
