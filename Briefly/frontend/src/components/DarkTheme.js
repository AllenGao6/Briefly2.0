import { createMuiTheme } from "@material-ui/core/styles";

// install "color highlight" extension
const briefBlue = "#1e90ff";
const briefDarkBlue = "#3742fa";
const briefOrange = "#ffa502";
const briefYellow = "#f9ca24";
const briefRed = "#ff6348";
const briefGreen = "#2ed573";
const briefGrey = "#2f3542";
const briefWhite = "#f1f2f6";
const briefPurple = "#8e44ad";
const briefSilver = "#bdc3c7";
const briefCloud = "rgb(242, 242, 242)";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    // dominant color style placed here
    common: {
      blue: briefBlue,
      orange: briefOrange,
      yellow: briefYellow,
      red: briefRed,
      green: briefGreen,
      grey: briefGrey,
      darkWhite: briefWhite,
      icon: briefOrange,
      cloud: briefCloud,
    },
    primary: {
      main: briefGrey,
    },
    secondary: {
      main: briefOrange,
    },
  },
  typography: {
    grandCaption: {
      fontFamily: "Ubuntu",
      fontWeight: 600,
      fontSize: "5rem",
      color: briefOrange,
    },
    grandIntro: {
      fontFamily: "Roboto",
      fontWeight: 200,
      fontSize: "1.6rem",
      color: briefSilver,
    },
    secondaryCaption: {
      fontFamily: "Odibee Sans",
      fontSize: "2rem",
      color: briefPurple,
    },
    // define universial styles for headings and body font styles
    tab: {
      fontFamily: "Ubuntu",
      textTransform: "none",
      fontWeight: 500,
      fontSize: "1.25rem",
      "&:hover": {
        color: "white",
      },
    },
    roundedButton: {
      borderColor: briefOrange,
      color: "white",
      textTransform: "none",
      borderRadius: 50,
      fontFamily: "Roboto",
      height: "3rem",
      width: "7rem",
      fontSize: "1.25rem",
      "&:hover": {
        backgroundColor: briefOrange,
      },
    },
    h1: {
      fontFamily: "Roboto",
      fontWeight: 700,
      fontSize: "3.8rem",
      color: briefBlue,
      lineHeight: 1.5,
      letterSpacing: 1.2,
    },
    h2: {
      fontFamily: "Ubuntu",
      fontWeight: 500,
      fontSize: "3rem",
      color: briefOrange,
      lineHeight: 1.5,
    },
    h3: {
      fontFamily: "Roboto",
      fontSize: "2rem",
      fontWeight: 400,
      color: "white",
    },
    h4: {
      fontFamily: "Roboto",
      fontSize: "1.55rem",
      fontWeight: 400,
      color: "white",
    },
    h5: {
      fontFamily: "Roboto",
      fontSize: "1.2rem",
      color: "white",
      fontWeight: 400,
    },
    h6: {
      fontFamily: "Roboto",
      fontSize: "1rem",
      fontWeight: 300,
      lineHeight: 1,
      color: briefBlue,
    },
    subtitle1: {
      fontSize: "Roboto",
      fontWeight: 300,
      color: "white",
    },
    subtitle2: {
      color: "white",
      fontSize: "1.25rem",
      fontWeight: 300,
    },
    body1: {
      fontFamily: "Roboto",
      fontSize: "1rem",
      fontWeight: 300,
      lineHeight: "1.6rem",
      color: "white",
    },
    body2: {
      fontFamily: "Ubuntu",
      fontSize: "1rem",
      fontWeight: 300,
      color: "white",
    },
    caption: {
      fontSize: "1rem",
      color: "white",
    },
  },
  overrides: {
    // override styles of existing material-ui class
    MuiButton: {
      root: {
        minWidth: undefined,
      },
    },
  },
});

export default theme;
