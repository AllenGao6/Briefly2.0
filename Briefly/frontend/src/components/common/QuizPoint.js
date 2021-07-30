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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  TextareaAutosize
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PublishIcon from "@material-ui/icons/Publish";

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
  quiz,
  seekTo,
}) {
  const classes = useStyles();
  const theme = useTheme();

  // constant
  const time = quiz.time;
  const pair_list = quiz.quiz;
  const count = quiz.count;
  // local states
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [editable, setEditable] = useState(false);

  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesDark = theme.palette.type === "dark";

  const handleToggleScreenshot = () => {
    setOpen(!open);
    if (imageRef.current === null) getScreenshot(time, imageRef, canvasRef);
  };
  const construct_pair = (pair_list) =>{
    let QA_pair = [];
    for(let i = 0; i < pair_list.length; i++){
        QA_pair.push([pair_list[i].question, pair_list[i].answer]);
    }
    return QA_pair;
  };
  console.log(construct_pair(pair_list));
  return (
    <React.Fragment>
        {construct_pair(pair_list).map((pair, i) =>(
        <React.Fragment>
          <ListItem key={pair.answer+i} dense={true}>
            <Grid container direction="column">
              <Grid item container justify="space-between" alignItems="center">
                <Typography className={classes.title} variant="h5">{`Question ${count+i}:`}</Typography>
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
              <Grid item justify="center" alignItems="center" style={{ paddingTop: 10, lineHeight: 0.5 }}>
                <Typography>{pair[0]}</Typography>
              </Grid>
              <Grid item style={{ paddingTop: 10, lineHeight: 0.5 }}>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  style={{width: "100%", justifyItems: "center"}}
                  color="primary"
                  id="outlined-textarea"
                  label="Your Answer:"
                  placeholder="Input your answer..."
                  multiline
                  rows={3}
                  variant="outlined"
                />
                            
              </form>
              </Grid>
              {answerVisible ? <h1>Not Visible</h1>: null}
            </Grid>
          </ListItem>
          <Divider variant="middle" className={classes.divider} />
        </React.Fragment>

        ))}
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
