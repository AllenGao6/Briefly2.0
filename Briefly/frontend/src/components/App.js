import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Workspace from "./pages/Workspace";
//ui interface module
import theme from "./Theme";
import darkTheme from "./DarkTheme";
import { ThemeProvider } from "@material-ui/styles";
//google login
//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <LandingPage {...props} {...stateProps} />}
            />
            <Route path="/profile" component={Profile} />
            <Route
              path="/dashboard"
              exact
              render={(props) => (
                <Dashboard {...props} {...stateProps} isDashboard={true} />
              )}
            />
            <Route
              path="/dashboard/:id/video"
              exact
              render={(props) => (
                <Dashboard
                  {...props}
                  {...stateProps}
                  isDashboard={false}
                  mediaType={"video"}
                />
              )}
            />
            <Route
              path="/dashboard/:id/audio"
              exact
              render={(props) => (
                <Dashboard
                  {...props}
                  {...stateProps}
                  isDashboard={false}
                  mediaType={"audio"}
                />
              )}
            />
            <Route
              path="/dashboard/:id/text"
              exact
              render={(props) => (
                <Dashboard
                  {...props}
                  {...stateProps}
                  isDashboard={false}
                  mediaType={"text"}
                />
              )}
            />
            <Route
              path="/dashboard/:id/:mediaType/:mediaId"
              component={Workspace}
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
