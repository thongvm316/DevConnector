import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = (props) => {
    const {
        component: Component, // component = Dashboard comp
        auth: { isAuthenticated, loading }, 
        ...rest
    } = props
    return  (
        <Route
          {...rest}
          render={props =>
            !isAuthenticated && !loading ? (
              <Redirect to='/login' />
            ) : (
              <Component {...props}/> // Component = Dashboard comp
            )
          }
        />
      );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);

/* Lam theo -> phan tich syntax -> test code ok -> suy doan muc dich -> phan tich lai giai phap */

/* 
Purpose: When user go to dashboard page, neu user chua login, he thong se redirect ve login page
*/
