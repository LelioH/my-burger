import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxi/Auxi';
import useHttpErrorHook from '../../hooks/http-error-hook';

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, errorConfirmedHandler] = useHttpErrorHook(axios);

    return (
      <Aux>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
