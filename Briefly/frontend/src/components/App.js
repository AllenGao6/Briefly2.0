import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  Link,
  useHistory,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
//ui interface module
import theme from "./Theme";
import darkTheme from "./DarkTheme";
import { ThemeProvider } from "@material-ui/styles";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
//google login
import { GoogleLogin } from "react-google-login";
import LandingPage from "./pages/LandingPage";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagenumer: 0,
      user: null,
      theme: theme,
    };
  }

  setUser = (user) => {
    this.setState({ user });
  };

  switchTheme = () => {
    let newTheme = this.state.theme === theme ? darkTheme : theme;
    this.setState({ theme: newTheme });
  };

  handleSocialLogin = (response) => {
    console.log(response.accessToken);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: response.accessToken,
      }),
    };
    fetch("auth/google-oauth2/", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  handleSocialLoginFailure = (err) => {
    console.log(err);
  };

  renderGoogleButton = () => {
    return (
      <GoogleLogin
        client_id="372223287259-nit3rukskraic3obnog1v3n3mpqn3ab7.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={this.handleSocialLogin}
        onFailure={this.handleSocialLoginFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    );
  };

  render() {
    const { classes } = this.props;
    const testBar = (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              AppBar
            </Typography>
            <IconButton
              color="inherit"
              to="/about-us"
              component={Link}
              className="link"
            >
              About us
            </IconButton>
            <IconButton
              color="inherit"
              to="/dashboard"
              component={Link}
              className="link"
            >
              Demo
            </IconButton>
            <IconButton color="inherit" size="large" aria-label="Login">
              <AccountCircleIcon />
            </IconButton>
            {this.renderGoogleButton()}
          </Toolbar>
        </AppBar>
      </div>
    );
    const stateProps = {
      user: this.state.user,
      setUser: this.setUser,
      switchTheme: this.switchTheme,
    };

    return (
      <ThemeProvider theme={this.state.theme}>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <LandingPage {...props} {...stateProps} />}
            />
            <Route path="/profile" component={Profile} />
            <Route
              path="/dashboard"
              render={(props) => <Dashboard {...props} {...stateProps} />}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default withStyles(useStyles)(App);
