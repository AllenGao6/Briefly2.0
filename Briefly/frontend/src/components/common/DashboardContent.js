import React, { useEffect, useState } from "react";
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
  Hidden,
  useScrollTrigger,
} from "@material-ui/core";
import clsx from "clsx";
import { darken, lighten } from "@material-ui/core/styles";
import collectionImage from "../../assets/hero/statistics.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 69,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "white",
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
      theme.palette.type === "dark"
        ? darken(theme.palette.primary.main, 0.2)
        : theme.palette.common.cloud,
    zIndex: 1,
  },
  heroText: {
    color: "white",
  },
  heroIcon: {
    height: 250,
    width: 250,
  },
}));

export default function DashboardContent({
  open,
  collectionDialog,
  collectionDelete,
  collections,
  history,
  isDashboard,
  mediaType,
  match,
  search,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesDark = theme.palette.type === "dark";
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const collection = collections.filter(
    (collection) => collection.id == match.params.id
  )[0];

  const [value, setValue] = useState(0);
  const descriptionHeight = 350;
  const trigger = useScrollTrigger({
    target: window ? window : undefined,
    disableHysteresis: true,
    threshold: descriptionHeight,
  });

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const filterCollectionByArchive = () => {
    if (value === 1) return collections.filter((item) => item.is_archived);
    return collections;
  };

  const CollectionHero = () => (
    <Grid
      container
      alignItems="center"
      style={{
        background: darken(theme.palette.common.grey, 0.4),
        height: descriptionHeight,
      }}
    >
      <Grid
        item
        container
        direction="column"
        justify="center"
        alignItems={matchesXS ? "center" : "flex-start"}
        style={{
          paddingLeft: matchesSM ? "2rem" : "7rem",
          paddingRight: matchesSM ? "2rem" : undefined,
        }}
        xs
      >
        <Grid item style={{ paddingBottom: "0.5rem" }}>
          <Typography
            variant="h2"
            style={{
              fontFamily: "Roboto",
              fontWeight: 600,
              fontSize: "2.5rem",
            }}
            className={classes.heroText}
          >
            {collection && collection.name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="h5"
            className={classes.heroText}
            align={matchesXS ? "justify" : undefined}
          >
            {collection && collection.description}
          </Typography>
        </Grid>
      </Grid>
      <Hidden smDown>
        <Grid item container justify="center" alignItems="center" xs>
          <Grid item>
            <img src={collectionImage} className={classes.heroIcon} />
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );

  const DashboardHero = () => (
    <Grid
      container
      alignItems="center"
      style={{
        height: descriptionHeight,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        background: darken(theme.palette.common.grey, 0.4),
      }}
    >
      <Typography variant="h2" style={{ color: "white" }}>
        To be Implemented...
      </Typography>
    </Grid>
  );

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
        <Grid item>{isDashboard ? <DashboardHero /> : <CollectionHero />}</Grid>
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
            <Tab label="All Items" />
            <Tab label="Archived" />
          </Tabs>
        </Grid>
      </Grid>
      {/* <Divider variant="middle" classes={{ root: classes.divider }} /> */}
      <Grid
        item
        style={{
          paddingTop: trigger ? "5rem" : "2rem",
          zIndex: 0,
        }}
      >
        {isDashboard ? (
          <CollectionGrid
            open={open}
            collectionDialog={collectionDialog}
            collectionDelete={collectionDelete}
            history={history}
            collections={filterCollectionByArchive()}
          />
        ) : (
          <CollectionTable
            history={history}
            mediaType={mediaType}
            match={match}
            selectArchived={value === 1}
            search={search}
          />
        )}
      </Grid>
    </Grid>
  );
}
