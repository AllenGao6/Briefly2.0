import { Grid, Typography } from "@material-ui/core";
import React from 'react';

export default function NotFound() {
  const width = window.screen.width;
  return (
    <Grid
      style={{ height: "100vh", width: "100%", backgroundColor: "#81ecec" }}
    >
      <Grid style={{ height: "10px" }}></Grid>
      <Typography
        style={{
          fontSize: "40px",
          fontFamily: "Ununtu"
        }}
        align="center"
      >
        The page is missing...
      </Typography>
      <Typography align="center">-Error Code: 404-</Typography>
    </Grid>
  );
}

