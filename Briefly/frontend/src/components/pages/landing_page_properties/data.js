import React from "react";
//icon for 404 error
//two tone icons
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@material-ui/icons/FormatListNumberedRounded';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import BlurCircularTwoToneIcon from '@material-ui/icons/BlurCircularTwoTone';
import SubtitlesOutlinedIcon from '@material-ui/icons/SubtitlesOutlined';
import SubtitlesTwoToneIcon from '@material-ui/icons/SubtitlesTwoTone';
import LiveHelpOutlinedIcon from '@material-ui/icons/LiveHelpOutlined';
import LiveHelpTwoToneIcon from '@material-ui/icons/LiveHelpTwoTone';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';

//heads
import head1 from "../../../assets/heads/head1.jpg";
import head2 from "../../../assets/heads/head2.jpg";
import head3 from "../../../assets/heads/head3.jpg";
import head4 from "../../../assets/heads/head4.jpg";
import head5 from "../../../assets/heads/head5.jpg";

const dummyText =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. ";

export const teamInfo = [
  {
    name: "Allen",
    headImage: head1,
    position: "Team Lead",
    description: dummyText,
  },
  {
    name: "Brian",
    headImage: head2,
    position: "Frontend Director",
    description: dummyText,
  },
  {
    name: "Shawn",
    headImage: head3,
    position: "Frontend Dev",
    description: dummyText,
  }
];

export const ratingComment = [
  "Poor",
  "Not Good",
  "Average",
  "Good",
  "Excellent",
];

export const contactInfo = [
  {
    type: "Tel",
    info: "814-846-2770",
  },
  {
    type: "Email",
    info: "thevalley@homesteadcos.com",
  },
  {
    type: "Address",
    info: "870 Toftrees Ave. State College, PA 16803",
  },
  {
    type: "Office Hours",
    info: "M-F 9am-7pm",
  },
];

const smallSize=70
const largeSize=80

export const icons2 = [
  [<FormatListBulletedRoundedIcon style={{fontSize:smallSize}}/>, <FormatListNumberedRoundedIcon style={{fontSize:largeSize}}/>],
  [<SubtitlesOutlinedIcon style={{fontSize:smallSize}}/>, <SubtitlesTwoToneIcon style={{fontSize:largeSize}}/>],
  [<LiveHelpOutlinedIcon style={{fontSize:smallSize}}/>, <LiveHelpTwoToneIcon style={{fontSize:largeSize}}/>],
  [<BlurOnRoundedIcon style={{fontSize:smallSize}}/>, <BlurCircularTwoToneIcon style={{fontSize:largeSize}}/>],
  [<TimelineRoundedIcon style={{fontSize:smallSize}}/>, <TimelineRoundedIcon style={{fontSize:largeSize}}/>],
  [<MenuBookOutlinedIcon style={{fontSize:smallSize}}/>, <MenuBookTwoToneIcon style={{fontSize:largeSize}}/>],
]

export const captions2 = [
  <p>Video Summarization</p>,
  <p>Translation</p>,
  <p>Pop Quiz Generation</p>,
  <p>Mind Map Generation</p>,
  <p>Ebbinghaus Forgetting Curve</p>,
  <p>Final Review Sheet</p>,
]

const hoveringStyles = {
  color:"#2980b9",
  cursor:"pointer",
  align:"center"
}

export const descriptions2 = [
  <p>
    Many important videos are too long for us to stay focused throughout?
    <br></br><br></br>
    We provide a video summarization tools that extract crucial information for preview and review.
  </p>,
  <p>
    Understand faster in your native language?
    <br></br><br></br>
    We offer a powerful translation engine that covers 71 languages for the video summary, user uploaded notes, and generated mind map.
  </p>,
  <p>
    Prefer active thinking? 
    <br></br><br></br>
    Briefly can generate quizzes from videos or uploaded notes that suits your needs.
    <p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Want to visualize information?
    <br></br><br></br>
    Mind Map is a useful tool to do this job. If you have taken notes from lecture, you can upload it, and we will generate Mind Map for you to download.
    <p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Not good at memorization?
    <br></br><br></br>
    We use Ebbinghaus forgetting curve theory to generate your personal reviewing plan in the calendar, allowing you to memorize info with minimum effort.
    <p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Worrying about your final exam?
    <br></br><br></br>
    Select the files or videos that you have uploaded past, we can generate final review sheet to aid your success.
    <p style={hoveringStyles}> Learn more :) </p>
  </p>,
]
