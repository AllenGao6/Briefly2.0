import {makeStyles, useTheme} from "@material-ui/styles";
import React, {useState} from "react";
import {Container, Grid, Box, Typography} from '@material-ui/core';
import {contactInfo, ratingComment} from "./data.js";
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
        marginTop: '2px',
    }
}));

const InfoStrip = (props) => {
    const theme = useTheme()
    const classes = useStyles()
    return (
        <Grid container direction="column">
        <Grid
            container
            alignItems="baseline"
            style={{ backgroundColor: theme.palette.common.silver, maxWidth: 200 }}
        >
            <ArrowForwardIosRoundedIcon />
            <Typography
            className={classes.secondaryCaption}
            style={{ color: "#2c3e50" }}
            >
            {props.data.type}
            </Typography>
        </Grid>
        <Typography
            className={classes.secondaryCaption}
            style={{ marginLeft: 40, color: "white" }}
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

export const PageFooter = () => {
    const classes = useStyles()

    return <div className={classes.footer}>
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
                        <Box borderBottom={1}>Rate Us</Box>
                        <Box>
                        </Box>
                    </Grid>
                    
                </Grid>
                <Box textAlign='center' pt={{xs:5, sm:10}} pb={{xs:5, sm:0}}>
                    copyright © 2017- &reg;{new Date().getFullYear()} Briefly. All rights reserved. 
                </Box>
            </Container>
        </Box>
    </div>
}