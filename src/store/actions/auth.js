import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.START_AUTH,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.SUCCESS_AUTH,
    idToken: token,
    userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.FAIL_AUTH,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirantionDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.LOGOUT_AUTH,
  };
};

export const checkAuthTimeout = (expirantionTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirantionTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBpFURVGPAerj-OGMz6beZZpL3VygO-xy0';

    if (!isSignUp) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBpFURVGPAerj-OGMz6beZZpL3VygO-xy0';
    }

    axios
      .post(url, authData)
      .then((response) => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((error) => {
        dispatch(authFail(error.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const userId = localStorage.getItem('userId');
      const expirantionDate = new Date(localStorage.getItem('expirantionDate'));
      if (expirantionDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirantionDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
