import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const burgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();

  const ings = useSelector((state) => {
    return state.burgerBuilder.ingredients;
  });
  const price = useSelector((state) => {
    return state.burgerBuilder.totalPrice;
  });
  const error = useSelector((state) => {
    return state.burgerBuilder.error;
  });
  const isAuthenticated = useSelector((state) => {
    return state.auth.token !== null;
  });

  const onIngredientAdd = (ingName) => dispatch(actions.addIngredient(ingName));
  const onIngredientRmv = (ingName) => dispatch(actions.rmvIngredient(ingName));
  const onFetchIngredients = useCallback(
    () => dispatch(actions.fetchIngredients()),
    [dispatch]
  );
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onFetchIngredients();
  }, [onFetchIngredients]);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((ingredientKey) => {
        return ingredients[ingredientKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push('/checkout');
  };

  const disableInfo = {
    ...ings,
  };

  for (let key in disableInfo) {
    disableInfo[key] = disableInfo[key] <= 0;
  }

  let orderSummary = null;

  let burger = error ? (
    <p style={{ textAlign: 'center' }}>Ingredients can't be loaded</p>
  ) : (
    <Spinner />
  );

  if (ings) {
    burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          ingredientAdded={onIngredientAdd}
          ingredientRemoved={onIngredientRmv}
          disabled={disableInfo}
          purchasable={updatePurchaseState(ings)}
          ordered={purchaseHandler}
          price={price}
          isAuth={isAuthenticated}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ings}
        price={price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

export default withErrorHandler(burgerBuilder, axios);
