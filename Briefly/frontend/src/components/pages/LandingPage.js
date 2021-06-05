import React, { useEffect } from "react";
import { Card, Grid, Typography, useMediaQuery } from "@material-ui/core";
import LandingHeader from "../common/LandingHeader";
import { makeStyles, useTheme } from "@material-ui/styles";
import heroIcon from "../../assets/hero/heroIcon.svg";

import ListRoundedIcon from "@material-ui/icons/ListRounded";
import OndemandVideoRoundedIcon from "@material-ui/icons/OndemandVideoRounded";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import AssessmentRoundedIcon from "@material-ui/icons/AssessmentRounded";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import CardMembershipRoundedIcon from "@material-ui/icons/CardMembershipRounded";
import ForumRoundedIcon from "@material-ui/icons/ForumRounded";

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
  }
}));

const border = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

const icons = [
  [
    <ListRoundedIcon style={{ fontSize: 100 }} />,
    <OndemandVideoRoundedIcon style={{ fontSize: 100 }} />,
    <TimelineRoundedIcon style={{ fontSize: 100 }} />
  ],
  [
    <CodeRoundedIcon style={{ fontSize: 100 }} />,
    <SettingsRoundedIcon style={{ fontSize: 100 }} />,
    <AssessmentRoundedIcon style={{ fontSize: 100 }} />
  ],
  [
    <HelpOutlineRoundedIcon style={{ fontSize: 100 }} />,
    <CardMembershipRoundedIcon style={{ fontSize: 100 }} />,
    <ForumRoundedIcon style={{ fontSize: 100 }} />
  ]
];

const captions = [
  [
    <h2>160 Hand-Picked Questions</h2>,
    <h2>100+ Hour Videos of Explanations</h2>,
    <h2>Data Structure Crash Course</h2>
  ],
  [
    <h2>Solution in 9 Languages</h2>,
    <h2>Code-Execution Environment</h2>,
    <h2>Space-Time Complexity Analysis</h2>
  ],
  [
    <h2>4 Curated Assessments</h2>,
    <h2>Certificate Of Completion</h2>,
    <h2>Mock Coding Interviews</h2>
  ]
];


const descriptions = [
  [
    <p>
      Coding interview prep is a numbers game that many candidates lose. We've
      hand-picked 160 of the best coding interview questions to truly prepare
      you. Learn more.
    </p>,
    <p>
      Algorithms are tough to learn on paper. Each and every one of our
      questions is accompanied by a two-part video explanation to maximize
      learning. That's over 100 hours of content, all at your fingertips. Learn
      more.
    </p>,
    <p>
      Data structures are the pillars of coding interviews. Our video series
      gives you the foundational knowledge you need to be well-versed in all of
      the popular data structures. Learn more.
    </p>
  ],
  [
    <p>
      Not everyone speaks the same programming language. We give you solutions
      to every single question in 9 different languages: JavaScript, TypeScript,
      Python, Swift, Kotlin, C++, Java, C#, and Go. Learn more.
    </p>,
    <p>
      Coding out solutions to algorithm problems is the best way to practice.
      Our code-execution environment lets you type out your answers and run them
      against our test cases right here on the website. Learn more.
    </p>,
    <p>
      Understanding how much memory an algorithm uses and how fast it runs is
      exceedingly important. All of our explanations include a rigorous
      space-time complexity analysis. Learn more.
    </p>
  ],
  [
    <p>
      Real coding interviews are timed and have multiple questions. We've
      carefully curated 4 assessments to reflect what a real day of coding
      interviews might look like, filled with variety and appropriate
      difficulty.
    </p>,
    <p>
      Completing 100 questions on AlgoExpert is no easy feat. It takes time and
      effort, and it demonstrates a keen understanding of data structures and
      algorithms. Completing 100 AlgoExpert questions earns you a certificate of
      your coding-interview preparedness.
    </p>,
    <p>
      There's no better way to practice than by going through an actual coding
      interview with a real human being. We let you pair up with other people
      and do mock coding interviews on a shared workspace, right here on
      AlgoExpert.
    </p>
  ]
];


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
      <div className={classes.root}>
        <Grid container spacing={3}>
          {props.frame.map((item, idx) => (
            <Grid container item spacing={3} key={idx} >
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
        container 
        className={classes.featureContainer}
        justify="center"
        direction="column"
        alignItems='center'
        spacing={6}
      >
        <Grid item xs={1}></Grid>

        <Grid item xs={10}>
          <Grid item style={{ height: 100}}></Grid>
          <Typography variant="h1" align='center'>What is Briefly?</Typography>
          <Grid item style={{ height: 100}}></Grid>
          <MatrixArea frame={border}/>
        </Grid>

        <Grid item xs={1}></Grid>

      </Grid>
      
    </React.Fragment>
  );
}
