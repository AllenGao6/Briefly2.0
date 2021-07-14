import {makeStyles} from "@material-ui/styles";
import {Avatar, Card, Container, Grid, Typography} from "@material-ui/core";
import { teamInfo } from "./data";
import React from 'react';
import main from "../../../assets/heads/main.jpg";
import "./style.css";


const useStyles = makeStyles((theme) => ({
    secondaryCaption: {
        ...theme.typography.secondaryCaption,
    },
    emphasizedBody1: {
        ...theme.typography.emphasizedBody1,
        fontFamily: "Ubuntu",
        fontWeight: 400,
        fontSize: "1.0rem",
        color: "#2c3e50",
    },
    captionMargins: {
        marginTop: "100px",
        marginBottom: "50px",
        fontSize: "60px",
        color: "#2980b9",
    },
    teamContainer: {
        width: "87%",
    },
    teamMemberStrip: {
        marginBottom: "50px",
        backgroundColor: theme.palette.common.silver,
    }
}))

const radius = 40
const cardWidth = 340
const descriptionHeight = 160
const cardBorderRadius = 5
const cardBackgroundColor = "#ecf0f1"

const MemberInfoStrip = (props) => {
    return (
      <>
        <Grid
          justify="center"
          align-items="flex-start"
          direction="column"
          container
          style={{ width: `${cardWidth}px`,
                   marginLeft: "10px",
                   marginRight: "10px"
          }}
        >
          <Avatar
            alt="Team Member"
            variant="circle"
            src={props.headImage}
            style={{
              marginBottom: `${-radius}px`,
              marginLeft: `${(cardWidth-radius*2)*0.5}px`,
              height:`${radius*2}px`,
              width:`${radius*2}px`
            }}
          />
          <Card
            elevation={5}
            style={{
              backgroundColor: cardBackgroundColor,
              borderRadius:`${cardBorderRadius}px`
            }}
          >
            <Container
              height={`${cardBorderRadius}px`}
              style={{ height: "10px", backgroundColor: "#8e44ad" }}
            ><></>
            </Container>
            <Grid
              container
              justify="center"
            >
              <Typography
                variant='h5'
                style={{marginTop:`${radius}px`, fontSize:"1.5rem"}}
              >
                {props.name}
              </Typography>
            </Grid>
  
            <Grid
              container
              justify="center"
              style={{color:"#8e44ad"}}
            >
              <Typography
                variant='p'
                style={{ fontSize:"0.9rem" }}
              >
                {props.position}
              </Typography>
            </Grid>
            
            <Grid
              container
              justify="center"
              style={{marginBottom: "10px"}}
            >
              <Typography
                variant='body2'
                id="scroll"
                style={{
                  overflowY: 'scroll',
                  height: `${descriptionHeight}px`,
                  resize: "none",
                  padding:"10px",
                  madginTop:"10px"
                }}
              >
                {props.description}
              </Typography>
            </Grid>
  
          </Card>
          
        </Grid>
      </>
    );
  };


export const MemberSection = () => {
    const classes = useStyles()
    return(
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
                <Grid container align-items="flex-start">
                    {teamInfo.map((member, idx) => 
                        <MemberInfoStrip key={idx} {...member}/>
                    )}
                </Grid>
            </Grid>
        </Grid>
    )
}