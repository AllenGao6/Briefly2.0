import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect, useRef } from "react";
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
  FormControlLabel,
  TextField,
  Switch,
  LinearProgress,
} from "@material-ui/core";
import DashboardBar from "../common/DashboardBar";
import Navigator from "../common/Navigator";
import DashboardContent from "../common/DashboardContent";
import { connect } from "react-redux";
import {
  loadCollections,
  createCollection,
} from "../../redux/actions/collection_actions";
import defaultImage from "../../assets/dummy/book.png";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";

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
  uploadButton: {
    width: "35rem",
    transition: "all 0.3s",
    "&:hover": {
      background:
        theme.palette.type === "dark"
          ? theme.palette.common.orange
          : theme.palette.common.blue,
    },
  },
  fileInput: {
    "&::-ms-browse": {
      background: "black",
      color: "red",
      padding: "1em",
    },
  },
  textField: {
    width: "35rem",
    "& .MuiFormLabel-root": {
      fontSize: "1rem",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: theme.palette.type === "dark" ? "white" : undefined,
    },
    "& .MuiFilledInput-root": {
      backgroundColor:
        theme.palette.type === "dark" ? undefined : "rgba(30, 144, 255, 0.2)",
    },
  },
  createButton: {
    color: "white",
    opacity: 1,
    background: theme.palette.common.blue,
    transition: "all 0.3s",
    "&:hover": {
      opacity: 0.8,
      background: theme.palette.common.blue,
    },
  },
  cancelButton: {
    color: theme.palette.common.red,
    borderColor: theme.palette.common.red,
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const fileInpuRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [is_archived, setIsArchived] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [imageFile, setImageFile] = useState(null);
  const [isNewCollection, setIsNewCollection] = useState(true);

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
      setName(collection.name);
      setDescription(collection.description);
      setIsArchived(collection.isArchived);
      setImageUrl(collection.image ? collection.image : defaultImage);
      setIsNewCollection(false);
    }

    setOpenDialog(true);
  };

  const handleCreateCollection = async () => {
    const formData = new FormData();
    if (imageFile !== null) {
      formData.append("image", imageFile, imageFile.name);
    }
    formData.append("name", name);
    formData.append("description", description);
    formData.append("is_archived", is_archived);
    formData.append("owner", props.user.pk);
    await props.createCollection(formData);

    handleDialogCLose();
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
        <DialogTitle>
          <Typography variant="h4" align="left">
            {isNewCollection
              ? "Create a New Collection"
              : "Update Collection Information"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item>
              <TextField
                label="Name"
                variant="filled"
                value={name}
                fullWidth
                className={classes.textField}
                onChange={(e) => setName(e.currentTarget.value)}
                disabled={props.isCreating}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Description"
                variant="filled"
                value={description}
                fullWidth
                className={classes.textField}
                onChange={(e) => setDescription(e.currentTarget.value)}
                multiline
                disabled={props.isCreating}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={is_archived}
                    disabled={props.isCreating}
                    color={
                      theme.palette.type === "dark" ? "secondary" : "primary"
                    }
                    onChange={() => setIsArchived(!is_archived)}
                  />
                }
                label="Archive Collection"
                labelPlacement="start"
              />
            </Grid>
            <Grid item>
              <img
                src={imageUrl}
                alt="cover image"
                style={{
                  width: "35rem",
                  objectFit: "cover",
                  height: "15rem",
                  borderRadius: 10,
                }}
              />
            </Grid>
            <Grid item>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInpuRef}
                accept="image/*"
                onChange={(e) => {
                  setImageUrl(URL.createObjectURL(e.target.files[0]));
                  setImageFile(e.target.files[0]);
                }}
              />
              <Button
                type="file"
                variant="outlined"
                onClick={() => fileInpuRef.current.click()}
                className={classes.uploadButton}
                disabled={props.isCreating}
              >
                <PublishRoundedIcon style={{ fontSize: "2rem" }} />
              </Button>
            </Grid>
            <Grid
              item
              container
              justify="center"
              spacing={4}
              style={{ width: "35rem" }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  className={classes.createButton}
                  onClick={() => handleCreateCollection()}
                  disabled={props.isCreating}
                >
                  Create
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  className={classes.cancelButton}
                  onClick={handleDialogCLose}
                  disabled={props.isCreating}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <LinearProgress
                color={theme.palette.type === "dark" ? "secondary" : "primary"}
                style={{
                  width: "35rem",
                  color: "black",
                  display: props.isCreating ? undefined : "none",
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    collections: state.collectionReducer.collections,
    isCreating: state.collectionReducer.isCreating,
    user: state.authReducer.user,
  };
}

const mapDispatchToProps = {
  loadCollections,
  createCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
