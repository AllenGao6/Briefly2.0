import React, { useState } from "react";
import {
  makeStyles,
  Card,
  CardActionArea,
  Button,
  Typography,
  useTheme,
  Paper,
} from "@material-ui/core";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    height: 264,
    transition: "all 0.3s",
    opacity: 0.6,
    background: theme.palette.type === "dark" ? "silver" : "white",
    "&:hover": {
      opacity: 1,
      background:
        theme.palette.type === "dark"
          ? theme.palette.common.grey
          : theme.palette.common.cloud,
    },
  },
  addIcon: {
    fontSize: "12rem",

    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
  },
}));

export default function AddCollectionCard({ collectionDialog }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card
      className={classes.root}
      component={Button}
      elevation={6}
      onClick={() => collectionDialog(null)}
    >
      <PostAddOutlinedIcon className={classes.addIcon} />
    </Card>
  );
}
