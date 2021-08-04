import "./styles.css";
import { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Box,
  Button,
  Grid,
  ListItem,
  Typography
} from "@material-ui/core";
import { paragraphs } from "./data";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#ecf0f1",
    border: "5px solid #bdc3c7"
  },
  textStyle: {
    fontSize: "1rem"
  }
}));

const TranscriptionStrip = (props) => {
  const classes = useStyles();
  return props.last ? (
    <ListItem button>
      <Typography className={classes.textStyle}>
        {`${props.key}. ` + props.paragraph.text}
      </Typography>
    </ListItem>
  ) : (
    <>
      <ListItem button>
        <Typography className={classes.textStyle}>
          {props.paragraph.text}
        </Typography>
      </ListItem>
      <Divider />
    </>
  );
};

const lengthArray = (length) => [...Array(length)];

const TranscriptionSection = () => {
  const classes = useStyles();
  const pageReference = useRef([]);
  const scrollIntoView = (id) => {
    pageReference.current[id].scrollIntoView({ behavior: "smooth" });
  };
  const Transcription = () => {
    return (
      <Box
        id="scroll"
        component="nav"
        style={{ maxHeight: "80vh", overflow: "auto" }}
        className={classes.root}
        aria-label="mailbox folders"
      >
        {paragraphs.map((paragraph, idx) => (
          <div
            ref={(ele) => {
              pageReference.current[idx] = ele;
            }}
          >
            <TranscriptionStrip
              key={idx}
              paragraph={paragraph}
              style={{ backgroundColor: "#ecf0f1" }}
              last={idx === paragraph.length - 1}
            />
          </div>
        ))}
      </Box>
    );
  };
  return (
    <Grid direction="row">
      <Transcription />
      <Grid direction="column">
        {lengthArray(7).map((item, idx) => (
          <Button
            variant="contained"
            style={{ margin: "5px", backgroundColor: "#95a5a6" }}
            onClick={() => scrollIntoView(idx)}
          >
            {idx}
          </Button>
        ))}
      </Grid>
    </Grid>
  );
};

export default TranscriptionSection;