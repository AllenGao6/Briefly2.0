import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
    Divider,
    Typography,
    Grid,
    Button,
    ListItem,
    List,
  } from "@material-ui/core";
import { darken } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { seekTo } from "../../redux/actions/player_actions";
  

const useStyles = makeStyles((theme) => ({
    root: {
      overflow: "auto",
      height: "-moz-calc(38vh)",
      height: "-webkit-calc(38vh)",
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    text: {
        color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
        lineHeight: 1.4,
      },
    timestampButton: {
        color: "white",
        background: theme.palette.common.blue,
        padding: "3px 8px",
        borderRadius: 8,
        "&:hover": {
            background: darken(theme.palette.common.green, 0.2),
        },
    },
    divider: {
        background: theme.palette.type === "dark" ? "white" : "black",
        width: '95%',
      },
  }));

function TranscriptList({ audioText, seekTo }){
    const classes = useStyles();
    const theme = useTheme();
    // console.log(audioText);
    
    return (
        <List className={classes.root} >
            {audioText
            .sort((a, b) => a.time - b.time)
            .map((audio_text, i) =>(
                <ListItem key={audio_text.id} dense={true}>
                    <Grid
                        container
                        direction="row"
                    >
                        <Grid container justify="flex-end" alignItems="center">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    className={classes.timestampButton}
                                    onClick={() => seekTo(audio_text.time)}
                                >
                                    {audio_text.displayed_time}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" className={classes.text}>
                                {audio_text.sentence}
                            </Typography>
                        </Grid>
                        <Divider variant="middle" className={classes.divider} />
                    </Grid>
                </ListItem>
            ))}
        </List>
    )
}
function mapStateToProps(state) {
    return {};
  }
  
const mapDispatchToProps = {
    seekTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptList);
