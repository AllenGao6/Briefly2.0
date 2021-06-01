import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Popper,
  Grow,
  Paper,
  MenuList,
  ClickAwayListener,
  Typography,
  Grid,
  Hidden,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import logo from "../../assets/logo/png/colorLogo.png";
import googleIcon from "../../assets/google/googleIcon.svg";
import MenuPopper from "./MenuPopper";
import IconTextButton from "./IconTextButton";

import { GoogleLogin, GoogleLogout } from "react-google-login";

const useStyles = makeStyles((theme) => ({
  logo: {
    height: "5rem",
  },
  logoContainer: {
    paddingLeft: 0,
  },
  tab: {
    ...theme.typography.tab,
    padding: 0,
    minWidth: 10,
    marginLeft: 60,
  },
  tabContainer: {
    marginRight: "7rem",
  },
  loginButton: {
    ...theme.typography.roundedButton,
    marginTop: 3, // visually align tabs and button vertically
  },
  avatar: { color: "white", width: 50, height: 50, marginTop: 5 },
  specialText: {
    color: theme.palette.common.blue,
    fontWeight: 800,
  },
  toolbar: {
    width: 1600,
    [theme.breakpoints.down("sm")]: {
      width: 1000,
    },
    [theme.breakpoints.down("xs")]: {
      width: "inherit",
    },
  },
  googleLogin: {
    height: "4rem",
    width: "20rem",
    fontSize: "1.5rem",
    textTransform: "none",
    background: "white",
  },
}));

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true, // has delay or not
    threshold: 0, // how far user scroll to activate trigger
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function LandingHeader() {
  // styling utilities
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const trigger = useScrollTrigger({
    disableHysteresis: false,
    threshold: 100,
  });

  // define states
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLoginDialog, setOpenLoginDiaog] = useState(false);
  const [user, setUser] = useState(null); // make sure to set user after login

  // json array of objects used for mapping
  const tabs = [
    { name: "Introducion", link: "/" },
    { name: "Demo", link: "/" },
    { name: "Team", link: "/" },
    { name: "About Us", link: "/" },
    { name: "More ...", link: "/" },
  ];

  const accountMenus = [
    {
      icon: <AccountBoxOutlinedIcon style={{ fontSize: "1.5rem" }} />,
      label: "My Profile",
      color: "black",
      backgroundColor: "white",
      onClick: () => console.log("profile"),
    },
    {
      icon: <DashboardOutlinedIcon style={{ fontSize: "1.5rem" }} />,
      label: "Dashboard",
      color: "black",
      backgroundColor: "white",
      onClick: () => console.log("dashboard"),
    },
    {
      icon: (
        <ExitToAppOutlinedIcon style={{ fontSize: "1.5rem", color: "white" }} />
      ),
      label: "Logout",
      color: "white",
      backgroundColor: theme.palette.common.blue,
      onClick: () => console.log("logout"),
    },
  ];

  // functions
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(true);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const handleSocialLogin = (response) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: response.accessToken,
      }),
    };
    fetch("auth/google-oauth2/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUser({ name: data.firstname + data.lastname });
        setOpenMenu(false);
        setOpenLoginDiaog(false);
      });
  };

  const handleSocialLoginFailure = (err) => {
    console.log(err);
  };

  const logout = () => {
    console.log("logged out");
    setUser(null);
  };

  // jsx components

  const loginButton = (
    <Button
      variant="outlined"
      className={classes.loginButton}
      onClick={() => setOpenLoginDiaog(true)}
    >
      Login
    </Button>
  );
  const googleLogin = (
    <GoogleLogin
      client_id="372223287259-nit3rukskraic3obnog1v3n3mpqn3ab7.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={handleSocialLogin}
      onFailure={handleSocialLoginFailure}
      cookiePolicy={"single_host_origin"}
      isSignedIn={true}
      render={(renderProps) => (
        <Button
          variant="contained"
          className={classes.googleLogin}
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

  const accountDetails = (
    <Grid
      container
      direction="column"
      style={{
        padding: "1rem",
        background: theme.palette.common.darkWhite,
        borderRadius: 10,
      }}
    >
      <Grid
        item
        container
        style={{ marginBottom: "1.25rem" }}
        spacing={1}
        justify="center"
      >
        <Grid item>
          <Typography variant="h5" align="center">
            Welcome
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" className={classes.specialText}>
            {user ? user.name : "Anonymous"}
          </Typography>
        </Grid>
      </Grid>
      {accountMenus.map((menu) => (
        <React.Fragment>
          {menu.label === "Logout" ? (
            <div style={{ marginTop: "1.25rem" }} />
          ) : undefined}
          {menu.label === "Logout" ? (
            <GoogleLogout
              clientId="372223287259-nit3rukskraic3obnog1v3n3mpqn3ab7.apps.googleusercontent.com"
              buttonText="Sign Out"
              onLogoutSuccess={logout}
              render={(renderProps) => (
                <IconTextButton
                  icon={menu.icon}
                  label={menu.label}
                  color={menu.color}
                  backgroundColor={menu.backgroundColor}
                  onClick={renderProps.onClick}
                />
              )}
            ></GoogleLogout>
          ) : (
            <IconTextButton
              icon={menu.icon}
              label={menu.label}
              color={menu.color}
              backgroundColor={menu.backgroundColor}
              onClick={menu.onClick}
            />
          )}
        </React.Fragment>
      ))}
    </Grid>
  );

  const profileMenu = (
    <React.Fragment>
      <IconButton aria-controls="menu-avatar" onClick={handleClick}>
        <AccountCircle style={{ color: "white", width: 50, height: 50 }} />
      </IconButton>
      <MenuPopper
        onClose={handleClose}
        open={openMenu}
        anchorEl={anchorEl}
        component={accountDetails}
      />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <Toolbar disableGutters className={classes.toolbar}>
                <Grid
                  item
                  container
                  justify={matchesMD ? "space-evenly" : "center"}
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      className={classes.logoContainer}
                      component={Link}
                      to="/"
                    >
                      <img
                        src={logo}
                        alt="briefly logo"
                        className={classes.logo}
                      />
                    </Button>
                  </Grid>
                  <Hidden mdDown>
                    <Grid item>
                      <Tabs
                        value={tabValue}
                        onChange={(event, value) => setTabValue(value)}
                        indicatorColor="secondary"
                        className={classes.tabContainer}
                      >
                        {tabs.map((tab, i) => (
                          <Tab
                            key={tab.name}
                            component={Link}
                            className={classes.tab}
                            to={tab.link}
                            label={tab.name}
                            disableRipple
                          ></Tab>
                        ))}
                      </Tabs>
                    </Grid>
                  </Hidden>
                  <Grid item>{user ? profileMenu : loginButton}</Grid>
                </Grid>
              </Toolbar>
            </Grid>
          </Grid>
        </AppBar>
      </ElevationScroll>
      <Dialog
        style={{ zIndex: 1302 }}
        open={openLoginDialog}
        onClose={() => setOpenLoginDiaog(false)}
      >
        <DialogContent style={{ padding: 20 }}>
          <Grid container direction="column">
            <Grid item style={{ marginBottom: "2.5rem" }}>
              <Typography variant="h3">Select Signin Options</Typography>
            </Grid>
            <Grid item container justify="center">
              <Grid item>{googleLogin}</Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
