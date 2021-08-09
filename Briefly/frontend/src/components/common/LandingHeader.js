import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Dialog,
  DialogTitle,
  Divider,
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
  ListItemIcon,
  ListItemText,
  Typography,
  Grid,
  Hidden,
  ListItemIcon,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import IntroIcon from "@material-ui/icons/ImportContactsOutlined";
import DemoIcon from "@material-ui/icons/MovieOutlined";
import TeamIcon from "@material-ui/icons/GroupOutlined";
import AboutIcon from "@material-ui/icons/BusinessOutlined";
import MoreIcon from "@material-ui/icons/MoreHorizOutlined";
import SchoolRoundedIcon from "@material-ui/icons/SchoolRounded";
import MenuBookRoundedIcon from "@material-ui/icons/MenuBookRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";

import logo from "../../assets/logo/png/colorLogo.png";
import MenuPopper from "./MenuPopper";
import IconTextButton from "./IconTextButton";

import { GoogleLogin, GoogleLogout } from "react-google-login";
import LoginDialog from "../social_login/LoginDialog";

import { connect } from "react-redux";
import { login, logout } from "../../redux/actions/auth_actions";

const data = {
  username: "Shawn",
  email: "ypx5110@psu.edu",
  school: "Penn State",
  major: "Computer Science"
};

const useStyles = makeStyles((theme) => ({
  appbar: {
    background: theme.palette.common.grey,
  },
  logo: {
    height: "5rem",
  },
  logoContainer: {
    paddingRight: 0,
  },
  tab: {
    ...theme.typography.tab,
    padding: 0,
    minWidth: 10,
    marginLeft: 60,
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
    marginTop: 3, // visually align tabs and button vertically
  },
  avatar: { color: "white", width: 50, height: 50, marginTop: 5 },
  accountAvatar: {
    height: 50,
    width: 50,
    color: "white",
    background: theme.palette.secondary.main,
    "&:hover": {
      background: theme.palette.secondary.light,
    },
  },
  toolbar: {
    width: 1600,
    [theme.breakpoints.down("md")]: {
      width: 1000,
    },
    [theme.breakpoints.down("sm")]: {
      width: 1000,
    },
    [theme.breakpoints.down("xs")]: {
      width: "inherit",
    },
  },
  sideNavbar: {
    background: theme.palette.common.grey,
  },
  menuIconContainer: {
    "&:hover": {
      background: "transparent",
    },
  },
  menuIcon: {
    height: "3.5rem",
    width: "3.5rem",
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.secondary.light,
    },
  },
  menuListContainer: {
    minWidth: 300,
  },
  listItemText: {
    opacity: 0.7,
    color: "white",
    fontFamily: "Odibee Sans",
    fontSize: "1.35rem",
    "&:hover": {
      opacity: 1,
    },
  },
  tabIcon: {
    color: "white",
    marginRight: "-0.5rem",
    marginLeft: "3rem",
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

function LandingHeader({
  history,
  user,
  accessToken,
  login,
  logout,
  scrollIntoView,
}) {
  // styling utilities
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesDark = theme.palette.type === "dark";

  // define states
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLoginDialog, setOpenLoginDiaog] = useState(false);
  const [openSideNavbar, setOpenSideNavbar] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  // json array of objects used for mapping
  const tabs = [
    { name: "Introduction", link: "/", icon: <IntroIcon /> },
    { name: "Demo", link: "/", icon: <DemoIcon /> },
    { name: "Team", link: "/", icon: <TeamIcon /> },
    { name: "About Us", link: "/", icon: <AboutIcon /> },
    { name: "Contact Us", link: "/", icon: <MoreIcon /> },
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
      onClick: () => openProfile(),
    },
    {
      icon: (
        <DashboardOutlinedIcon
          style={{ fontSize: "1.5rem", color: matchesDark ? "white" : "black" }}
        />
      ),
      label: "Dashboard",
      color: matchesDark ? "white" : "black",
      backgroundColor: matchesDark ? theme.palette.primary.main : "white",
      onClick: () => history.push("/dashboard"),
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

  const handleClose = () => {
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

  const openProfile = () => {
    setOpenProfileDialog(true);
  };

  const closeProfile = () => {
    setOpenProfileDialog(false);
  };

  const initial = (user) => {
    if (!user) return;
    return (
      user.firstname.slice(0, 1).toUpperCase() +
      user.lastname.slice(0, 1).toUpperCase()
    );
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
        background: theme.palette.common.cloud,
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
        <React.Fragment key={`accountMenus-landing-${i}`}>
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
        <Avatar className={classes.accountAvatar}>{initial(user)}</Avatar>
      </IconButton>
      <MenuPopper
        onClose={handleClose}
        open={openMenu}
        anchorEl={anchorEl}
        component={accountDetails}
        placement="bottom"
      />
    </React.Fragment>
  );

  const sideNavbar = (
    <React.Fragment>
      <IconButton
        className={classes.menuIconContainer}
        onClick={() => setOpenSideNavbar(!openSideNavbar)}
        disableRipple
      >
        <MenuIcon className={classes.menuIcon} />
      </IconButton>
      <SwipeableDrawer
        open={openSideNavbar}
        onClose={() => setOpenSideNavbar(false)}
        onOpen={() => setOpenSideNavbar(true)}
        classes={{ paper: classes.sideNavbar }}
      >
        <List className={classes.menuListContainer}>
          {tabs.map((tab, i) => (
            <ListItem
              key={`ListItem-${tab.name}${i}`}
              onClick={() => {
                scrollIntoView(i);
              }}
              divider
              button
              style={{ height: "5rem" }}
            >
              <ListItemIcon className={classes.tabIcon}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText disableTypography>
                <Typography variant="tab" className={classes.listItemText}>
                  {tab.name}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
    </React.Fragment>
  );

  const profileDialog = () => {
    <Dialog
      open={openProfileDialog}
      onClose={closeProfile}
      color="primary"
      PaperProps={{
        style: {
          backgroundColor: "#ecf0f1"
        }
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ backgroundColor: primaryColor }}
      >
        <Typography
          style={{ fontFamily: "Ubuntu", fontSize: "30px", color: "#ecf0f1" }}
        >
          Hello, {data.username}!
        </Typography>
      </DialogTitle>

      <ListItem button>
        <ListItemIcon>
          <SchoolRoundedIcon style={{ color: primaryColor }} />
        </ListItemIcon>
        <Typography style={{ fontFamily: "Ubuntu" }}>
          {data.school}
        </Typography>
      </ListItem>

      <Divider />

      <ListItem button>
        <ListItemIcon>
          <MenuBookRoundedIcon style={{ color: primaryColor }} />
        </ListItemIcon>
        <Typography style={{ fontFamily: "Ubuntu" }}>{data.major}</Typography>
      </ListItem>

      <Divider />

      <ListItem button>
        <ListItemIcon>
          <EmailRoundedIcon style={{ color: primaryColor }} />
        </ListItemIcon>
        <Typography style={{ fontFamily: "Ubuntu" }}>{data.email}</Typography>
      </ListItem>
    </Dialog>
  }

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar classes={{ root: classes.appbar }}>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <Toolbar disableGutters className={classes.toolbar}>
                <Grid
                  item
                  container
                  justify={matchesMD ? "space-evenly" : "center"}
                  alignItems="center"
                >
                  <Hidden lgUp>
                    <Grid item>{sideNavbar}</Grid>
                  </Hidden>
                  <Grid item>
                    <Button
                      className={classes.logoContainer}
                      component={Link}
                      to="/"
                      onClick={() => scrollIntoView(5)}
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
                            key={`Tab-${tab.name}-${i}`}
                            component={Link}
                            className={classes.tab}
                            onClick={() => scrollIntoView(i)}
                            to="/"
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

export default connect(mapStateToProps, mapDispatchToProps)(LandingHeader);
