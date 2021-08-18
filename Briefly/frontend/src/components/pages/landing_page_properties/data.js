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
    description: "The team lead of Briefly, hold experience in all algorithm, frontend UI design, and backend development. A rising junior in Penn State University studying computer science and Math. Love reading, programming, and exercising.",
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
  },
  {
    name: "Hugo",
    headImage: head4,
    position: "Frontend Dev",
    description: dummyText,
  },
  {
    name: "Stanford",
    headImage: head5,
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
  <p>Note Export</p>,
  <p>Pop Quiz Generation</p>,
  <p>Mind Map Generation</p>,
  <p>Speech Recognition</p>,
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
    Want to have your own note?
    <br></br><br></br>
    We provide user an option to export the note they created with Briefly for their own benefit.
  </p>,
  <p>
    Prefer active thinking? 
    <br></br><br></br>
    Briefly can generate quizzes from videos or uploaded texts that suits your needs.
    {/* <p style={hoveringStyles}> Learn more :) </p> */}
  </p>,
  <p>
    Want to visualize information?
    <br></br><br></br>
    Mind Map is a useful tool to do this job. We will build a Name Entity Recognition Model to extract key concepts in each uploaded media, which will show the latent knowledge structure of all files.
  </p>,
  <p>
    Want to locate passage in video faster?
    <br></br><br></br>
    We apply speech recognition on all uploaded media file, and we built an smart search tool to help you locate your desired text with ease.
  </p>,
  <p>
    Studying about your final exam?
    <br></br><br></br>
    We organize all your uploaded files and store them for your exam reviews. You can retrieve all your desired content at a snatch. 
    <p style={hoveringStyles}> Learn more :) </p>
  </p>,
]
