import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DashboardBar from "../common/DashboardBar";
import Navigator from "../common/Navigator";
import DashboardContent from "../common/DashboardContent";
import { connect } from "react-redux";
import { loadCollections } from "../../redux/actions/collection_actions";

// User View
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    ...theme.typography.roundedButton,
    background: theme.palette.secondary.main,
    width: "13rem",
    margin: "2rem",
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    props.loadCollections();
  }, []);

  const handleDialogCLose = () => {
    setOpenDialog(false);
  };

  const collectionDialog = (collection) => {
    if (collection === undefined) {
      collection = { name: "", description: "" };
    }
    return (
      <Dialog open={openDialog} onCLose={handleDialogCLose} fullWidth>
        <DialogTitle>
          {collection === undefined
            ? "Create a New Collection"
            : "Update Collection Information"}
        </DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    );
  };

  return (
    <React.Fragment>
      <Navigator open={mobileOpen} onClose={handleDrawerToggle} />
      <DashboardBar
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        {...props}
      />
      <DashboardContent open={mobileOpen} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    collections: state.collectionReducer.collections,
    isLoading: state.collectionReducer.isLoading,
  };
}

const mapDispatchToProps = {
  loadCollections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
