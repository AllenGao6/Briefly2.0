import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  useTheme,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../redux/constant";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    overflow: "scroll",
    height: "-moz-calc(100vh - 99px - 48px - 60px - 30px - 188px)",
    height: "-webkit-calc(100vh - 99px - 48px - 60px - 30px - 188px)",
    maxWidth: "100%",
  },
  cardOutline: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  summaryStatus: {
    padding: 10,
    borderRadius: 15,
    paddingTop: 0,
  },
  humanAvatar: {
    height: 45,
    width: 45,
    background: theme.palette.common.green,
    color: "white",
  },
  aiAvatar: {
    height: 45,
    width: 45,
    background: theme.palette.common.blue,
    color: "white",
  },
}));

function Chatbot({ mediaType, mediaId, collectionId, user }) {
  const classes = useStyles();
  const theme = useTheme();

  const [chatList, setChatList] = useState([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setChatList([
      {
        type: "AI",
        content:
          "Hi! I'm your AI assistant powered by GPT-3. Ask me any questions you want regarding your content!",
        date: getUnixTime(),
        name: "AI",
      },
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [chatList]);

  const handleSendQuestion = async () => {
    const chat = {
      type: "Human",
      content: content,
      date: getUnixTime(),
      name: `${user.firstname} ${user.lastname}`,
    };

    setSending(true);
    setChatList((prev) => [...prev, chat]);

    // console.log(`${BASE_URL}api/collection/${collectionId}/${mediaType}/${mediaId}/question_ans/`);
    const res = await axios.post(
      `${BASE_URL}api/collection/${collectionId}/${mediaType}/${mediaId}/question_ans/`,
      { question: content, context: chatList },
      {
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }
    ).catch(function (error) {
      if (error.response.status === 429) {
        toast.error("Max limit reached!");
      } else {
        toast.error("Please try again later");
      }
    });
    if (res.status === 200) {
      let answers = [];
      res.data.ans.forEach((ans) => {
        answers.push({
          type: "AI",
          content: ans,
          date: getUnixTime(),
          name: "AI",
        });
      });

      setChatList((prev) => [...prev, ...answers]);

      setSending(false);
      setContent("");
    }
  };

  const getInitials = (firstName, lastName) => {
    let firstInitial = firstName[0];
    let lastInitial = lastName[0];
    let initials = firstInitial.toUpperCase() + lastInitial.toUpperCase();
    return initials;
  };

  const getUnixTime = () => {
    var date = new Date();
    var unixTime = date.getTime() / 1000;
    return unixTime;
  };

  /*
  Create a function that takes a unix time,
  and return the duration between now and that unix time. Returned message looks like the following:
  1) xxx days ago
  2) xxx months ago
  3) xxx years ago
  4) xxx hours ago
  4) xxx minutes ago
  5) xxx seconds ago -- created by OpenAI */
  const timeAgo = (unixTime) => {
    var time = new Date(unixTime * 1000);
    var now = new Date();
    var diff = now.getTime() - time.getTime();
    var day = 1000 * 60 * 60 * 24;
    var month = day * 30;
    var year = month * 12;
    var hour = 1000 * 60 * 60;
    var minute = 1000 * 60;
    var second = 1000;
    var days = Math.floor(diff / day);
    var months = Math.floor(diff / month);
    var years = Math.floor(diff / year);
    var hours = Math.floor(diff / hour);
    var minutes = Math.floor(diff / minute);
    var seconds = Math.floor(diff / second);
    if (years > 0) {
      return years + " years ago";
    } else if (months > 0) {
      return months + " months ago";
    } else if (days > 0) {
      return days + " days ago";
    } else if (hours > 0) {
      return hours + " hours ago";
    } else if (minutes > 0) {
      return minutes + " minutes ago";
    } else if (seconds > 0) {
      return seconds + " seconds ago";
    } else {
      return "just now";
    }
  };

  return (
    <Grid item container className={classes.summaryStatus} direction="column">
      <Grid item style={{ paddingBottom: 5, paddingTop: 5 }}>
        <Typography
          variant="h5"
          style={{ color: theme.palette.type === "dark" ? "white" : "black", fontStyle: "italic" }}
        >
          Start chatting with this AI bot!
        </Typography>
      </Grid>
      <Grid item container direction="column">
        <Grid item>
          <Paper className={classes.cardOutline}>
            <List className={classes.list}>
              {chatList.map((chat, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemAvatar>
                    {chat.type === "Human" ? (
                      <Avatar className={classes.humanAvatar}>
                        {getInitials(user.firstname, user.lastname)}
                      </Avatar>
                    ) : (
                      <Avatar className={classes.aiAvatar} color="secondary">
                        AI
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Grid container justify="space-between">
                        <Grid item>{chat.name}</Grid>
                        <Grid item>
                          <Typography
                            component="span"
                            variant="body2"
                            style={{ marginLeft: 15 }}
                            color="textPrimary"
                          >
                            {timeAgo(chat.date)}
                          </Typography>
                        </Grid>
                      </Grid>
                    }
                    secondary={
                      <Typography component="span" variant="body2" color="textPrimary">
                        {chat.content}
                      </Typography>
                    }
                  />
                  {index === chatList.length - 1 && <div ref={scrollRef}></div>}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item style={{ paddingTop: 10 }}>
          <Paper className={classes.cardOutline}>
            <Grid item container direction="column" justify="center" alignItems="center">
              <Grid item container style={{ padding: 10, paddingTop: 5 }}>
                <TextField
                  variant="filled"
                  label="Question"
                  multiline
                  rows={5}
                  fullWidth
                  onChange={(e) => setContent(e.currentTarget.value)}
                  value={content}
                  disabled={sending}
                  color={theme.palette.type === "dark" ? "secondary" : "primary"}
                />
              </Grid>
              <Grid item container justify="flex-end" style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Button
                  variant="outlined"
                  color={theme.palette.type === "dark" ? "secondary" : "primary"}
                  onClick={handleSendQuestion}
                  disabled={content.length < 3 || sending}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    user: state.authReducer.user,
  };
}

export default connect(mapStateToProps, {})(Chatbot);
