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


const useStyles = makeStyles((theme) => ({
    root: {
      overflow: "auto",
      height: "-moz-calc(100vh - 99px - 48px - 60px - 30px)",
      height: "-webkit-calc(100vh - 99px - 48px - 60px - 30px)",
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
        background: "black",
        width: '95%',
      },
  }));

export default function TranscriptList({ audioText }){
    const classes = useStyles();
    const theme = useTheme();

    
    return (
        <List className={classes.root} >
            <ListItem dense={true}>
                <Grid
                    container
                    direction="row"
                >
                    <Grid container justify="flex-end" alignItems="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                className={classes.timestampButton}
                                onClick={() => alert('dclicked!')}
                            >
                                timestamp
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" className={classes.text}>
                            this will be our transcriptions
                        </Typography>
                    </Grid>
                    <Divider variant="middle" className={classes.divider} />

                </Grid>
            </ListItem>

        </List>
    )
}
