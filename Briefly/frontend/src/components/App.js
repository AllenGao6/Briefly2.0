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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagenumer: 0,
      theme: theme,
      //add in other user information here later
    };
  }

  switchTheme = () => {
    const newTheme = this.state.theme === theme ? darkTheme : theme;
    this.setState({ theme: newTheme });
    console.log("switched");
  };

  render() {
    const stateProps = {
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

export default App;
