import React from "react";
import { useTheme, useMediaQuery, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { darken, lighten } from "@material-ui/core/styles";
import SidebarBackground from "../../assets/background/sidebar.jpg";
import dashboardBackground from "../../assets/background/dashboard.jpg";
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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";



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
}));

export default function MediaScrollbar(props) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const { ...other } = props; // important, don't delete!

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
          backgroundImage: `url(${dashboardBackground})`,
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
        <ListItem className={clsx(classes.item, classes.itemCategory)} onClick={()=>{props.history.push(`/dashboard`)}} button>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon style={{ color: "white" }} />
          </ListItemIcon>
          <Typography variant="h5" style={{ color: "white" }} >
            Home
          </Typography>
        </ListItem>
        <ListItem>
          <InputBase
            style={{ marginLeft: "1rem", verticalAlign: "center" }}
            placeholder="Search..."
            id="search"
            variant="outlined"
            // value={search}
            fullWidth
            size="small"
            // classes={{ root: classes.search }}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlinedIcon
                  style={{ fontSize: "1.5rem" }}
                />
              </InputAdornment>
            }
            // onChange={(event) => setSearch(event.target.value)}
          >
      </InputBase>
        </ListItem>
      </List>
      
    </Drawer>
  );
}
