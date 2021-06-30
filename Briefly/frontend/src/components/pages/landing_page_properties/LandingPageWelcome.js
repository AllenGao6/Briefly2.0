import {makeStyles, useTheme} from "@material-ui/styles";
import React from "react";
import {Grid, Typography, useMediaQuery,} from "@material-ui/core";
import heroIcon from "../../../assets/hero/heroIcon.svg";

const useStyles = makeStyles((theme) => ({
    heroContainer: {
      marginTop: 92,
      minHeight: "40rem",
      background: theme.palette.common.grey,
    },
    heroIcon: {
      height: 500,
      width: 500,
      [theme.breakpoints.down("sm")]: {
        height: 250,
        width: 250,
      },
    },
    sloganContainer: {
      paddingLeft: "50px",
      maxWidth: 800,
      [theme.breakpoints.down("md")]: {
        marginTop: "3rem",
        textAlign: "center",
      },
      [theme.breakpoints.down("sm")]: {
        marginTop: "5rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      },
    },
    heroIconContaienr: {
      [theme.breakpoints.down("md")]: {
        marginTop: "4rem",
        marginBottom: "4rem",
      },
    },
    grandCaption: {
        ...theme.typography.grandCaption,
        padding: 0,
        minWidth: 0,
        marginLeft: 0,
        },
    grandIntro: {
        ...theme.typography.grandIntro,
    }
}))

export const WelcomeSection = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
    return(
        <Grid
            container
            className={classes.heroContainer}
            justify="center"
            alignItems="center"
            direction={matchesMD ? "column" : "row"}
        >
            <Grid item container justify="center" md={7}>
            <Grid
                item
                container
                direction="column"
                justify="center"
                className={classes.sloganContainer}
            >
                <Grid item>
                <Typography className={classes.grandCaption}>Briefly</Typography>
                </Grid>
                <Grid item>
                <Typography className={classes.grandIntro}>
                    The ultimate AI-powered platform to review course material.
                    Everything you need, in one streamlined platform.
                </Typography>
                </Grid>
            </Grid>
            </Grid>
            <Grid
            item
            container
            justify="center"
            md={5}
            className={classes.heroIconContaienr}
            >
            <Grid item>
                <img
                src={heroIcon}
                alt="summary icon"
                className={classes.heroIcon}
                />
            </Grid>
            </Grid>
        </Grid>
    )
}
