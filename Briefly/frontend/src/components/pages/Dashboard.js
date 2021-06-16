import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ListItemIcon,
  Avatar,
} from "@material-ui/core";
import DashboardBar from "../common/DashboardBar";
import NestedGrid from "../common/CollectionGrid";
import Navigator from "../common/Navigator";
import DashboardContent from "../common/DashboardContent";

import { connect } from "react-redux";
import { loadCollections } from "../../redux/actions/collection_actions";

// User View
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    ...theme.typography.roundedButton,
    background: theme.palette.secondary.main,
    width: "13rem",
    margin: "2rem",
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <React.Fragment>
      <Navigator open={mobileOpen} onClose={handleDrawerToggle} />
      <DashboardBar
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        {...props}
      />
      <DashboardContent open={mobileOpen} />
      <Button
        variant="contained"
        className={classes.button}
        onClick={props.loadCollections}
      >
        Load Collections
      </Button>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    collections: state.collectionReducer.collections,
  };
}

const mapDispatchToProps = {
  loadCollections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
