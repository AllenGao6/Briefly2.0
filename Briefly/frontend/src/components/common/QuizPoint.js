import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import {
  InputBase,
  FormHelperText,
  FormControl,
  TextField,
  Collapse,
  Divider,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  ListItem,
  Box,
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles";


import { connect } from "react-redux";
import { seekTo } from "../../redux/actions/player_actions";

const useStyles = makeStyles((theme) => ({
  root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    '& .MuiOutlinedInput-root': {
      
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
  title: {
    fontStyle: "italic",
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    lineHeight: 1.4,
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
    background: theme.palette.common.green,
    padding: "3px 8px",
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

function QuizPoint({
  pair,
  seekTo,
  answerVisible,
  time,
  count,
  index,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesDark = theme.palette.type === "dark";
  const [value, setValue] = useState("")
  //console.log(construct_pair(pair_list));
  console.log(value);
  return (
    <React.Fragment>
      <ListItem key={pair.answer+index} dense={true}>
        <Grid container direction="column">
          <Grid item container justify="space-between" alignItems="center">
            <Typography className={classes.title} variant="h5">{`Question ${count+index}:`}</Typography>
            <Grid item>
              <Button
                variant="contained"
                className={classes.timestampButton}
                onClick={() => seekTo(time)}
              >
                Review
              </Button>
            </Grid>
          </Grid>
          <Grid item style={{ paddingTop: 10, lineHeight: 0.5 }}>
            <Typography>{pair[0]}</Typography>
          </Grid>
          <Grid item style={{ paddingTop: 10, lineHeight: 0.5 }}>
          <form key={`form${count+index}`} className={classes.root} noValidate autoComplete="off">
            <TextField
              key={`textarea${count+index}`}
              style={{width: "100%", justifyItems: "center"}}
              color="primary"
              value={value}
              onChange={(e)=> setValue(e.currentTarget.value)}
              label="Your Answer:"
              placeholder="Input your answer..."
              multiline
              rows={3}
              variant="outlined"
              error={false}
            />
                        
          </form>
          </Grid>
          {answerVisible ? <Typography style={{marginTop: "10px", marginBottom: "10px"}} variant="h5" component="div">
                              <Box display="inline" fontWeight="fontWeightBold">
                                Answer: 
                              </Box>{" "}
                              {pair[1]}
                            </Typography>
                            : null}
        </Grid>
      </ListItem>
      <Divider variant="middle" className={classes.divider} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  seekTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizPoint);
