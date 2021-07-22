import React, { useState } from "react";
import {
  Grid,
  Tabs,
  Tab,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Input,
  Divider,
  useMediaQuery,
  TextField,
  Checkbox,
  Paper,
  IconButton,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import EmptyIcon from "@material-ui/icons/HourglassEmpty";
import ResetIcon from "@material-ui/icons/Cached";
import AddIcon from "@material-ui/icons/AddBoxOutlined";
import BulletPointList from "../common/BulletPointList";
import { connect } from "react-redux";
import { summarizeMedia } from "../../redux/actions/summarize_actions";

const useStyles = makeStyles((theme) => {
  const matchesDark = theme.palette.type === "dark";

  return {
    tabContainer: {
      background: matchesDark ? theme.palette.primary.dark : "white",
      width: "100%",
      color: matchesDark ? "white" : undefined,
    },
    tab: {
      fontWeight: 800,
    },
    sectionContainer: {
      background: matchesDark
        ? theme.palette.primary.main
        : theme.palette.common.cloud,
      height: "-moz-calc(100vh - 99px - 48px)",
      height: "-webkit-calc(100vh - 99px - 48px)",
    },
    icon: {
      color: matchesDark ? "white" : theme.palette.common.grey,
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    divider: {
      background: theme.palette.type === "dark" ? "white" : "black",
    },
    cardOutline: {
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 5,
      paddingBottom: 5,
    },
    summaryStatus: {
      padding: 10,
      borderRadius: 15,
    },
    text: {
      color: matchesDark ? "white" : theme.palette.common.grey,
    },
    specialText: {
      fontStyle: "italic",
      color: matchesDark
        ? theme.palette.common.orange
        : theme.palette.common.blue,
      paddingLeft: "0.5rem",
      fontWeight: 1000,
    },
  };
});

function SummaryContent({
  media,
  mediaType,
  collectionId,
  summarizeMedia,
  getScreenshot,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesDark = theme.palette.type === "dark";
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [numSentences, setNumSentences] = useState(5);
  const [optimalSentence, setOptimalSentence] = useState(false);
  const [modelType, setModelType] = useState(0);
  const [dev, setDev] = useState(false);

  // fake data
  const [transcripts, setTranscripts] = useState([
    {
      id: 1,
      displayed_time: "00:01:24",
      time: 0.2,
      sentence:
        "Briefly will win the challenge. Will win the challenge. Win the challenge. The challenge. Challenge. <null>. Briefly will win the challenge. Will win the challenge. Win the challenge.",
    },
    {
      id: 2,
      displayed_time: "00:02:24",
      time: 0.4,
      sentence:
        "A friend function is an independent function which has access to the variables and methods of its befriended class.",
    },
    {
      id: 3,
      displayed_time: "00:03:24",
      time: 0.6,
      sentence:
        "To create a friend function for a class, it must be declared in the class along with the friend keyword.",
    },
    {
      id: 4,
      displayed_time: "00:04:24",
      time: 0.8,
      sentence:
        "The setRadius() function is completely independent of the Ball class, yet it has access to all the private variables.",
    },
    {
      id: 5,
      displayed_time: "00:05:24",
      time: 0.9,
      sentence:
        "Now, we'll take a look at a special category of functions called friends.",
    },
  ]);

  // fake edit API
  const handleTranscriptChange = (transcript, summary) => {
    const filteredTranscripts = transcripts.filter(
      (item) => item.id !== transcript.id
    );
    const newTranscripts = [
      ...filteredTranscripts,
      { ...transcript, sentence: summary.trim() },
    ];
    newTranscripts.sort((a, b) => a.id - b.id);
    setTranscripts(newTranscripts);
  };

  // fake delete API
  const handleTranscriptDelete = (transcript) => {
    const filteredTranscripts = transcripts.filter(
      (item) => item.id !== transcript.id
    );
    setTranscripts(filteredTranscripts);
  };

  // fake reset API
  const handleTranscriptReset = () => {
    setTranscripts([]);
  };

  // fake add API
  const handleAddTranscript = () => {
    console.log("add");
  };

  const summarize = async () => {
    const summaryConfig = {
      model: getModelType(),
      num_sentence: optimalSentence ? null : numSentences,
    };
    const summary = await summarizeMedia(
      collectionId,
      media.id,
      mediaType,
      summaryConfig
    );
    console.log(summary);
  };

  const handleTabChange = (e, value) => {
    setValue(value);
  };

  const handleModelTypeChange = (event) => {
    setModelType(Number(event.target.value));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getModelType = () => {
    switch (modelType) {
      case 1:
        return "Bert";
      case 2:
        return "GPT-2";
      case 3:
        return "XLNet";
      default:
        return "Bert";
    }
  };

  const Summary = (media) => {
    media = {
      ...media,
      model_type: "BERT",
      num_sentences: 10,
    };
    if (!dev && !media.is_summarized) {
      return (
        <React.Fragment>
          <Grid item>
            <EmptyIcon
              className={classes.icon}
              style={{ width: "7rem", height: "7rem" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">No summarization yet.</Typography>
          </Grid>
          <Grid item style={{ marginTop: "1.5rem" }}>
            <Button
              variant="contained"
              color={matchesDark ? "secondary" : "primary"}
              style={{ color: "white" }}
              onClick={handleClickOpen}
            >
              Start Summarization
            </Button>
          </Grid>
          <Grid item style={{ marginTop: "1.5rem" }}>
            <Button
              variant="contained"
              color={matchesDark ? "secondary" : "primary"}
              style={{ color: "white" }}
              onClick={() => setDev(true)}
            >
              See Bullet Points (dev mode)
            </Button>
          </Grid>
        </React.Fragment>
      );
    } else {
      return (
        <Grid
          item
          container
          className={classes.summaryStatus}
          direction="column"
        >
          <Grid item style={{ height: 60 }}>
            <Paper className={classes.cardOutline}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Grid item container direction="column">
                    <Grid item container alignItems="center">
                      <Typography variant="h6" className={classes.text}>
                        Model Type:
                      </Typography>
                      <Typography variant="h6" className={classes.specialText}>
                        {media.model_type}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      style={{ marginTop: 5 }}
                    >
                      <Typography variant="h6" className={classes.text}>
                        Bullet Points:
                      </Typography>
                      <Typography variant="h6" className={classes.specialText}>
                        {media.num_sentences}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton onClick={handleTranscriptReset}>
                    <ResetIcon className={classes.icon} />
                  </IconButton>
                  <IconButton onClick={handleAddTranscript}>
                    <AddIcon className={classes.icon} />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              className={classes.cardOutline}
              style={{
                marginTop: 10,
                padding: 0,
              }}
            >
              <BulletPointList
                transcripts={transcripts}
                getScreenshot={getScreenshot}
                onTranscriptChange={handleTranscriptChange}
                onTranscriptDelete={handleTranscriptDelete}
              />
            </Paper>
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <Grid container direction="column" style={{ minWidth: 300 }}>
      <Grid item container>
        <Tabs
          value={value}
          onChange={handleTabChange}
          className={classes.tabContainer}
          indicatorColor={matchesDark ? "secondary" : "primary"}
        >
          <Tab className={classes.tab} label="Summary"></Tab>
          <Tab className={classes.tab} label="Pop Quiz"></Tab>
          <Tab className={classes.tab} label="More..."></Tab>
        </Tabs>
      </Grid>
      <Grid
        item
        container
        className={classes.sectionContainer}
        justify={dev ? "flex-start" : "center"}
        alignItems="center"
        direction="column"
      >
        <Summary />
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        fullScreen={matchesXS}
        maxWidth="xs"
      >
        <DialogTitle>
          <Typography variant="h5">Summarization Configuration</Typography>
        </DialogTitle>
        <Divider variant="middle" classes={{ root: classes.divider }} />
        <DialogContent>
          <Grid container direction="column">
            <Grid item container>
              <FormControl
                fullWidth
                className={classes.formControl}
                color={matchesDark ? "secondary" : "primary"}
              >
                <InputLabel id="model-type-label">Model Type</InputLabel>
                <Select
                  labelId="model-type-label"
                  id="model-type-select"
                  value={modelType}
                  onChange={handleModelTypeChange}
                  input={<Input />}
                >
                  <MenuItem value={0}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>BERT</MenuItem>
                  <MenuItem value={2}>GPT-2</MenuItem>
                  <MenuItem value={3}>XLNet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item container justify="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optimalSentence}
                    onChange={() => setOptimalSentence(!optimalSentence)}
                    name="Optimal Sentence"
                    color={matchesDark ? "secondary" : "primary"}
                  />
                }
                label="Optimal Number of Sentences"
              />
            </Grid>
            {!optimalSentence && (
              <Grid item container>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    type="number"
                    value={numSentences}
                    InputProps={{
                      inputProps: {
                        max: 100,
                        min: 1,
                      },
                    }}
                    color={matchesDark ? "secondary" : "primary"}
                    label="Number of Sentences"
                    onChange={(e) => setNumSentences(e.target.value)}
                  />
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color={matchesDark ? "secondary" : "primary"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              summarize();
            }}
            color={matchesDark ? "secondary" : "primary"}
            disabled={modelType === 0}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  summarizeMedia,
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContent);
