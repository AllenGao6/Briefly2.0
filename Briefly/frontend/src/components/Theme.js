import { createMuiTheme } from "@material-ui/core/styles";

// install "color highlight" extension
const briefBlue = "#1e90ff";
const briefDarkBlue = "#3742fa";
const briefOrange = "#f39c12";
const briefYellow = "#f9ca24";
const briefRed = "#ff6348";
const briefGreen = "#2ed573";
const briefGrey = "#2f3542";
const briefSilver = "#bdc3c7";
const briefCloud = "#ecf0f1";
const briefPurple = "#8e44ad";

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
      silver: briefSilver,
      cloud: briefCloud,
      purple: briefPurple,
      icon: "white",
    },
    primary: {
      main: briefBlue,
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
      fontFamily: 'Roboto',
      fontWeight: 800,
      fontSize: "4rem",
      color: briefOrange,
      lineHeight: 1.5
    },
    h2: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: "3.5rem",
      color: briefGrey,
      lineHeight: 1.5
    },
    h3: {
      fontFamily: "Roboto",
      fontSize: "2rem",
      fontWeight: 400,
      color: briefGrey
    },
    h4: {
      fontFamily: "Roboto",
      fontSize: "1.2rem",
      fontWeight: 500,
      color: 'black',
    },
    h5: {
      fontFamily: "Roboto",
      fontSize: "1.2rem",
      color: "black",
      fontWeight: 400,
    },
    h6: {
      fontFamily: "Raleway",
      fontWeight: 300,
      lineHeight: 1,
      color: briefYellow,
    },
    subtitle1: {
      fontSize: "1.Roboto",
      fontWeight: 300,
      color: briefGrey,
    },
    subtitle2: {
      color: " white",
      fontSize: "1.25rem",
      fontWeight: 300,
    },
    body1: {
      fontFamily: "Roboto",
      fontSize: "1.3rem",
      fontWeight: 300,
      lineHeight: "2rem",
      color: briefGrey
    },
    body2: {
      fontFamily :"Roboto",
      fontSize: "1.8rem",
      fontWeight: 300,
      color: briefGrey
    },
    caption: {
      fontFamily: "Roboto",
      fontSize: "1.5rem",
      color: briefSilver,
    },
  },
  overrides: {
    // override styles of existing material-ui class
  },
});

export default theme;
