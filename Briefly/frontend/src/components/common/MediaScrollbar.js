import React from "react";
import { useTheme, useMediaQuery, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { darken, lighten } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 256,
    flexShrink: 0,
  },
}));

export default function Navigator(props) {
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
      {"Happy Coding!"}
    </Drawer>
  );
}
