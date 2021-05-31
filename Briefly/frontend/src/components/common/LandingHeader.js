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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import logo from "../../assets/logo/png/colorLogo.png";

import MenuPopper from "./MenuPopper";
import IconTextButton from "./IconTextButton";

const useStyles = makeStyles((theme) => ({
  logo: {
    height: "6rem",
  },
  logoContainer: {},
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
    marginTop: 7, // visually align tabs and button vertically
  },
  avatar: { color: "white", width: 50, height: 50, marginTop: 5 },
  specialText: {
    color: theme.palette.common.blue,
    fontWeight: 800,
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

  // define states
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState(null);

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
      icon: <AccountBoxOutlinedIcon style={{ fontSize: "2rem" }} />,
      label: "My Profile",
      color: "black",
      backgroundColor: "white",
      onClick: () => console.log("profile"),
    },
    {
      icon: <DashboardOutlinedIcon style={{ fontSize: "2rem" }} />,
      label: "Dashboard",
      color: "black",
      backgroundColor: "white",
      onClick: () => console.log("dashboard"),
    },
    {
      icon: (
        <ExitToAppOutlinedIcon style={{ fontSize: "2rem", color: "white" }} />
      ),
      label: "Logout",
      color: "white",
      backgroundColor: theme.palette.common.blue,
      onClick: () => console.log("logout"),
    },
  ];

  // functions
  const handleSocialLogin = () => {
    console.log("Processing Login");
    setUser({ name: "Toubat" });
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(true);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  // jsx components
  const loginButton = (
    <Button
      variant="outlined"
      className={classes.loginButton}
      onClick={handleSocialLogin}
    >
      Login
    </Button>
  );

  const accountDetails = (
    <Grid
      container
      direction="column"
      style={{ padding: "1rem", background: theme.palette.common.darkWhite }}
    >
      <Grid
        item
        container
        style={{ marginBottom: "1.5rem" }}
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
            <div style={{ marginTop: "2rem" }} />
          ) : undefined}
          <IconTextButton
            icon={menu.icon}
            label={menu.label}
            color={menu.color}
            backgroundColor={menu.backgroundColor}
            onClick={menu.onClick}
          />
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
      <AppBar>
        <Toolbar disableGutters>
          <Button className={classes.logoContainer} component={Link} to="/">
            <img src={logo} alt="briefly logo" className={classes.logo} />
          </Button>
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
          {user ? profileMenu : loginButton}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
