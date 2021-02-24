import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const purchaseInit = (state, action) => {
  return updateObject(state, { purchased: false });
};

const startPurchase = (state, action) => {
  return updateObject(state, { loading: true });
};

const successPurchase = (state, action) => {
  const newOrder = updateObject(action.orderData, { id: action.orderId });
  return updateObject(state, {
    loading: false,
    orders: state.orders.concat(newOrder),
    purchased: true,
  });
};

const failPurchase = (state, action) => {
  return updateObject(state, { loading: false });
};

const fetchOrders = (state, action) => {
  return updateObject(state, { loading: true });
};

const successedFetchOrders = (state, action) => {
  return updateObject(state, { orders: action.orders, loading: false });
};

const failedFetchOrders = (state, action) => {
  return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_PURCHASE:
      return purchaseInit(state, action);

    case actionTypes.START_PURCHASE:
      return startPurchase(state, action);

    case actionTypes.SUCCESS_PURCHASE:
      return successPurchase(state, action);

    case actionTypes.FAIL_PURCHASE:
      return failPurchase(state, action);

    case actionTypes.FETCH_ORDERS:
      return fetchOrders(state, action);

    case actionTypes.SUCCESSED_FETCH_ORDERS:
      return successedFetchOrders(state, action);

    case actionTypes.FAILED_FETCH_ORDERS:
      return failedFetchOrders(state, action);

    default:
      return state;
  }
};

export default reducer;
