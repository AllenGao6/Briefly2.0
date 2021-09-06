import React, { useState, useRef } from "react";
import { makeStyles, StylesContext } from "@material-ui/styles";
import {
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  Divider,
  Tooltip,
  InputBase,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import BackupIcon from "@material-ui/icons/Backup";
import { connect } from "react-redux";
import { updateTextInCollection } from "../../redux/actions/text_actions";

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
  titleContainer: {
    marginTop: 10,
    background:
      theme.palette.type === "dark" ? theme.palette.common.orange : theme.palette.common.blue,
    width: "98%",
    position: "relative",
    borderRadius: 10,
    border: "1.5px solid",
  },
  rootContainer: {
    minWidth: 530,
    width: "100%",
    display: "flex",
    alignItems: "center",

    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background:
      theme.palette.type === "dark" ? theme.palette.common.grey : theme.palette.common.cloud,
    flexDirection: "column",
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
    width: "90%",
    marginTop: 10,
  },
  createButton: {
    size: 10,
  },
  text_form: {
    // border: "3px solid",
    borderRadius: 15,
    // borderColor: 'orange',
    "& .MuiInputBase-root": {
      color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
      height: "-moz-calc(100vh - 99px - 48px - 75px )",
      height: "-webkit-calc(100vh - 99px - 48px - 75px )",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 15,
      "&.Mui-focused fieldset": {
        borderColor:
          theme.palette.type === "dark" ? theme.palette.common.orange : theme.palette.common.blue,
      },
    },
  },
}));

function TextDisplay({ media, collectionId, updateTextInCollection }) {
  const text = media.text;
  const classes = useStyles();
  const [textInput, setText] = useState(text);
  const [edit, setEdit] = useState(true);
  const [row, setRow] = useState(Math.round((window.innerHeight - 200) / 20));

  const updateText = async () => {
    const text = {
      text: textInput,
    };
    setEdit(true);
    await updateTextInCollection(collectionId, text, media.id);
  };

  React.useEffect(() => {
    function handleResize() {
      setRow(Math.round((window.innerHeight - 200) / 20));
      console.log("resized to: ", window.innerWidth, "x", window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
  });

  return (
    <div className={classes.rootContainer}>
      <Grid container direction="column" alignItems="center">
        <Grid
          item
          container
          justify="center"
          alignItems="center"
          className={classes.titleContainer}
        >
          <Grid item>
            <Typography variant="h3" style={{ color: "white" }}>
              {media.title}
            </Typography>
          </Grid>
          <Grid item>
            {edit ? (
              <IconButton onClick={() => setEdit(false)} className={classes.createButton}>
                <Tooltip title="Edit Content" arrow>
                  <CreateIcon />
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton onClick={() => updateText()} className={classes.createButton}>
                <Tooltip title="Save" arrow>
                  <BackupIcon />
                </Tooltip>
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Grid item style={{ width: "98%", marginTop: "18px" }}>
          <TextField
            disabled={edit}
            variant="outlined"
            rows={row}
            multiline
            fullWidth
            margin="normal"
            inputProps={{ style: { fontSize: 17 } }} // font size of input text
            value={textInput}
            className={classes.text_form}
            id="standard-basic"
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </Grid>
      </Grid>
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  updateTextInCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextDisplay);
