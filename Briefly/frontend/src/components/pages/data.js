import React from "react";
// icons for card area
import ListRoundedIcon from "@material-ui/icons/ListRounded";
import OndemandVideoRoundedIcon from "@material-ui/icons/OndemandVideoRounded";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import AssessmentRoundedIcon from "@material-ui/icons/AssessmentRounded";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import CardMembershipRoundedIcon from "@material-ui/icons/CardMembershipRounded";
import ForumRoundedIcon from "@material-ui/icons/ForumRounded";
//icon for 404 error

//heads
import head1 from "../../assets/heads/head1.jpg";
import head2 from "../../assets/heads/head2.jpg";
import head3 from "../../assets/heads/head3.jpg";
import head4 from "../../assets/heads/head4.jpg";
import head5 from "../../assets/heads/head5.jpg";
import { Typography } from "@material-ui/core";

const dummyText =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

export const teamInfo = [
  {
    name: "Allen",
    headImage: head1,
    quote: "",
    description: dummyText,
  },
  {
    name: "Brian",
    headImage: head2,
    quote: "",
    description: dummyText,
  },
  {
    name: "Shawn",
    headImage: head3,
    quote: "",
    description: dummyText,
  },
  {
    name: "Hugo",
    headImage: head4,
    quote: "",
    description: dummyText,
  },
  {
    name: "Stanford",
    headImage: head5,
    quote: "",
    description: dummyText,
  },
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

export const icons2 = [
  <ListRoundedIcon style={{ fontSize: 70 }} />,
  <OndemandVideoRoundedIcon style={{ fontSize: 70 }} />,
  <TimelineRoundedIcon style={{ fontSize: 70 }} />,
  <CodeRoundedIcon style={{ fontSize: 70 }} />,
  <SettingsRoundedIcon style={{ fontSize: 70 }} />,
  <AssessmentRoundedIcon style={{ fontSize: 70 }} />,
  <HelpOutlineRoundedIcon style={{ fontSize: 70 }} />,
  <CardMembershipRoundedIcon style={{ fontSize: 70 }} />,
  <ForumRoundedIcon style={{ fontSize: 70 }} />
]

export const captions2 = [
  <p>160 Hand-Picked Questions</p>,
  <p>100+ Hour Video Explanations</p>,
  <p>Data Structure Crash Course</p>,
  <p>Solution in 9 Languages</p>,
  <p>Code-Execution Environment</p>,
  <p>Space-Time Complexity Analysis</p>,
  <p>4 Curated Assessments</p>,
  <p>Certificate Of Completion</p>,
  <p>Mock Coding Interviews</p>
]

const hoveringStyles = {
  color:"#2980b9",
  cursor:"pointer",
  align:"center"
}

export const descriptions2 = [
  <p>
    Coding interview prep is a numbers game that many candidates lose. We've
    hand-picked 160 of the best coding interview questions to truly prepare
    you. 
  </p>,
  <p>
    Algorithms are tough to learn on paper. Each and every one of our
    questions is accompanied by a video explanation in two parts to maximize
    learning. That's over 100 hours of content, all at your fingertips.<p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Data structures are the pillars of coding interviews. Our video series
    gives you the foundational knowledge you need to be well-versed in popular data structures.<p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Not everyone speaks the same programming language. We give you solutions
    to every single question in 9 different languages: JavaScript, TypeScript,
    Python, Swift, Kotlin, C++, Java, C#, and Go.<p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Coding out solutions to algorithm problems is the best way to practice.
    Our code-execution environment lets you type out your answers and run them
    against our test cases right here on the website.<p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Understanding how much memory an algorithm uses and how fast it runs is
    exceedingly important. All of our explanations include a rigorous
    space-time complexity analysis.<p style={hoveringStyles}> Learn more :) </p>
  </p>,
  <p>
    Real coding interviews are timed and have multiple questions. We've
    carefully curated 4 assessments to reflect what a real day of coding
    interviews might look like, filled with variety and appropriate
    difficulty.
  </p>,
  <p>
    Completing 100 questions on AlgoExpert is no easy feat. It takes time and
    effort, and it demonstrates a keen understanding of data structures and
    algorithms. Completing 100 AlgoExpert questions earns you a certificate of
    your coding-interview preparedness.
  </p>,
  <p>
    There's no better way to practice than by going through an actual coding
    interview with a real human being. We let you pair up with other people
    and do mock coding interviews on a shared workspace, right here on
    AlgoExpert.
  </p>
]
