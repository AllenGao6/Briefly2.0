import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import {
  Typography,
  Grid,
  Icon,
  Paper,
  Button,
  InputAdornment,
  InputBase,
} from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import TranscriptList from "../common/TranscriptList";

const useStyles = makeStyles((theme) => {
  const matchesDark = theme.palette.type === "dark";
  return{
  divider: {
    background: "black",
  },
  search: {
    width: "100%",
    // background:
    //   theme.palette.type === "dark"
    //     ? theme.palette.primary.main
    //     : lighten("#2481F4", 0.2),
    height: "2.8rem",
    padding: "1rem",
    color: theme.palette.type === "dark"
      ? theme.palette.common.white
      : "blue",
    fontSize: "1.25rem",
  },
  cardOutline: {
    width: "97%",
    height: "100%",
    marginLeft: "1.5%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  transcriptStatus: {
    padding: 10,
    borderRadius: 15,
  },
  sectionContainer: {
    background: matchesDark
      ? theme.palette.primary.main
      : theme.palette.common.cloud,
    height: "-moz-calc(100vh - 99px - 48px)",
    height: "-webkit-calc(100vh - 99px - 48px)",
  },
}});

export default function Transcripts({ media }) {
  const classes = useStyles();
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const process_audioText = (audioText) =>{
    let new_audioText = [];
    let temp_text = null;
    for(let i = 0; i < audioText.length; i++){
        if(audioText[i].sentence.split(" ").length < 25){
            if(temp_text === null){
                temp_text = audioText[i];
            }else{
                temp_text.sentence += " " + audioText[i].sentence;
                if(temp_text.sentence.split(" ").length >= 25){
                    new_audioText.push(temp_text);
                    temp_text = null;
                }
            }        
        }else
            new_audioText.push(audioText[i]);
    }
    if(temp_text !== null)
        new_audioText.push(temp_text);
    return new_audioText;
  }

  const filter_media = (text) => {
    return text.filter((item) =>
      item.sentence.toLowerCase().includes(search.toLowerCase())
    );
  };

  const text_script = process_audioText(JSON.parse(media.transcript));
  return (
   <div style={{
    zIndex: 1,
    background: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    background:
      theme.palette.type === "dark"
        ? theme.palette.common.grey
        : theme.palette.common.cloud,
  }}>
      <Grid container direction="column" style={{ minWidth: 300 }}>
      <Grid item container style={{ height: 40 }}>
        <InputBase
          style={{
            marginLeft: "1rem",
            verticalAlign: "center",
            paddingLeft: 0,
            fontSize: "1rem",
            
          }}
          placeholder="Search Transcript..."
          id="search"
          variant="outlined"
          value={search}
          fullWidth
          size="medium"
          classes={{ root: classes.search }}
          startAdornment={
            <InputAdornment position="start">
              <SearchOutlinedIcon style={{ fontSize: "1.2rem" }} />
            </InputAdornment>
          }
          onChange={(event) => setSearch(event.target.value)}
        ></InputBase>
      </Grid>
      <Divider variant="middle" className={classes.divider} />
      <Grid
        item
        container
        direction="column"
        style={{width: "100%", height:"100%"}}
      >
        <Paper
          className={classes.cardOutline}
          style={{
            marginTop: 10,
            padding: 0,
          }}
        >
          <TranscriptList audioText={filter_media(text_script)}/>
        </Paper>
      </Grid>
    </Grid>
    </div>
  );
}
