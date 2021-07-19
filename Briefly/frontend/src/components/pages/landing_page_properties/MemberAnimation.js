import "./styles.css";
import { useSpring, animated } from "react-spring";
import { Grid } from "@material-ui/core";
import { React } from "react";

const size = 200;

function App() {
  const style1 = useSpring({
    loop: { reverse: true },
    from: { x: 100, opacity: 1 },
    to: { x: 0, opacity: 0 },
    config: { duration: 1000 }
  });

  const style2 = useSpring({
    loop: { reverse: true },
    config: { duration: 1000 },
    from: { x: 200, opacity: 1 },
    to: { x: -50, opacity: 1 }
  });

  const style3 = useSpring({
    loop: { reverse: true },
    config: { duration: 1000 },
    from: { x: 300, opacity: 1 },
    to: { x: 50, opacity: 1 }
  });

  const style4 = useSpring({
    loop: { reverse: true },
    config: { duration: 1000 },
    from: { x: 250, opacity: 0 },
    to: { x: 150, opacity: 1 }
  });

  return (
    <>
      <Grid container>
        <animated.div
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#2c3e50",
            borderRadius: 16,
            marginLeft: -25,
            marginRight: -25,
            ...style1
          }}
        >
          <Grid
            style={{margin:50}}
          >
            hello world
          </Grid>
        </animated.div>

        <animated.div
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#2c3e50",
            borderRadius: 16,
            marginLeft: -25,
            marginRight: -25,
            ...style2
          }}
        />

        <animated.div
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#2c3e50",
            borderRadius: 16,
            marginLeft: -25,
            marginRight: -25,
            ...style3
          }}
        />

        <animated.div
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#2c3e50",
            borderRadius: 16,
            marginLeft: -25,
            marginRight: -25,
            ...style4
          }}
        />
      </Grid>
    </>
  );
}
export default App;