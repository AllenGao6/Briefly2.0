import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  useTheme,
  useMediaQuery,
  Typography,
  Grid,
  Icon,
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
import DnsRoundedIcon from "@material-ui/icons/DnsRounded";
import PermMediaOutlinedIcon from "@material-ui/icons/PhotoSizeSelectActual";
import PublicIcon from "@material-ui/icons/Public";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import TimerIcon from "@material-ui/icons/Timer";
import SettingsIcon from "@material-ui/icons/Settings";
import PhonelinkSetupIcon from "@material-ui/icons/PhonelinkSetup";
import { makeStyles } from "@material-ui/styles";
import IconTextButton from "./IconTextButton";
import AddCircleIcon from "@material-ui/icons/AddCircleOutlineOutlined";

const categories = [
  {
    id: "Develop",
    children: [
      { id: "Authentication", icon: <PeopleIcon />, active: true },
      { id: "Database", icon: <DnsRoundedIcon /> },
      { id: "Storage", icon: <PermMediaOutlinedIcon /> },
      { id: "Hosting", icon: <PublicIcon /> },
      { id: "Functions", icon: <SettingsEthernetIcon /> },
      { id: "ML Kit", icon: <SettingsInputComponentIcon /> },
    ],
  },
  {
    id: "Quality",
    children: [
      { id: "Analytics", icon: <SettingsIcon /> },
      { id: "Performance", icon: <TimerIcon /> },
      { id: "Test Lab", icon: <PhonelinkSetupIcon /> },
    ],
  },
];

const useStyles = makeStyles((theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
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
    marginTop: theme.spacing(2),
  },
  drawerPaper: {
    width: 256,
    flexShrink: 0,
  },
  noBorder: {
    borderRight: `1px solid ${theme.palette.common.silver}`,
  },
  addCollection: {
    borderRadius: 50,
    textTransform: "none",
    width: "12rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    background:
      "linear-gradient(75deg, rgba(237,20,20,1) 0%, rgba(30,144,255,1) 92%)",
    transition: "all 0.3s",
    "&:hover": {
      opacity: 0.9,
    },
  },
}));

export default function Navigator(props) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const { ...other } = props;

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
      <List disablePadding>
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
        <ListItem>
          <Grid
            className={classes.addCollection}
            onClick={() => props.collectionDialog(null)}
            container
            alignItems="center"
            justify="center"
            spacing={4}
            component={Button}
          >
            <Grid item>
              <AddCircleIcon style={{ fontSize: "2rem", color: "white" }} />
            </Grid>
            <Grid item style={{ marginTop: 3, marginLeft: "1rem" }}>
              <Typography variant="h4" style={{ color: "white" }}>
                Create
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem
                key={childId}
                button
                className={clsx(classes.item, active && classes.itemActiveItem)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
