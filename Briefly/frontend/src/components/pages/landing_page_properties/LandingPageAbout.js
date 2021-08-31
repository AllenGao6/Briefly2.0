import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "60px",
  },
  emphasizedBody1: {
    ...theme.typography.emphasizedBody1,
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "1.2rem",
    color: "#2c3e50",
  },
}));

export const AboutSection = () => {
  const classes = useStyles();
  return (
    <Grid
      justify="center"
      alignItems="center"
      container
      direction="column"
      id="about-us"
      style={{ marginBottom: "3rem" }}
    >
      <Typography
        className={classes.captionMargins}
        variant="h2"
        align="center"
      >
        About Us
      </Typography>
      <Grid item style={{ width: "80%" }}>
        <Typography
          className={classes.emphasizedBody1}
          variant="h5"
          align="justify"
        >
          We are a group of dedicated college students who try to use AI technology to improve online learning effciency by building a powerful content management platform - Briefly. As online learning is gaining momentum globally due to the covid-19, students are experiencing dramatic changes in their learning environments and methods; many international students are not able to attend online live lectures due to time zone differences. Thus, finding new and useful methods for all remote learning students becomes unspeakably important. As Zoom is becoming the most popular online class platform, many students reported difficulties in following along with the online lecture contents, especially among international students or those with language barriers. As a study posted in the journal of Clinical and Diagnostic Research, almost 40% of students could not keep themselves up-to-date along with the teaching in flipped class sessions taken in online mode, and the study further shows that 40 minutes is an optimized zoom lecture duration for the best student feedback. Due to the nature of online lecturing form, class interaction, one of the most important class components, is usually missing; therefore, many students are having a hard time fully absorbing lecture contents. Also with the remote learning setting, professors may not be able to guarantee all students’ level of understanding during the lecture. Thus, it becomes students’ responsibility to rewatch lecture videos or to read the supported text to achieve academic advancement. However, it is usually difficult to comprehend all important messages given in long video, audio, or text sources without knowing what to look for. In fact, not only students find it difficult, but many businesses or people with hearing disorders also need an efficient method to collect important insights from video or text data. A solution is urgently needed to accommodate these problems.

        </Typography>
      </Grid>
    </Grid>
  );
};
