// import "./styles.css";
// import { Grid, Typography } from "@material-ui/core";
// import { useSpring, animated } from "react-spring";

// const LoopFunction = (props) => {
//   const styles = useSpring({
//     loop: { reverse: true },
//     from: { x: props.xFrom },
//     to: { x: props.xTo },
//     config: { duration: 2000 }
//   });

//   return (
//     <animated.div
//       style={{
//         width: 60,
//         height: 60,
//         backgroundColor: "#00cec9",
//         borderRadius: 16,
//         ...styles
//       }}
//     />
//   );
// };

// export default function NotFound() {
//   const width = window.screen.width;
//   return (
//     <Grid
//       style={{ height: "100vh", width: "100%", backgroundColor: "#81ecec" }}
//     >
//       <Grid style={{ height: "10px" }}></Grid>
//       <LoopFunction xFrom={width/2 - 400} xTo={width/2 + 400} />
//       <Typography
//         style={{
//           fontSize: "40px",
//           fontFamily: "Ununtu"
//         }}
//         align="center"
//       >
//         The page is missing...
//       </Typography>
//       <Typography align="center">-Error Code: 404-</Typography>
//     </Grid>
//   );
// }

