import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

function PrivateRoute({ abc: Component, user }) {
  if (user === null) {
    return <Redirect to="/not-found" />;
  }
  return (
    <React.Fragment>
      <Component />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authReducer.user,
  };
}

export default connect(mapStateToProps, {})(PrivateRoute);
