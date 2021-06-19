import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
  Grid,
  Typography,
  Button,
  Input,
} from "@material-ui/core";
import DashboardBar from "../common/DashboardBar";
import Navigator from "../common/Navigator";
import DashboardContent from "../common/DashboardContent";
import { connect } from "react-redux";
import { loadCollections } from "../../redux/actions/collection_actions";
import defaultImage from "../../assets/dummy/book.png";

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
  const [newCollection, setNewCollection] = useState(null);

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
    // initialize state variables
    if (collection !== null) {
      setNewCollection({
        ...collection,
        image: collection.image ? collection.image : defaultImage,
      });
    } else {
      setNewCollection({
        name: "",
        description: "",
        isArchived: false,
        image: defaultImage,
      });
    }

    setOpenDialog(true);
  };

  return (
    <React.Fragment>
      <Navigator
        open={mobileOpen}
        onClose={handleDrawerToggle}
        collectionDialog={collectionDialog}
      />
      <DashboardBar
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        {...props}
      />
      <DashboardContent open={mobileOpen} collectionDialog={collectionDialog} />
      <Dialog open={openDialog} onClose={handleDialogCLose} fullWidth>
        <DialogContent>
          <Grid item>
            <Typography variant="h3" align="left">
              {newCollection && newCollection.name === ""
                ? "Create a New Collection"
                : "Update Collection Information"}
            </Typography>
          </Grid>
          <Grid container direction="column" alignItems="center">
            <Button variant="contained">
              <Input type="file" />
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
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
