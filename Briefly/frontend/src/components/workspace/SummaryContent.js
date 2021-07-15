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
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import EmptyIcon from "@material-ui/icons/HourglassEmpty";

const useStyles = makeStyles((theme) => {
  const matchesDark = theme.palette.type === "dark";

  return {
    tabContainer: {
      background: matchesDark
        ? theme.palette.primary.dark
        : theme.palette.common.cloud,
      width: "100%",
      color: matchesDark ? "white" : undefined,
    },
    tab: {
      fontWeight: 800,
    },
    sectionContainer: {
      background: matchesDark ? theme.palette.primary.main : "white",
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
  };
});

export default function SummaryContent({ media }) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesDark = theme.palette.type === "dark";
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [numSentences, setNumSentences] = useState(5);
  const [optimalSentence, setOptimalSentence] = useState(false);
  const [modelType, setModelType] = useState(0);

  const summarize = () => {
    const summaryOptions = {
      model_type: getModelType(),
      num_sentences: optimalSentence ? null : numSentences,
    };
    console.log(summaryOptions);
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
        return "BERT";
      case 2:
        return "GPT-2";
      case 3:
        return "XLNet";
      default:
        return "BERT";
    }
  };

  const Summary = (media) => {
    if (!media.is_summarized) {
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
        </React.Fragment>
      );
    } else {
    }
  };

  return (
    <Grid container direction="column">
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
        justify="center"
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
          <Typography variant="h5">Summarization Information</Typography>
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
