import {makeStyles, useTheme} from "@material-ui/styles";
import React, {useState} from "react";
import {Container, Grid, Button, Box, Typography, TextareaAutosize} from '@material-ui/core';
import {contactInfo, ratingComment} from "./data.js";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";



const useStyles = makeStyles((theme) => ({
    footer: {
        background: theme.palette.common.grey,
        color: 'white',
        marginTop: '5rem',
    },
    secondaryCaption: {
        ...theme.typography.secondaryCaption,
        color:'inherit',
        marginTop: '-5px',
    },
    infoFont: {
        ...theme.typography.secondaryCaption,
        color:'inherit',
        fontSize: "25px"
    },
    disabledButtonFont: {
        ...theme.typography.secondaryCaption,
        color:'#7f8c8d',
        marginTop: '2px',
    },
    buttonFont: {
        ...theme.typography.secondaryCaption,
        color:'#34495e',
        marginTop: '2px',
    },
    emphasizedBody1: {
        ...theme.typography.emphasizedBody1,
        fontFamily: "Ubuntu",
        fontWeight: 400,
        fontSize: "1.0rem",
        color: "#2c3e50",
    }
}));

const InfoStrip = (props) => {
    const theme = useTheme()
    const classes = useStyles()
    return (
        <Grid container direction="column">
            <Grid
                container
                alignItems="center"
                style={{ backgroundColor: "#2980b9", maxWidth: 400 }}
            >
                <ArrowForwardIosRoundedIcon style={{color:'#2c3e50', fontSize:'25px'}}/>
                <Typography
                    className={classes.infoFont}
                    style={{ color: "#2c3e50" }}
                >
                    {props.data.type}
                </Typography>
            </Grid>
            <Typography
                className={classes.infoFont}
                style={{ marginLeft: 40, color: "#bdc3c7", fontSize:"30px" }}
            >
                {props.data.info}
            </Typography>
        </Grid>
    )
};

const InfoSection = (props) => (
    <Grid container>
        {props.data.map((item, idx) => (
        <InfoStrip key={`${item}-${idx}`} data={item} />
        ))}
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
            style={{ fontSize: "500%", color: "#7f8c8d" }}
            onClick={onSelect}
        />
        );
    }
};

const Rating = ({ totalStars = 5 }) => {
    const classes = useStyles()
    const [rated, setRated] = useState(false)
    const [rating, setRating] = useState(0);
    return (
        <>
            <Grid
            item
            container
            direction="column"
            alignItems="center"
            justify="flex-start"
            className={classes.contactArea}
            >
                <Grid style={{ padding: 10 }}>
                    {createArray(totalStars).map((star, idx) => (
                    <MyStar
                        key={`mystar-${star}-${idx}`}
                        selected={rating > idx}
                        onSelect={() => {
                        setRating(idx + 1);
                        setRated(true);
                        }}
                    />
                    ))}
                </Grid>
                <Typography>
                    {rated ? (
                    <Typography
                        className={classes.secondaryCaption}
                        style={{ fontSize: "50px", color: "#e74c3c" }}
                    >
                        {ratingComment[rating - 1]}
                    </Typography>
                    ) : (
                    <Typography
                        className={classes.secondaryCaption}
                        style={{ fontSize: "50px", color: "#2980b9" }}
                    >
                        Click to rate!
                    </Typography>
                    )}
                </Typography>
                <TextareaAutosize
                    aria-label="minimum height"
                    rowsMin={4}
                    style={{ width: "80%" }}
                    placeholder="Some Feedbacks ..."
                    cols={40}
                    style={{fontFamily: "Ubuntu", fontSize:"1.5rem"}}
                />
        
                <Button
                    disabled={!rated}
                    variant="contained"
                    color="secondary"
                    onClick={() => alert("Thank you! Your feedback is valuable.")}
                    style={{ margin: 10, textTransform: "none" }}
                >
                    <Typography
                        className={rated ? classes.buttonFont : classes.disabledButtonFont}
                    >
                        Submit
                    </Typography>
                </Button>
            </Grid>
                
        </>
    );
  };

export const PageFooter = (props) => {
    const classes = useStyles()
    if(props.LandingVisible){
        return <div className={classes.footer}>
            <Grid
                justify="center"
                alignItems="center"
                container
                direction="column"
            >
                <Grid style={{height:20}}></Grid>
                <Box px={{xs:3, sm:10}} py={{xs:5, sm:10}}>
                    <Container maxWidth='lg'>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                <Box borderBottom={1}>Contact Us</Box>
                                <Box>
                                <Grid item style={{marginTop:'1rem'}}>
                                    <InfoSection data={contactInfo} />
                                </Grid>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box borderBottom={1}>Rate The Page</Box>
                                <Box>
                                    <Grid item style={{marginTop:'1rem'}}>
                                        <Rating />
                                    </Grid>
                                </Box>
                            </Grid>
                            
                        </Grid>
                        <Box textAlign='center' pt={{xs:5, sm:10}} pb={{xs:5, sm:0}}>
                            copyright © 2021- &reg;{new Date().getFullYear()} Briefly Inc. All rights reserved. 
                        </Box>
                    </Container>
                </Box>
            </Grid>
        </div>
    }else{
        return(
            <div className={classes.footer} style={{height: "40px"}}>
                <Box textAlign='center' >
                    copyright © 2021- &reg;{new Date().getFullYear()} Briefly Inc. All rights reserved. 
                </Box>
            </div>
        )
    }
}