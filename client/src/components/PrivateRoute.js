import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import store from '../store';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const newProps = store.getState();
        const { token } = newProps.userReducer;
        let component;

        if (token) {
          component = <Component {...props} />;
        } else {
          var pathname='/login';
          const gameId = props.match.params.id;
          if(gameId)
          {
            pathname+='/'+gameId;
          }
          component = (
            <Redirect
              to={{
                pathname: pathname,
                state: { from: props.location },
              }}
            />
          );
        }
        return (
          component
        );
      }}
    />
  );
};

export default PrivateRoute;
