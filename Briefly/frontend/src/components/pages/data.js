import React from "react"
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

const dummyText = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."

export const border = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

export const icons = [
    [
      <ListRoundedIcon style={{ fontSize: 100 }} />,
      <OndemandVideoRoundedIcon style={{ fontSize: 100 }} />,
      <TimelineRoundedIcon style={{ fontSize: 100 }} />
    ],
    [
      <CodeRoundedIcon style={{ fontSize: 100 }} />,
      <SettingsRoundedIcon style={{ fontSize: 100 }} />,
      <AssessmentRoundedIcon style={{ fontSize: 100 }} />
    ],
    [
      <HelpOutlineRoundedIcon style={{ fontSize: 100 }} />,
      <CardMembershipRoundedIcon style={{ fontSize: 100 }} />,
      <ForumRoundedIcon style={{ fontSize: 100 }} />
    ]
  ];
  
export const captions = [
    [
      <h2>160 Hand-Picked Questions</h2>,
      <h2>100+ Hour Videos of Explanations</h2>,
      <h2>Data Structure Crash Course</h2>
    ],
    [
      <h2>Solution in 9 Languages</h2>,
      <h2>Code-Execution Environment</h2>,
      <h2>Space-Time Complexity Analysis</h2>
    ],
    [
      <h2>4 Curated Assessments</h2>,
      <h2>Certificate Of Completion</h2>,
      <h2>Mock Coding Interviews</h2>
    ]
  ];
  
  
export const descriptions = [
    [
      <p>
        Coding interview prep is a numbers game that many candidates lose. We've
        hand-picked 160 of the best coding interview questions to truly prepare
        you. Learn more.
      </p>,
      <p>
        Algorithms are tough to learn on paper. Each and every one of our
        questions is accompanied by a two-part video explanation to maximize
        learning. That's over 100 hours of content, all at your fingertips. Learn
        more.
      </p>,
      <p>
        Data structures are the pillars of coding interviews. Our video series
        gives you the foundational knowledge you need to be well-versed in all of
        the popular data structures. Learn more.
      </p>
    ],
    [
      <p>
        Not everyone speaks the same programming language. We give you solutions
        to every single question in 9 different languages: JavaScript, TypeScript,
        Python, Swift, Kotlin, C++, Java, C#, and Go. Learn more.
      </p>,
      <p>
        Coding out solutions to algorithm problems is the best way to practice.
        Our code-execution environment lets you type out your answers and run them
        against our test cases right here on the website. Learn more.
      </p>,
      <p>
        Understanding how much memory an algorithm uses and how fast it runs is
        exceedingly important. All of our explanations include a rigorous
        space-time complexity analysis. Learn more.
      </p>
    ],
    [
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
  ];

  export const teamInfo = [
    {
      name : 'Allen',
      headImage : head1,
      brief : '',
      description : dummyText
    },
    {
      name : 'Brian',
      headImage : head2,
      brief : '',
      description : dummyText    
    },
    {
      name : 'Shawn',
      headImage : head3,
      brief : '',
      description : dummyText    
    },
    {
      name : 'Hugo',
      headImage : head4,
      brief : '',
      description : dummyText    
    },
    {
      name : 'Stanford',
      headImage : head5,
      brief : '',
      description : dummyText    
    },
  ]

  export const ratingComment = [
    "Poor",
    "Not Good",
    "Average",
    "Good",
    "Excellent"
  ]