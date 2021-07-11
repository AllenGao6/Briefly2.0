import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  useTheme,
  useMediaQuery,
  Typography,
  Grid,
  Icon,
  Paper,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DnsRoundedIcon from "@material-ui/icons/DnsRounded";
import PermMediaOutlinedIcon from "@material-ui/icons/PhotoSizeSelectActual";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import SubjectIcon from "@material-ui/icons/Subject";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import NoteIcon from "@material-ui/icons/Note";
import PublicIcon from "@material-ui/icons/Public";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import TimerIcon from "@material-ui/icons/Timer";
import SettingsIcon from "@material-ui/icons/Settings";
import PhonelinkSetupIcon from "@material-ui/icons/PhonelinkSetup";
import { makeStyles } from "@material-ui/styles";
import IconTextButton from "./IconTextButton";
import AddCircleIcon from "@material-ui/icons/Add";
import SidebarBackground from "../../assets/background/sidebar.jpg";
import { darken, lighten } from "@material-ui/core/styles";

const categories = [
  {
    id: "Config",
    children: [
      { id: "video", icon: <VideoLibraryIcon />, active: true },
      { id: "audio", icon: <GraphicEqIcon />, active: false },
      { id: "text", icon: <SubjectIcon />, active: false },
      // { id: "Hosting", icon: <PublicIcon /> },
      // { id: "Functions", icon: <SettingsEthernetIcon /> },
      // { id: "ML Kit", icon: <SettingsInputComponentIcon /> },
    ],
  },
  {
    id: "tools",
    children: [
      { id: "Pop Quiz", icon: <QuestionAnswerIcon /> },
      { id: "My Flash Card", icon: <NoteIcon /> },
      { id: "My Mind Map", icon: <AccountTreeIcon /> },
    ],
  },
  {
    id: "settings",
    children: [{ id: "Setting", icon: <SettingsIcon /> }],
  },
];

const useStyles = makeStyles((theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.grey,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    "&:hover": {
      backgroundColor: "#404854",
    },
  },
  itemCategory: {
    backgroundColor: theme.palette.common.grey,
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemActiveItem: {
    color: "#4fc3f7",
  },
  itemPrimary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    background: "black",
  },
  drawerPaper: {
    width: 256,
    flexShrink: 0,
  },
  noBorder: {
    borderRight: `1px solid ${theme.palette.common.silver}`,
  },
  addCollection: {
    cursor: "pointer",
    borderRadius: 30,
    width: "10rem",
    paddingTop: "0.7rem",
    paddingBottom: "0.7rem",
    background:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
    transition: "all 0.3s",
    "&:hover": {
      background:
        theme.palette.type === "dark"
          ? darken(theme.palette.common.orange, 0.2)
          : darken(theme.palette.common.blue, 0.2),
    },
  },
  icon: {
    color: theme.palette.common.grey,
    fontSize: "3rem",
    minWidth: "auto",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  text: {
    color: theme.palette.common.grey,
    fontSize: "1.2rem",
  },
}));

export default function Navigator(props) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const { ...other } = props;

  const change_category = (type) => {
    var current_collection = window.location.pathname.split("/")[2];
    props.history.push(`/dashboard/${current_collection}/${type}`);
  };

  return (
    <Drawer
      variant={matchesXS ? "temporary" : "persistent"}
      anchor="left"
      {...other}
      classes={{
        paper: classes.drawerPaper,
        paperAnchorDockedLeft: classes.noBorder,
      }}
    >
      <List
        disablePadding
        style={{
          backgroundImage: `url(${SidebarBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100%",
        }}
      >
        <ListItem
          className={clsx(classes.item, classes.itemCategory)}
          style={{ textAlign: "center", height: 69 }}
        >
          <Typography
            variant="h4"
            style={{ color: theme.palette.secondary.main }}
          >
            Briefly
          </Typography>
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon style={{ color: "white" }} />
          </ListItemIcon>
          <Typography variant="h5" style={{ color: "white" }}>
            Home
          </Typography>
        </ListItem>
        <ListItem
          style={{
            marginBottom: "0.7rem",
            marginTop: "0.3rem",
            paddingLeft: "1.5rem",
            minWidth: "auto",
          }}
        >
          <Paper
            className={classes.addCollection}
            elevation={10}
            onClick={
              props.isDashboard
                ? () => props.collectionDialog(null)
                : () => {
                    alert(window.location.pathname);
                  }
            }
          >
            <Grid container alignItems="center" justify="center">
              <AddCircleIcon
                style={{
                  fontSize: "2rem",
                  marginRight: "0.3rem",
                  color: "white",
                }}
              />
              <Typography variant="h5" style={{ color: "white" }}>
                {props.isDashboard ? "Collection" : "Media"}
              </Typography>
            </Grid>
          </Paper>
        </ListItem>
        <Divider variant="middle" className={classes.divider} />
        {props.isDashboard
          ? null
          : categories.map(({ id, children }) => (
              <React.Fragment key={id}>
                {children.map(({ id: childId, icon, active }) => (
                  <ListItem
                    key={childId}
                    onClick={
                      id === "Config" ? () => change_category(childId) : null
                    }
                    button
                  >
                    <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                    <ListItemText disableTypography className={classes.text}>
                      {childId}
                    </ListItemText>
                  </ListItem>
                ))}

                <Divider variant="middle" className={classes.divider} />
              </React.Fragment>
            ))}
      </List>
    </Drawer>
  );
}
