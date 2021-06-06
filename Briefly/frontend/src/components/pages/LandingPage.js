import React, { useEffect } from "react";
import { Card, Grid, Typography, useMediaQuery } from "@material-ui/core";
import LandingHeader from "../common/LandingHeader";
import { makeStyles, useTheme } from "@material-ui/styles";
import heroIcon from "../../assets/hero/heroIcon.svg";
import ReactPlayer from "react-player";
import {icons, captions, descriptions, border} from "./data.js";



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
    marginTop: "-4rem",
    maxWidth: 700,
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
  featureContainer : {
    width : "100%"
  },
  captionMargins : {
    marginTop : "100px",
    marginBottom : "50px"
  }
}));




export default function LandingPage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (theme.palette.type === "dark") {
      props.switchTheme();
    }
  }, [theme]);

  const MyCard = ({ icon, caption, description }) => (
    <Card>
      <Grid container xs={12}>

        <Grid item xs={1}></Grid>

        <Grid 
          item 
          xs={10} 
          container 
          direction='column'>

          <Grid item>
            <Typography align='center'>{icon}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='h2' align="center">{caption}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2'>{description}</Typography>
          </Grid>

        </Grid>

        <Grid item xs={1}></Grid>
      </Grid>
    </Card>
  );
  
  const MatrixArea = (props) => {
  
    const FormRow = ({ frame, icon, caption, description }) => (
      <React.Fragment>
        {frame.map((item, idx) => (
          <Grid 
            item 
            xs={12}
            md={6}
            lg={4}
            key={idx} 
            container>

            <Grid item xs={1}></Grid>
            <Grid item>
              <MyCard
                icon={icon[idx]}
                caption={caption[idx]}
                description={description[idx]}
              />
            </Grid>

          </Grid>
        ))}
      </React.Fragment>
    );
  
    return (
      <div>
        <Grid container spacing={3}>
          {props.frame.map((item, idx) => (
            <Grid container item spacing={3} key={idx} align="center">
              <FormRow
                frame={item}
                icon={icons[idx]}
                caption={captions[idx]}
                description={descriptions[idx]}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  const PlayingVideo = () => (
      <ReactPlayer
        controls
        width="880px"
        height="495px"
        url={'https://www.youtube.com/watch?v=Mqps4anhz0Q&t=156s'}
      />
  )

  return (
    <React.Fragment>
      <LandingHeader {...props} />
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
              <Typography variant="h1">Briefly</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" style={{ color: "white" }}>
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


      <Grid
        justify='center' 
        alignItems='center' 
        container 
        direction='column'
        id="introduction"
      >
        <Typography className={classes.captionMargins} variant="h1" align='center'>
          What is Briefly
        </Typography>

        <Grid 
          container 
          className={classes.featureContainer}
          alignItems='center'
          spacing={6}
        >
          <Grid item xs={1}></Grid>

          <Grid item xs={10}>
            <MatrixArea frame={border}/>
          </Grid>

          <Grid item xs={1}></Grid>

        </Grid>
      </Grid>

      <Grid 
        justify='center' 
        alignItems='center' 
        container 
        direction='column'
        id="demo"
      >
        <Typography className={classes.captionMargins} variant="h1" align='center'>
          Briefly's Mission
        </Typography>
        <Grid justify='center'>
          <Card>
            <PlayingVideo />
          </Card>
        </Grid>
      </Grid>


      <Grid
        justify='center' 
        alignItems='center' 
        container 
        direction='column'
        id="team"
      >
        <Typography className={classes.captionMargins} variant="h1" align='center'>
          Team
        </Typography>
      </Grid>


      <Grid
        justify='center' 
        alignItems='center' 
        container 
        direction='column'
        id="about-us"
      >
        <Typography className={classes.captionMargins} variant="h1" align='center'>
          About Us
        </Typography>
      </Grid>
      
    </React.Fragment>
  );
}
