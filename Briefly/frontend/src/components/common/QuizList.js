import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
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
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
}));

export default function QuizList({ quizes, answerVisible, mediaType }) {
  const classes = useStyles();

  const construct_pair = (pair_list) => {
    let QA_pair = [];
    for (let i = 0; i < pair_list.length; i++) {
      QA_pair.push([pair_list[i].question, pair_list[i].answer]);
    }
    console.log(QA_pair);
    return QA_pair;
  };
  if (mediaType === "text") {
    return (
      <List className={classes.root} disablePadding>
        {quizes.map((quiz, i) => (
          <React.Fragment key={i}>
            <QuizPoint
              pair={quiz}
              answerVisible={answerVisible}
              time={null}
              count={null}
              index={i + 1}
              mediaType={mediaType}
            />
            <Divider variant="middle" className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    );
  } else {
    return (
      <List className={classes.root} disablePadding>
        {quizes
          .sort((a, b) => a.count - b.count)
          .map((quiz, i) => (
            <React.Fragment>
              {construct_pair(quiz.quiz).map((pair, i) => (
                <React.Fragment key={`$quiz-${quiz.id}-${i}`}>
                  <QuizPoint
                    pair={pair}
                    answerVisible={answerVisible}
                    time={quiz.time}
                    count={quiz.count}
                    index={i}
                    mediaType={mediaType}
                  />
                  <Divider variant="middle" className={classes.divider} />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
      </List>
    );
  }
}
