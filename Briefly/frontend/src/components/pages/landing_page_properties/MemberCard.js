import "./style.css";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Card, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import main from "../../../assets/heads/main.jpg";

const useStyles = makeStyles((theme) => ({
  emphasizedBody1: {
    fontFamily: "Ubuntu",
    fontWeight: 400,
    fontSize: "1.0rem",
    color: "#2c3e50"
  },
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "60px",
    color: "#2980b9"
  },
  teamContainer: {
    width: "80%"
  },
  teamMemberStrip: {
    marginBottom: "50px",
    backgroundColor: "#95a5a6"
  }
}));

const radius = 30
const cardWidth = 285
const cardBackgroundColor = "#ecf0f1"

export const MemberInfoStrip = (props) => {
  return (
    <>
      <Grid
        justify="center"
        align-items="center"
        direction="column"
        container
        style={{ width: `${cardWidth}px`}}
      >
        <Avatar
          alt="Rachmaninoff"
          variant="circle"
          src={main}
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
            borderRadius:"10px"
          }}
        >
          <Container
            height="10px"
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
              Rachmaninoff
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
              Romanticism Pianist
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
                height: "120px",
                resize: "none",
                padding:"10px",
                madginTop:"10px"
              }}
            >
              Sergei Rachmaninov, (born March 20 [April 1, New Style], 1873, Oneg, near Semyonovo, Russia—died March 28, 1943, Beverly Hills, California, U.S.), composer who was the last great figure of the tradition of Russian Romanticism and a leading piano virtuoso of his time. He is especially known for his piano concerti and the piece for piano and orchestra titled Rhapsody on a Theme of Paganini (1934).
            </Typography>
          </Grid>

        </Card>
        
      </Grid>
    </>
  );
};

export const MemberCard = () => {
  const classes = useStyles();
  return (
    <Grid
      justify="center"
      alignItems="center"
      container
      direction="column"
      id="team"
    >
      <Grid className={classes.teamContainer}>
        <Grid container justify="center" direction="column">
          <MemberInfoStrip />
        </Grid>
      </Grid>
    </Grid>
  );
};