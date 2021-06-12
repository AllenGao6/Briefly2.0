import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Tabs,
  Tab,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Hidden,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  ListItemIcon,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import IntroIcon from "@material-ui/icons/ImportContactsOutlined";
import DemoIcon from "@material-ui/icons/MovieOutlined";
import TeamIcon from "@material-ui/icons/GroupOutlined";
import AboutIcon from "@material-ui/icons/BusinessOutlined";
import MoreIcon from "@material-ui/icons/MoreHorizOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import DarkModeIcon from "@material-ui/icons/Brightness7";
import LightModeIcon from "@material-ui/icons/Brightness4";

import logo from "../../assets/logo/png/colorLogo.png";
import blackLogo from "../../assets/logo/png/blackLogo.png";
import MenuPopper from "./MenuPopper";
import IconTextButton from "./IconTextButton";

import { GoogleLogout } from "react-google-login";
import LoginDialog from "../social_login/LoginDialog";

import axios from 'axios';
const useStyles = makeStyles((theme) => ({
  appbar: {
    background: theme.palette.primary.main,
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
  search: {
    background: theme.palette.primary.light,
    borderRadius: 15,
    elevation: 2,
    transition: "all 0.3s",
    width: 250,
    "&:hover": {
      background: theme.palette.primary.dark,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      background: theme.palette.primary.dark,
      transition: "width 0.3s",
      borderRadius: 15,
      width: 300,
    },
  },
  searchInput: {
    color: "white",
    fontSize: "1.25rem",
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

export default function DashboardBar({
  history,
  user,
  setUser,
  switchTheme,
  handleDrawerToggle,
  marginLeft,
}) {
  // styling utilities
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const matchesDark = theme.palette.type === "dark";

  // define states
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLoginDialog, setOpenLoginDiaog] = useState(false);
  const [openSideNavbar, setOpenSideNavbar] = useState(false);
  const [search, setSearch] = useState("");

  // json array of objects used for mapping
  const tabs = [
    { name: "Introduction", link: "/", icon: <IntroIcon /> },
    { name: "Demo", link: "/", icon: <DemoIcon /> },
    { name: "Team", link: "/", icon: <TeamIcon /> },
    { name: "About Us", link: "/", icon: <AboutIcon /> },
    { name: "More ...", link: "/", icon: <MoreIcon /> },
  ];

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
    const login = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!user && accessToken) {
        await handleSocialLogin({accessToken});
        console.log("AAAAA");
      }
    }
    login();
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

  const handleSocialLogin = (response) => {
    const handleSocialLogin = (response) => {

      axios.get('auth/google-oauth2/')
        .then((result) => {
          localStorage.setItem("accessToken", response.accessToken);
          setUser({ name: result.data.firstname + " " + result.data.lastname });
          setOpenMenu(false);
          setOpenLoginDiaog(false);
        })
        .catch(function (error) {
          console.log("not logged in yet");
          return error.response.status;
      }).then((code =>{
        if (code === 405) {
          console.log("requesting");
          axios.post('auth/google-oauth2/', {
            access_token: response.accessToken,
          })
          .then(function (result) {
            localStorage.setItem("accessToken", response.accessToken);
            console.log(result.data.firstname + " " + result.data.lastname);
            setUser({ name: result.data.firstname + " " + result.data.lastname });
            setOpenMenu(false);
            setOpenLoginDiaog(false);
          }).catch(function (error) {
            console.log(error.response);
          });
        }
      }));
    };
  };

  const handleSocialLoginFailure = (err) => {
    console.log(err);
  };

  const initial = (user) => {
    if (!user) return;
    const [first, last] = user.name.split(" ");
    return first.slice(0, 1).toUpperCase() + last.slice(0, 1).toUpperCase();
  };

  const logout = () => {
    axios.get(`/logout/`)
      .then(res => {
        console.log(res.message);
        console.log("logged out");
        localStorage.removeItem("accessToken");
        setUser(null);
      })
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
      {/*<Grid item style={{ marginTop: "0.5rem" }}>
          <Typography variant="h4" className={classes.welcomeMessage}>
            Welcome, {user ? user.name : undefined}!
          </Typography>
        </Grid>*/}
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
              justify="space-around"
              alignItems="center"
              style={{ marginLeft: marginLeft }}
            >
              <Grid
                item
                container
                justify="flex-start"
                alignItems="center"
                style={{
                  marginLeft: "1rem",
                }}
                xs
              >
                <Grid item>
                  <IconButton
                    className={classes.menuIconContainer}
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon className={classes.menuIcon} />
                  </IconButton>
                </Grid>
                <Hidden smDown>
                  <Grid item>
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
                  </Grid>
                </Hidden>
                <Hidden xsDown>
                  {marginLeft === 0 ? (
                    <Grid item style={{ marginLeft: "1rem" }}>
                      <TextField
                        placeholder="Search..."
                        id="search"
                        variant="outlined"
                        value={search}
                        fullWidth
                        size="small"
                        classes={{ root: classes.search }}
                        InputProps={{
                          className: classes.searchInput,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchOutlinedIcon
                                style={{ fontSize: "1.5rem" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(event) => setSearch(event.target.value)}
                      ></TextField>
                    </Grid>
                  ) : (
                    <div></div>
                  )}
                </Hidden>
              </Grid>
              <Grid
                item
                container
                justify="flex-end"
                alignItems="center"
                xs
                style={{
                  marginRight: "1.5rem",
                  width: 100,
                  flexGrow:
                    marginLeft === 0
                      ? matchesXS
                        ? 1.2
                        : 0.55
                      : matchesXS
                      ? 1.2
                      : 1.2,
                }}
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
