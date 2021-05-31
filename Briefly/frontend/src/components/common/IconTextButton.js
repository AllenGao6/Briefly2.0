import React from "react";
import { Button, Paper, Typography, Grid } from "@material-ui/core";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: 5,
  },
}));

export default function IconTextButton({
  icon,
  label,
  color,
  backgroundColor,
  onClick,
}) {
  const classes = useStyles();

  return (
    <Paper
      elevation={2}
      component={Button}
      cl
      classes={{ root: classes.container }}
      onClick={onClick}
      style={{ background: backgroundColor }}
    >
      <Grid
        item
        container
        style={{
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 10,
          paddingRight: 10,
          borderRadius: 10,
          textTransform: "none",
          minWidth: 200,
        }}
        justify="center"
      >
        <Grid item style={{ marginRight: "1.25rem" }}>
          {icon}
        </Grid>
        <Grid item>
          <Typography variant="h5" style={{ color: color }}>
            {label}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
