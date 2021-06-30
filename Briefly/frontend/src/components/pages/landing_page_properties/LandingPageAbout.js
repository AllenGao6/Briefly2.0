import {makeStyles} from "@material-ui/styles";
import React from "react";
import {Grid, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    captionMargins: {
        marginTop: "100px",
        marginBottom: "50px",
        fontSize: "60px",
        color: "#2980b9",
    },
}))

export const AboutSection = () => {
    const classes = useStyles()
    return(
        <Grid
          justify="center"
          alignItems="center"
          container
          direction="column"
          id="about-us"
        >
          <Typography
            className={classes.captionMargins}
            variant="h2"
            align="center"
          >
            About Us
          </Typography>
        </Grid>
    )
}
