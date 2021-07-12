import {makeStyles} from "@material-ui/styles";
import {Avatar, Card, Container, Paper, Grid, Typography, CardMedia,} from "@material-ui/core";
import {teamInfo} from "./data.js";
import React from 'react';
import head5 from "../../../assets/heads/head5.jpg";


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
        width: "80%",
    },
    teamMemberStrip: {
        marginBottom: "50px",
        backgroundColor: theme.palette.common.silver,
    }
}))

const MemberInfoStrip = (props) => {
    const classes = useStyles()
    return(
        <>
            <Grid
                justify='center'
                align-items='center'
                direction='column'
                container
                style={{backgroundColor:"#3498db"}}
            >
                <Avatar 
                    alt="Remy Sharp" 
                    src={head5}
                    style={{marginBottom:"-20px", marginLeft:"30px"}}/>
                <Card style={{height:"100px", width:"100px", backgroundColor:"#95a5a6"}}>
                    <Grid style={{height:"100px", width:"100%", color:"#c0392b"}}></Grid>
                </Card>
            </Grid>
        </>
    )
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
                <Grid container justify="center" direction="column">
                    <MemberInfoStrip />
                </Grid>
            </Grid>
        </Grid>
    )
}