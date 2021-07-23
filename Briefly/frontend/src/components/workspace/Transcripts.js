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

const useStyles = makeStyles((theme) => ({
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
    color: "blue",
    fontSize: "1.25rem",
  },
  cardOutline: {
    width: "95%",
    height: "100%",
    marginLeft: "2.5%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
}));

export default function Transcripts() {
  const classes = useStyles();
  const theme = useTheme();
  const [search, setSearch] = useState("");

  return (
    <Grid
      container
      direction="column"
      style={{
        zIndex: 1,
        background: "white",
        position: "absolute",
        top: 0,
        bottom: 0,
      }}
    >
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
      <Grid item>
        <Paper
          className={classes.cardOutline}
          style={{
            marginTop: 10,
            padding: 0,
          }}
        >
          <Typography> There will be transcript here</Typography>
          {/* <BulletPointList
                transcripts={transcripts}
                getScreenshot={getScreenshot}
                onTranscriptChange={handleTranscriptChange}
                onTranscriptDelete={handleTranscriptDelete}
              /> */}
        </Paper>
      </Grid>
    </Grid>
  );
}
