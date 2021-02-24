import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name,
  };
};

export const rmvIngredient = (name) => {
  return {
    type: actionTypes.RMV_INGREDIENT,
    ingredientName: name,
  };
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ings: ingredients,
  };
};

export const failFetchingIngredients = () => {
  return {
    type: actionTypes.FAILED_FETCH_INGREDIENTS,
  };
};

export const fetchIngredients = () => {
  return (dispatch) => {
    axios
      .get(
        'https://react-complete-guide-lelio-default-rtdb.firebaseio.com/ingredients.json'
      )
      .then((response) => {
        dispatch(setIngredients(response.data));
      })
      .catch((error) => {
        dispatch(failFetchingIngredients());
      });
  };
};
