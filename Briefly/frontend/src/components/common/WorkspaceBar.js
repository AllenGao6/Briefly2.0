import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  Grid,
  Hidden,
  InputAdornment,
  Avatar,
  InputBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { darken, lighten } from "@material-ui/core/styles";

import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import DarkModeIcon from "@material-ui/icons/Brightness7";
import LightModeIcon from "@material-ui/icons/Brightness4";

import logo from "../../assets/logo/png/colorLogo.png";
import blackLogo from "../../assets/logo/png/blackLogo.png";
import MenuPopper from "./MenuPopper";
import IconTextButton from "./IconTextButton";

import { GoogleLogout } from "react-google-login";
import LoginDialog from "../social_login/LoginDialog";

import { connect } from "react-redux";
import { login, logout } from "../../redux/actions/auth_actions";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  appbar: {
    background:
      theme.palette.type == "dark"
        ? "#1e272e"
        : "linear-gradient(to right, #1e90ff, #4381ff, #6a6fff, #9055fc, #b327ed)",
    transition: "background 0.4",
  },
  logo: {
    height: "3.5rem",
  },
  logoContainer: {
    paddingRight: 0,
  },
  specialText: {
    color: theme.palette.common.blue,
    fontWeight: 800,
  },
  tabContainer: {
    marginRight: "7rem",
  },
  loginButton: {
    ...theme.typography.roundedButton,
    height: "2.5rem",
    width: "6rem",
    fontSize: "1.15rem",
  },
  avatar: { color: "white", width: 45, height: 45 },
  accountAvatar: {
    height: 45,
    width: 45,
    background: theme.palette.secondary.main,
    color: "white",
    "&:hover": {
      background: theme.palette.secondary.light,
    },
  },
  toolbar: {
    width: "100vw",
    minHeight: "4rem",
  },
  sideNavbar: {
    background: theme.palette.common.grey,
  },
  menuIconContainer: {
    height: "3rem",
    "&:hover": {
      background: "transparent",
    },
  },
  exitIconContainer: {
    marginLeft: "1rem",
    background: theme.palette.type == "dark" ? "#1e272e" : "#4381ff",
    "&:hover": {
      background: darken(
        theme.palette.type == "dark" ? "#1e272e" : "#4381ff",
        0.2
      ),
    },
  },
  menuIcon: {
    height: "2.5rem",
    width: "2.5rem",
    color: theme.palette.common.icon,
  },
  menuListContainer: {
    width: 270,
  },
  listItemText: {
    opacity: 0.7,
    color: "white",
    fontSize: "1.35rem",
    "&:hover": {
      opacity: 1,
    },
  },
  tabIcon: {
    color: "white",
    marginRight: "-0.5rem",
    marginLeft: "1rem",
  },
  welcomeMessage: {
    color: "white",
    marginRight: "0.8rem",
  },
  appBarShift: {
    marginLeft: 240,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  gridContainer: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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

function WorkspaceBar({
  history,
  user,
  accessToken,
  login,
  logout,
  switchTheme,
  handleDrawerToggle,
  open,
}) {
  // styling utilities
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery("(max-width:600px)");
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const matchesDark = theme.palette.type === "dark";

  // define states
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLoginDialog, setOpenLoginDiaog] = useState(false);

  // json array of objects used for mapping
  const accountMenus = [
    {
      icon: (
        <AccountBoxOutlinedIcon
          style={{ fontSize: "1.5rem", color: matchesDark ? "white" : "black" }}
        />
      ),
      label: "My Profile",
      color: matchesDark ? "white" : "black",
      backgroundColor: matchesDark ? theme.palette.primary.main : "white",
      onClick: () => history.push("/profile"),
    },
    {
      icon: (
        <HomeOutlinedIcon
          style={{ fontSize: "1.5rem", color: matchesDark ? "white" : "black" }}
        />
      ),
      label: "Home",
      color: matchesDark ? "white" : "black",
      backgroundColor: matchesDark ? theme.palette.primary.main : "white",
      onClick: () => history.push("/"),
    },
    {
      icon: (
        <ExitToAppOutlinedIcon
          style={{
            fontSize: "1.5rem",
            color: "white",
          }}
        />
      ),
      label: "Logout",
      color: "white",
      backgroundColor: theme.palette.common.blue,
      onClick: () => console.log("logout"),
    },
  ];

  useEffect(() => {
    if (!user && accessToken) {
      handleSocialLogin({ accessToken });
    }
  }, [user]);

  // functions
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(true);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const handleLoginDialogClose = () => {
    setOpenMenu(false);
    setOpenLoginDiaog(false);
  };

  const handleSocialLogin = (response) => {
    login(response, handleLoginDialogClose);
  };

  const handleSocialLoginFailure = (err) => {
    console.log(err);
  };

  const initial = (user) => {
    if (!user) return;
    return (
      user.firstname.slice(0, 1).toUpperCase() +
      user.lastname.slice(0, 1).toUpperCase()
    );
  };

  const parsePath = (str) => {
    let idx = str.length - 2;
    while (str[idx] !== "/") idx--;
    return str.slice(0, idx + 1);
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
            {user ? `${user.firstname} ${user.lastname}` : "Anonymous"}
          </Typography>
        </Grid>
      </Grid>
      {accountMenus.map((menu, i) => (
        <React.Fragment>
          {menu.label === "Logout" ? (
            <div key={`space-${i}`} style={{ marginTop: "1.25rem" }} />
          ) : undefined}
          {menu.label === "Logout" ? (
            <GoogleLogout
              key={`account-logout-${i}`}
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
              key={`account-button-${i}`}
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
        <Avatar className={classes.accountAvatar}>{initial(user)}</Avatar>
      </IconButton>
      <MenuPopper
        onClose={handleClose}
        open={openMenu}
        anchorEl={anchorEl}
        component={accountDetails}
        placement="bottom-start"
      />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar className={classes.appbar}>
          <Toolbar disableGutters className={classes.toolbar}>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={clsx(classes.gridContainer, {
                [classes.appBarShift]: open && !matchesXS,
              })}
            >
              <Grid
                item
                style={{
                  marginLeft: "1rem",
                }}
              >
                <IconButton
                  className={classes.menuIconContainer}
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon className={classes.menuIcon} />
                </IconButton>
                <Hidden smDown>
                  <Button
                    className={classes.logoContainer}
                    component={Link}
                    to="/"
                  >
                    <img
                      src={matchesDark ? logo : blackLogo}
                      alt="briefly logo"
                      className={classes.logo}
                    />
                  </Button>
                </Hidden>
                <Button
                  variant="contained"
                  className={classes.exitIconContainer}
                  onClick={() =>
                    history.push(parsePath(history.location.pathname))
                  }
                >
                  <ExitToAppIcon className={classes.menuIcon} />
                </Button>
              </Grid>
              <Grid
                item
                container
                justify="flex-end"
                alignItems="center"
                style={{ marginRight: "1rem", width: "auto" }}
              >
                <Grid item style={{ marginRight: "1rem" }}>
                  {matchesDark ? (
                    <IconButton onClick={switchTheme}>
                      <DarkModeIcon
                        style={{
                          fontSize: "1.5rem",
                          color: "white",
                        }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton onClick={switchTheme}>
                      <LightModeIcon
                        style={{
                          fontSize: "1.5rem",
                          color: "white",
                        }}
                      />
                    </IconButton>
                  )}
                </Grid>
                <Grid item>{user ? profileMenu : loginButton}</Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <LoginDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDiaog(false)}
        onSuccess={handleSocialLogin}
        onFailure={handleSocialLoginFailure}
      />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authReducer.user,
    accessToken: state.authReducer.accessToken,
  };
}

const mapDispatchToProps = {
  login,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceBar);
