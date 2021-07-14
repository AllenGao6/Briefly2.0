import React, { useEffect, useState, useRef } from "react";

import { WelcomeSection } from "./landing_page_properties/LandingPageWelcome";
import { IntroSection } from "./landing_page_properties/LandingPageIntro";
import { MissionSection } from "./landing_page_properties/LandingPageMission";
import { TeamSection } from "./landing_page_properties/LandingPageTeam"
import { AboutSection } from "./landing_page_properties/LandingPageAbout"
import { ContactSection } from "./landing_page_properties/LandingPageContact"
import { PageFooter } from "./landing_page_properties/LandingPageFooter";
import { MemberSection } from "./landing_page_properties/LandingPageMembers";
import { MemberCard } from "./landing_page_properties/MemberCard";


import { Grid,} from "@material-ui/core";
import LandingHeader from "../common/LandingHeader";
import {
  makeStyles,
  useTheme,
} from "@material-ui/styles";


export const useStyles = makeStyles((theme) => ({
  backgroundContainer: {
    backgroundColor: "#ecf0f1",
  },
}));

export default function LandingPage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const pageReference = useRef([]);

  const scrollIntoView = (id) => {
    pageReference.current[id].scrollIntoView({behavior: 'smooth'});
  }
  const components = [<IntroSection />, <MissionSection/>, <MemberSection />, <AboutSection />, <PageFooter />]
  useEffect(() => {
    if (theme.palette.type === "dark") {
      props.switchTheme();
    }
  }, [theme]);

  return (
    <React.Fragment>

      <LandingHeader {...props} scrollIntoView={scrollIntoView}/>
      <div key={5} ref={(element) => {pageReference.current[5] = element;}}>
        <WelcomeSection />
      </div>

      <Grid className={classes.backgroundContainer}>

        {components.map((component, value) =>(
          <div key={value} ref={(element) => {pageReference.current[value] = element;}}>
            {component}
          </div>
          
        ))}

      </Grid>

    </React.Fragment>
  );
}
