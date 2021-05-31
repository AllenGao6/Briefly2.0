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

const theme = createMuiTheme({
  palette: {
    // dominant color style placed here
    common: {
      blue: briefBlue,
      orange: briefOrange,
      yellow: briefYellow,
      red: briefRed,
      green: briefGreen,
      grey: briefGrey,
      darkWhite: briefWhite,
    },
    primary: {
      main: briefGrey,
    },
    secondary: {
      main: briefOrange,
    },
  },
  typography: {
    // define universial styles for headings and body font styles
    tab: {
      fontFamily: "Raleway",
      textTransform: "none",
      fontWeight: 700,
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
      fontFamily: "Raleway",
      fontWeight: 800,
      fontSize: "3rem",
      color: briefBlue,
      lineHeight: 1.5,
    },
    h2: {
      fontFamily: "Raleway",
      fontWeight: 700,
      fontSize: "2rem",
      color: briefBlue,
      lineHeight: 1.5,
    },
    h3: {
      fontFamily: "Pacifico",
      fontSize: "2.5rem",
      color: briefBlue,
    },
    h4: {
      fontFamily: "Raleway",
      fontSize: "1.75rem",
      color: briefBlue,
      fontWeight: 700,
    },
    h5: {
      fontFamily: "Raleway",
      fontSize: "1.15rem",
      color: "black",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "Raleway",
      color: briefBlue,
      fontWeight: 500,
      lineHeight: 1,
    },
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 300,
      color: briefGrey,
    },
    subtitle2: {
      color: " white",
      fontSize: "1.25rem",
      fontWeight: 300,
    },
    body1: {
      fontSize: "1.24rem",
      color: briefGrey,
      fontWeight: 300,
    },
    caption: {
      fontSize: "1em",
      fontWeight: 300,
      color: briefGrey,
    },
  },
  overrides: {
    // override styles of existing material-ui class
  },
});

export default theme;
