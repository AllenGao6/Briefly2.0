import React from "react";
import {
  Paper,
  Grid,
  useMediaQuery,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import CollectionCard from "./CollectionCard";
import AddCollectionCard from "./AddCollectionCard";
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
    overflow: "hidden",
  },
}));

function CollectionGrid({ open, collections, collectionDialog }) {
  const classes = useStyles();
  const theme = useTheme();
  const twoPerRow = useMediaQuery("(max-width:1155px)");
  const threePerRow = useMediaQuery("(max-width:1550px)");
  const fourPerRow = useMediaQuery(theme.breakpoints.down("lg"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const twoPerRowOpened = useMediaQuery("(max-width:1450px)");
  const threePerRowOpened = useMediaQuery("(max-width:1800px)");
  const fourPerRowOpened = useMediaQuery("(max-width:2190px)");

  const collectionIterator = () => {
    // This boolean is carefully designed, do not modify it unless been notified!
    const numItemsPerRow = open
      ? twoPerRowOpened
        ? 2
        : threePerRowOpened
        ? 3
        : fourPerRowOpened
        ? 4
        : 5
      : twoPerRow
      ? 2
      : threePerRow
      ? 3
      : fourPerRow
      ? 4
      : 5;
    const numRows = Math.ceil((collections.length + 1) / numItemsPerRow);
    const iterator = new Array(numRows)
      .fill(null)
      .map(() => new Array(numItemsPerRow).fill(null));

    let idx = 0;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numItemsPerRow; j++) {
        if (idx === collections.length) {
          iterator[i][j] = "Add More";
          idx++;
          break;
        }
        iterator[i][j] = collections[idx];
        idx++;
      }
      if (idx === collections.length + 1) break;
    }
    return iterator;
  };

  return (
    <Grid
      container
      className={classes.gridsContainer}
      justify="center"
      alignItems="center"
      direction="column"
      className={clsx(
        {
          [classes.contentShift]: open && !matchesXS,
        },
        classes.gridsContainer
      )}
    >
      {collectionIterator().map((row, i) => (
        <Grid
          key={`collection-grid-${i}`}
          container
          item
          spacing={3}
          justify="center"
          className={classes.rowContainer}
        >
          {row.map((collection, j) => (
            <Grid item key={`collection-card-${j}`}>
              {collection === "Add More" ? (
                <AddCollectionCard collectionDialog={collectionDialog} />
              ) : collection !== null ? (
                <CollectionCard
                  collection={collection}
                  collectionDialog={collectionDialog}
                />
              ) : (
                <div style={{ width: 360, height: 320 }}></div>
              )}
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    collections: state.collectionReducer.collections,
  };
}

export default connect(mapStateToProps, {})(CollectionGrid);
