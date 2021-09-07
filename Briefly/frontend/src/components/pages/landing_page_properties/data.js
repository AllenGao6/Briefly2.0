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
import head1 from "../../../assets/heads/Allen.png";
import head2 from "../../../assets/heads/Brian.png";
import head3 from "../../../assets/heads/Shawn.png";
import head4 from "../../../assets/heads/Hugh.png";
import head5 from "../../../assets/heads/Stanford.png";
import head6 from "../../../assets/heads/Perry.png";

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
    description: `His name is Brian. His a motivated and enthusiastic junior at the University of Illinois Urbana-Champaign majored in Computer Science and Math. He has experienced in doing frontend and machine learning; specifically, he worked with Python, JavaScript, Java, React.js, Redux, Material-UI, Android, PyTorch, and Tensorflow across multiple projects.
    
      His academic goal is to become experienced in every aspect of computer science with a heavy focus on software engineering and artificial intelligence. His career goal is to build AI-powered web platforms to make social changes.`,
  },
  {
    name: "Shawn",
    headImage: head3,
    position: "Frontend Dev",
    description: "Shawn had experience with web-related languages, and he has a strong inclination towards frontend application development. His skillset includes Java, Python, and Kotlin. Shawn also has skills in HTML5, CSS3 and JavaScript, helping team formatting the documentation and held responsible for the construction of web page.",
  },
  {
    name: "Hugo",
    headImage: head4,
    position: "Backend Lead & DevOps Engineer",
    description: "Lucheng is a junior student majoring in Computer Science with experience in backend development with Django REST Framework.  He is highly enthusiastic about creating a robust, safe, and high-efficiency Briefly backend and making Briefly as a helpful tool for students on their learning path. Also, he is responsible for Briefly site deployment and daily maintenance. In a nutshell, Lucheng aims to become a full-stack developer, wishing to utilize what he learned to make this world better. ❤",
  },
  {
    name: "Stanford",
    headImage: head5,
    position: "Marketing",
    description: "Self-learned Harvard MBA books, Doing computer vision research as an undergrad with a PSU professor, Love Basketball and swimming",
  },
  {
    name: "Perry",
    headImage: head6,
    position: "Frontend Dev",
    description: "As a meticulous person, Perry is demonstrating his skills on the frontend of briefly. Using react and javascript, he is making briefly's frontend more concise and clean. He also has fruitful coding experience using Java, Python, C language, and MATLAB. Aside from his dedication in programming, you can also find him enjoying playing saxophone, basketball, or exercising in the gym.",
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
    info: "949-228-6289",
  },
  {
    type: "Email",
    info: "allengaosh@icloud.com",
  },
  {
    type: "Address",
    info: "1164 Elena Privada, Mountain View, 94040, CA",
  },
  {
    type: "Availability",
    info: "M-F 9am-5pm",
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
  <p>Question Answering</p>,
  <p>Speech Recognition</p>,
  <p>Exam Preparation</p>,
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
    We provide a smart note tools that extract crucial information for preview and review.
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
  </p>,
  <p>
    Have question regaring your uploaded content?
    <br></br><br></br>
    We created a intelligent assistant bot powered by GPT3, that could answer any of your questions based on your uploaded cnotent. (Beta)
  </p>,
  <p>
    Want to locate passage in video faster?
    <br></br><br></br>
    We apply speech recognition on all uploaded media file, and we built an smart search tool to help you locate your desired text with ease.
  </p>,
  <p>
    Studying for your exams?
    <br></br><br></br>
    We organize all your uploaded files and store them for your exam reviews. You can retrieve all your desired content at a snatch. 
  </p>,
]
