import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import QuizPoint from "./QuizPoint";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "auto",
    height: "-moz-calc(100vh - 99px - 48px - 60px - 30px)",
    height: "-webkit-calc(100vh - 99px - 48px - 60px - 30px)",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function QuizList({
  quizes,
}) {
  const classes = useStyles();

  return (
    <List className={classes.root} disablePadding>
      {quizes
        .sort((a, b) => a.time - b.time)
        .map((quiz, i) => (
          <QuizPoint
            key={`$quiz-${quiz.id}-${i}`}
            quiz={quiz}
          />
        ))}
    </List>
  );
}
