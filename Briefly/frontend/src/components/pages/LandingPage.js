import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardMedia,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import LandingHeader from "../common/LandingHeader";
import {
  makeStyles,
  useTheme,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/styles";
import heroIcon from "../../assets/hero/heroIcon.svg";

import ReactPlayer from "react-player";
import {
  icons,
  captions,
  descriptions,
  border,
  teamInfo,
  ratingComment,
  contactInfo,
  icons2,
  captions2,
  descriptions2
} from "./data.js";
import GradeRoundedIcon from "@material-ui/icons/GradeRounded";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";

const border2 = [0,1,2,3,4,5,6,7,8]

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
    ...theme.typography.grandIntro
  },
  secondaryCaption: {
    ...theme.typography.secondaryCaption

  },
  emphasizedBody1: {
    ...theme.typography.emphasizedBody1,
    fontFamily: "Ubuntu",
    fontWeight: 400,
    fontSize: "1.1rem",
    color:"#2c3e50"
  },
  body1: {
    ...theme.typography.body1,
    fontFamily: "Ubuntu",
    fontWeight: 400,
    fontSize: "1.1rem",
    color:"#7f8c8d"
  },

  backgroundContainer:{
    backgroundColor:"#ecf0f1"
  },
  featureContainer: {
    width: "100%",
  },
  introCardItem : {
    maxWidth : "380px",
    maxHeight : "350px",
    margin : "10px",
    color: "#ecf0f1",
    backgroundColor : "#ecf0f1"
  },
  introContainer : {
    width: "100%"
  },
  introCardContentContainer : { 
    minHeight: 350, 
    paddingLeft: 10, 
    paddingRight: 10,
    color: '#ecf0f1'
  },
  introCardContent : {
    color: '#7f8c8d',
  },
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "60px",
    color:"#2980b9"
  },
  teamContainer: {
    width: "80%",
  },
  teamMemberStrip: {
    marginBottom: "50px",
    backgroundColor: theme.palette.common.silver,
  },
  teamMemberDescription: {
    backgroundColor: theme.palette.common.silver,
  },
  avatarAndName: {
    margin: "5px",
  },
  contactArea: {
    backgroundColor: theme.palette.common.cloud,
  },
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

  const MyCard = (props) => {
    const [hovering, setHovering] = useState(false)
    return(
    <Paper
      elevation={hovering ? 5 : 0}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={classes.introCardItem}
    >
      <Grid container>
        <Grid item xs={1}></Grid>

        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          className={classes.introCardContentContainer}
        >
          <Grid item>
            <Typography 
              align="center"
              style={{color:"#2c3e50", fontSize:70}}
            >
              {props.icon}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              className={classes.secondaryCaption}
              align="center"
            >
              {props.caption}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              className={hovering ? classes.emphasizedBody1 : classes.body1}
              align="space-evenly"
            >
                {props.description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )};

  const PlayingVideo = () => (
    <ReactPlayer
      controls
      width="880px"
      height="495px"
      url={"https://www.youtube.com/watch?v=Mqps4anhz0Q&t=156s"}
    />
  );

  const MemberInfoStrip = (props) => (
    <Grid
      justify="center"
      alignItems="flex-start"
      direction={props.reversed ? "row-reverse" : "row"}
      style={{ marginBottom: 50 }}
      container
    >
      <Grid item align-self="flex-start">
        <Paper>
          <CardMedia
            component="img"
            alt="profile image"
            image={props.memberInfo.headImage}
            title={props.memberInfo.name}
            height="auto"
            width="auto"
            style={{
              minHeight: "280px",
              minWidth: "280px",
              maxHeight: "280px",
              maxWidth: "280px",
            }}
          ></CardMedia>
        </Paper>
      </Grid>
      <Grid item style={{ width: 50 }}></Grid>
      <Grid
        item
        container
        direction="column"
        style={{ width: "60%", padding: 40, borderRadius: "20px" }}
        className={classes.teamMemberStrip}
      >
        <Typography variant="h3">{props.memberInfo.name}</Typography>
        <Typography variant="h4">{props.memberInfo.description}</Typography>
      </Grid>
    </Grid>
  );

  const createArray = (length) => [...Array(length)];

  const MyStar = ({ selected = false, onSelect = (f) => f }) => {
    {
      return selected ? (
        <StarRoundedIcon
          style={{ fontSize: "500%", color: "#f1c40f" }}
          onClick={onSelect}
        />
      ) : (
        <StarOutlineRoundedIcon
          style={{ fontSize: "500%" }}
          onClick={onSelect}
        />
      );
    }
  };

  const StarRating = ({ totalStars = 5 }) => {
    const [rating, setRating] = useState(0);
    const [clicked, setClicked] = useState(false);
    return (
      <>
        <Grid style={{ padding: 10 }}>
          {createArray(totalStars).map((star, idx) => (
            <MyStar
              key={`${star}-${idx}`}
              selected={rating > idx}
              onSelect={() => {
                setRating(idx + 1);
                setClicked(true);
              }}
            />
          ))}
        </Grid>
        <Typography>
          {clicked ? (
            <Typography variant="body1" style={{ color: "#c0392b" }}>
              {ratingComment[rating - 1]}
            </Typography>
          ) : (
            <Typography variant="body1" style={{ color: "#7f8c8d" }}>
              Click to rate the page.
            </Typography>
          )}
        </Typography>
      </>
    );
  };

  const RatingSection = (props) => {
    return {};
  };

  const InfoStrip = (props) => (
    <Grid container direction="column">
      <Grid
        container
        alignItems="baseline"
        style={{ backgroundColor: theme.palette.common.silver, maxWidth: 200 }}
      >
        <ArrowForwardIosRoundedIcon />
        <Typography variant="body2">{props.data.type}</Typography>
      </Grid>
      <Typography variant="body2" style={{ marginLeft: 40 }}>
        {props.data.info}
      </Typography>
    </Grid>
  );

  const InfoSection = (props) => (
    <Grid container>
      {props.data.map((item, idx) => (
        <InfoStrip key={`${item}-${idx}`} data={item} />
      ))}
    </Grid>
  );

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

      <Grid className={classes.backgroundContainer}>
        <Grid
          justify="center"
          alignItems="center"
          container
          direction="column"
          id="new-intro"
        >
          <Typography
            className={classes.captionMargins}
            variant="h2"
            align="center"
          >
            What is Briefly?
          </Typography>
          <Grid
            container
            justify="space-evenly"
            className={classes.introContainer}
          >
            {border2.map((item, idx) => 
              <MyCard 
                key={idx} 
                icon={icons2[idx]}
                caption={captions2[idx]}
                description={descriptions2[idx]}/>
            )}
          </Grid>
        </Grid>

        <Grid
          justify="center"
          alignItems="center"
          container
          direction="column"
          id="demo"
        >
          <Typography
            className={classes.captionMargins}
            variant="h2"
            align="center"
          >
            Briefly's Mission
          </Typography>
          <Grid container justify="center">
            <Card>
              <PlayingVideo />
            </Card>
          </Grid>
        </Grid>

        <Grid
          justify="center"
          alignItems="center"
          container
          direction="column"
          id="team"
        >
          <Grid className={classes.teamContainer}>
            <Typography
              className={classes.captionMargins}
              variant="h2"
              align="center"
            >
              Team
            </Typography>
            <Grid container justify="center" direction="column">
              {teamInfo.map((memberInfo, idx) => (
                <MemberInfoStrip
                  key={`${memberInfo}-${idx}`}
                  reversed={idx % 2 === 1}
                  memberInfo={memberInfo}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>

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

        <Grid
          justify="center"
          alignItems="center"
          container
          direction="column"
          id="about-us"
          style={{ marginBottom: 200 }}
        >
          <Typography
            className={classes.captionMargins}
            variant="h2"
            align="center"
          >
            Contact Us
          </Typography>
          <Grid container justify="center">
            <Grid item style={{ width: "40%" }}>
              <InfoSection data={contactInfo} />
            </Grid>
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              className={classes.contactArea}
              style={{ maxWidth: "50%" }}
            >
              <StarRating />
              <TextareaAutosize
                aria-label="minimum height"
                rowsMin={6}
                style={{ width: "80%" }}
                placeholder="Some Feedbacks ..."
                colsmin={50}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => alert("Thank you! Your feedback is valuable.")}
                style={{ margin: 20, textTransform: "none" }}
              >
                <Typography variant="body2">Submit</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
