import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import store from "store";
import {
  InputBase,
  FormHelperText,
  FormControl,
  TextField,
  Collapse,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  ListItem,
  Box,
  Tooltip,
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { seekTo } from "../../redux/actions/player_actions";
import ReviewIcon from "@material-ui/icons/RateReview";

const useStyles = makeStyles((theme) => ({
  root: {
    "& label.Mui-focused": {
      color: "green",
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  },

  title: {
    fontStyle: "italic",
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    fontWeight: 800,
  },
  secondary: {
    marginRight: "1rem",
    "& .MuiTypography-colorTextSecondary": {
      color: "white",
      background: theme.palette.common.green,
      padding: "3px 8px",
      borderRadius: 8,
      marginTop: 5,
    },
    "& .MuiTypography-displayBlock": {
      display: "inline-block",
    },
  },
  timestampButton: {
    color: "white",
    padding: "3px 8px",
    background: theme.palette.common.green,
    borderRadius: 8,
    "&:hover": {
      background: darken(theme.palette.common.green, 0.2),
    },
  },
  icon: {
    color:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
    fontSize: "1.75rem",
  },
  summaryText: {
    borderColor:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
    padding: 5,
  },
  deleteButton: {
    color: theme.palette.common.red,
  },
  editButton: {
    color: theme.palette.common.blue,
  },
}));

function QuizPoint({ pair, seekTo, answerVisible, time, count, index, mediaType }) {
  const classes = useStyles();
  const theme = useTheme();

  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesDark = theme.palette.type === "dark";

  const id = count + index;

  const [value, setValue] = useState("");

  const setAnswer = (id, value) => {
    console.log(value);
    store.set(id, value);
    setValue(store.get(id));
  };
 
  useEffect(() => {
    const result = store.get(id);
    if (result === null) {
      store.set(id, "");
      setValue("");
    } else setValue(result);
  }, []);

  //console.log(construct_pair(pair_list));
  // console.log(answer);
  return (
    <ListItem dense={true}>
      <Grid container direction="column" style={{ paddingTop: 10 }}>
        <Grid item container justify="space-between" alignItems="center">
          <Typography className={classes.title} variant="h5">
            {mediaType === 'text' ? 
            `Question ${index}:` :
            `Question ${count + index}:`}
          </Typography>
          {mediaType==='text' ? null : 
          <Tooltip title="Review" arrow>
            <ReviewIcon
              style={{
                color: theme.palette.common.blue,
                alignSelf: "center",
                cursor: "pointer",
              }}
              onClick={() => seekTo(time)}
            />
          </Tooltip>
          }
        </Grid>
        <Grid item style={{ paddingTop: 10 }}>
          <Typography>{mediaType==='text' ? pair['question'] : pair[0]}</Typography>
        </Grid>
        <Grid
          item
          container
          style={{
            paddingTop: 10,
            lineHeight: 0.5,
            paddingBottom: answerVisible ? 0 : 10,
          }}
          alignItems="center"
        >
          <TextField
            color={matchesDark ? "secondary" : "primary"}
            value={value}
            onChange={(e) => setAnswer(id, e.currentTarget.value)}
            label="Type your answer..."
            multiline
            fullWidth
            rows={3}
            variant="outlined"
            error={false}
          />
        </Grid>
        {answerVisible ? (
          <Typography
            style={{
              color: matchesDark
                ? theme.palette.common.green
                : theme.palette.common.red,
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "1rem",
            }}
            variant="h5"
            component="div"
          >
            <Box display="inline" variant="h5" fontWeight="fontWeightBold">
              Answer:
            </Box>{" "}
            {mediaType==='text' ? pair['answer'] : pair[1]}
          </Typography>
        ) : null}
      </Grid>
    </ListItem>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  seekTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizPoint);
