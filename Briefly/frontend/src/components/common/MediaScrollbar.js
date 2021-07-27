import React from "react";
import { useTheme, useMediaQuery, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { darken, lighten } from "@material-ui/core/styles";
import SidebarBackground from "../../assets/background/sidebar.jpg";
import dashboardBackground_dark from "../../assets/background/dashboard2.jpg";
import dashboardBackground_light from "../../assets/background/dashboard.jpg";

import clsx from "clsx";
import {
  Typography,
  Grid,
  Icon,
  Paper,
  Button,
  InputAdornment,
  InputBase,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import Avatar from "@material-ui/core/Avatar";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import DescriptionIcon from "@material-ui/icons/Description";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 256,
    flexShrink: 0,
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
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    background: "black",
  },
  search: {
    width: 250,
    // background:
    //   theme.palette.type === "dark"
    //     ? theme.palette.primary.main
    //     : lighten("#2481F4", 0.2),
    height: "2.8rem",
    padding: "1rem",
    color: theme.palette.type === "dark"
    ? theme.palette.common.white
    : theme.palette.common.blue,
  },
  video: {
    color: "black",
    fontSize: "1.2rem",
  },
}));

export default function MediaScrollbar(props) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const { ...other } = props; // important, don't delete!
  const { media, media_type } = props;

  // console.log(props.media);

  return (
    <Drawer
      variant={matchesXS ? "temporary" : "persistent"}
      anchor="left"
      {...other}
      classes={{ paper: classes.drawerPaper }}
    >
      <List
        disablePadding
        style={{
          backgroundImage: `url(${
            theme.palette.type === "dark"
              ? dashboardBackground_dark
              : dashboardBackground_light
          })`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100%",
        }}
      >
        <React.Fragment>
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
          <ListItem
            className={clsx(classes.item, classes.itemCategory)}
            onClick={() => {
              props.history.push(`/dashboard`);
            }}
            button
          >
            <ListItemIcon className={classes.itemIcon}>
              <HomeIcon style={{ color: "white" }} />
            </ListItemIcon>
            <Typography variant="h5" style={{ color: "white" }}>
              Home
            </Typography>
          </ListItem>
          <ListItem style={{ paddingBottom: 0, paddingLeft: 0 }}>
            <InputBase
              style={{
                marginLeft: "1rem",
                verticalAlign: "center",
                paddingLeft: 0,
                fontSize: "1rem",
              }}
              placeholder="Search..."
              id="search1"
              variant="outlined"
              value={props.search}
              fullWidth
              size="small"
              classes={{ root: classes.search }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlinedIcon style={{ fontSize: "1.2rem" }} />
                </InputAdornment>
              }
              onChange={(event) => props.setSearch(event.target.value)}
            ></InputBase>
          </ListItem>
          <Divider variant="middle" className={classes.divider} />
        </React.Fragment>

        <React.Fragment>
          {media.map((item, index) => (
            <ListItem
              key={index}
              onClick={() =>
                props.history.push(
                  `/dashboard/${item.collection}/${media_type}/${item.id}`
                )
              }
              button
            >
              <ListItemAvatar>
                {media_type === "video" ? (
                  <VideoLibraryIcon />
                ) : media_type === "audio" ? (
                  <AudiotrackIcon />
                ) : (
                  <DescriptionIcon />
                )}
              </ListItemAvatar>
              <ListItemText primary={item.title} secondary={item.created} />
            </ListItem>
          ))}
        </React.Fragment>
      </List>
    </Drawer>
  );
}
