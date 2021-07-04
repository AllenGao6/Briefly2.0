import React from "react";
import CollectionGrid from "./CollectionGrid";
import CollectionTable from "./CollectionTable";
import {
  Grid,
  makeStyles,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  useScrollTrigger,
} from "@material-ui/core";
import clsx from "clsx";
import App from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 69,
    background:
      theme.palette.type === "dark"
        ? theme.palette.primary.main
        : theme.palette.cloud,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
  contentShift: {
    marginLeft: 256,
    width: `calc(100% - ${256}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  tabs: {
    top: 69,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "white",
    zIndex: 1302,
  },
}));

export default function DashboardContent({
  open,
  collectionDialog,
  collectionDelete,
  history,
  isDashboard,
  mediaType,
  match,
}) {
  const descriptionHeight = 160;
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const trigger = useScrollTrigger({
    target: window ? window : undefined,
    disableHysteresis: true,
    threshold: descriptionHeight,
  });

  const matchesDark = theme.palette.type === "dark";
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  return (
    <Grid
      container
      className={clsx(classes.root, {
        [classes.contentShift]: open && !matchesXS,
      })}
      direction="column"
      justify="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid
        item
        container
        style={{ paddingBottom: "0.7rem" }}
        direction="column"
      >
        <Grid
          item
          style={{
            height: descriptionHeight,
            background: theme.palette.common.cloud,
          }}
        >
          {isDashboard ? "Dashboard" : "Collection"}
        </Grid>
        <Grid
          item
          container
          style={{ position: trigger ? "fixed" : "sticky" }}
          className={classes.tabs}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor={matchesDark ? "secondary" : "primary"}
            textColor={matchesDark ? "secondary" : "primary"}
            variant="fullWidth"
          >
            <Tab label="All Items" {...a11yProps(0)} />
            <Tab label="Archived" {...a11yProps(1)} />
          </Tabs>
        </Grid>
      </Grid>

      {/* <Divider variant="middle" classes={{ root: classes.divider }} /> */}
      <Grid item style={{ paddingTop: trigger ? "5rem" : "2rem" }}>
        {isDashboard ? (
          <CollectionGrid
            open={open}
            collectionDialog={collectionDialog}
            collectionDelete={collectionDelete}
            history={history}
          />
        ) : (
          <CollectionTable
            history={history}
            mediaType={mediaType}
            match={match}
          />
        )}
      </Grid>
    </Grid>
  );
}
