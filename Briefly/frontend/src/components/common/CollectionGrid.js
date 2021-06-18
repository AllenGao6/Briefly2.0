import React from "react";
import {
  Paper,
  Grid,
  useMediaQuery,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import CollectionCard from "./CollectionCard";
import clsx from "clsx";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  gridsContainer: {
    width: "100%",
    paddingTop: 100,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "inherit",
  },
  contentShift: {
    marginLeft: 256,
    width: `calc(100% - ${256}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  rowContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 20,
    width: "100%",
  },
}));

function CollectionGrid({ open, collections }) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const collectionIterator = () => {
    const numItemsPerRow = matchesSM ? 1 : matchesMD ? 2 : matchesLG ? 3 : 4;
    const numRows = Math.ceil(collections.length / numItemsPerRow);
    const iterator = new Array(numRows)
      .fill(null)
      .map(() => new Array(numItemsPerRow).fill(0));

    console.log(iterator, numItemsPerRow, numRows);
  };

  const FormRow = () => {
    return (
      <React.Fragment>
        <Grid item>
          <CollectionCard />
        </Grid>
        <Grid item>
          <CollectionCard />
        </Grid>
        <Grid item>
          <CollectionCard />
        </Grid>
      </React.Fragment>
    );
  };

  const createCollectionGrid = () => {};

  return (
    <Grid
      container
      className={classes.gridsContainer}
      justify="center"
      alignItems="center"
      direction="column"
      className={clsx(
        {
          [classes.contentShift]: open,
        },
        classes.gridsContainer
      )}
    >
      {collectionIterator()}
      <Grid
        container
        item
        spacing={3}
        justify="center"
        className={classes.rowContainer}
      >
        <FormRow />
      </Grid>
      <Grid
        container
        item
        spacing={3}
        justify="center"
        className={classes.rowContainer}
      >
        <FormRow />
      </Grid>
      <Grid
        container
        item
        spacing={3}
        justify="center"
        className={classes.rowContainer}
      >
        <FormRow />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    collections: state.collectionReducer.collections,
  };
}

export default connect(mapStateToProps, {})(CollectionGrid);
