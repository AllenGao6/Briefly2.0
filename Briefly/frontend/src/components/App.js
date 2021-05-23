import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Redirect, Link, useHistory } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Dashboard from "./Dashboard";
import NavBar from "./Navbar";
import Login from "./Login";
//ui interface module
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
//google login
import GoogleLogin from 'react-google-login';
import googleLogin from "./service/googleLogin"

const useStyles = theme => ({
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
  }

 
  render() {
    const { classes } = this.props;
    
    const responseGoogle = async(response) => {
      let googleResponse  = await googleLogin(response.accessToken)
      console.log(googleResponse);
      console.log(response);
    }

    return (
        <BrowserRouter>
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
          <IconButton color="inherit" to="/about-us" component={Link} className="link">
            About us
          </IconButton>
          <IconButton color="inherit" to="/dashboard" component={Link} className="link">
            Demo
          </IconButton>
          <IconButton color="inherit" size="large" aria-label="Login">
              <AccountCircleIcon />
          </IconButton>
          <GoogleLogin
            clientId="372223287259-nit3rukskraic3obnog1v3n3mpqn3ab7.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </Toolbar>
            </AppBar>
          </div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about-us" component={About} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
    );
  }
}

export default withStyles(useStyles)(App);