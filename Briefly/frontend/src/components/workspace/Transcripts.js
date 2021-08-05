import React, { useState, useCallback, useEffect, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import { Grid, Paper, InputAdornment, InputBase } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import TranscriptList from "../common/TranscriptList";
import { darken, lighten } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  const matchesDark = theme.palette.type === "dark";
  return {
    divider: {
      background: "black",
    },
    search: {
      width: "100%",
      height: 40,
      margin: 10,
      paddingLeft: 10,
      color:
        theme.palette.type === "dark"
          ? theme.palette.common.cloud
          : theme.palette.common.grey,
      border: "2px solid",
      borderColor:
        theme.palette.type === "dark"
          ? theme.palette.common.white
          : lighten(theme.palette.common.grey, 0.5),
      borderRadius: 15,
      fontSize: "1rem",
      transition: "all 0.2s",
      "&.Mui-focused": {
        borderColor:
          theme.palette.type === "dark"
            ? theme.palette.common.orange
            : theme.palette.common.blue,
      },
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
      top: 0,
      bottom: 100,
      position: "relative",
    },
  };
});

export default function Transcripts({ media }) {
  const classes = useStyles();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [transcriptHeight, setTranscriptHeight] = useState(300);
  const observer = useRef();

  const containerRef = useCallback((node) => {
    if (node !== null) {
      observer.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          setTranscriptHeight(height - 80);
        }
      });
      observer.current.observe(node);
    }
  }, []);

  const process_audioText = (audioText) => {
    let new_audioText = [];
    let temp_text = null;
    for (let i = 0; i < audioText.length; i++) {
      if (audioText[i].sentence.split(" ").length < 25) {
        if (temp_text === null) {
          temp_text = audioText[i];
        } else {
          temp_text.sentence += " " + audioText[i].sentence;
          if (temp_text.sentence.split(" ").length >= 25) {
            new_audioText.push(temp_text);
            temp_text = null;
          }
        }
      } else new_audioText.push(audioText[i]);
    }
    if (temp_text !== null) new_audioText.push(temp_text);
    return new_audioText;
  };

  const filter_media = (text) => {
    return text.filter((item) =>
      item.sentence.toLowerCase().includes(search.toLowerCase())
    );
  };

  const text_script = process_audioText(JSON.parse(media.transcript));
  return (
    <div
      style={{
        zIndex: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        background:
          theme.palette.type === "dark"
            ? theme.palette.common.grey
            : theme.palette.common.cloud,
        minWidth: 300,
      }}
      ref={containerRef}
    >
      <Grid
        container
        className={classes.sectionContainer}
        justify={"center"}
        alignItems="stretch"
        direction="column"
      >
        <Grid item container>
          <InputBase
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
          />
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid item container direction="column" style={{ width: "100%" }}>
          <Paper
            style={{
              marginTop: 10,
              marginLeft: 10,
              marginRight: 10,
              overflow: "auto",
              height: transcriptHeight,
            }}
          >
            <TranscriptList audioText={filter_media(text_script)} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
