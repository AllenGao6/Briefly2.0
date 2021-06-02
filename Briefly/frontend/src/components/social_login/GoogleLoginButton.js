import React from "react";
import googleIcon from "../../assets/google/googleIcon.svg";
import { GoogleLogin } from "react-google-login";
import { Button } from "@material-ui/core";

export default function GoogleLoginButton({ onSuccess, onFailure }) {
  return (
    <GoogleLogin
      client_id="372223287259-nit3rukskraic3obnog1v3n3mpqn3ab7.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
      isSignedIn={true}
      render={(renderProps) => (
        <Button
          variant="contained"
          style={{
            height: "4rem",
            width: "20rem",
            fontSize: "1.5rem",
            textTransform: "none",
            background: "white",
          }}
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          elevation={5}
        >
          <img
            src={googleIcon}
            alt="google login"
            style={{ height: "2rem", marginRight: "1.5rem" }}
          />
          Login with Google
        </Button>
      )}
    />
  );
}
