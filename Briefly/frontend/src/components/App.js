import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Dashboard from "./Dashboard";
import NavBar from "./Navbar";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <NavBar />
        {this.props.name}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about-us" component={About} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App name="Hello, my boys, this is where we begin" />, appDiv);
