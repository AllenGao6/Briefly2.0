import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect, useCallback } from "react";

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
import { darken, lighten } from "@material-ui/core/styles";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import { connect } from "react-redux";
import {
  loadVideosInCollection,
  createVideoInCollection,
  updateVideoInCollection,
  deleteVideos,
} from "../../redux/actions/video_actions";
import {
  loadAudiosInCollection,
  createAudioInCollection,
  updateAudioInCollection,
  deleteAudios,
} from "../../redux/actions/audio_actions";
import ControlledVideoPlayer from "./ControlledVideoPlayer";
import { set } from "js-cookie";

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = () =>
    theme.palette.type === "dark"
      ? lighten(theme.palette.primary.main, 0.2)
      : theme.palette.common.cloud;

  const getHoverBackgroundColor = () =>
    theme.palette.type === "dark"
      ? lighten(theme.palette.primary.main, 0.4)
      : darken(theme.palette.common.cloud, 0.1);

  return {
    dataGrid: {
      borderRadius: 3,
      border: 0,
      height: 48,
      transition: "background-color 0.3s",

      boxShadow: "0px 5px 7px 5px rgba(165,165,165,0.5)",

      "& .MuiDataGrid-row:nth-child(even)": {
        backgroundColor: getBackgroundColor(),
        "&:hover": {
          backgroundColor: getHoverBackgroundColor(),
        },
      },
    },
    title: {
      transition: "color 0.3s",
      "&:hover": {
        color: theme.palette.common.blue,
        cursor: "pointer",
      },
    },
    toolbar: {
      color:
        theme.palette.type === "dark"
          ? theme.palette.common.orange
          : theme.palette.common.blue,
    },
    button: {
      ...theme.typography.roundedButton,
      background: theme.palette.secondary.main,
      width: "13rem",
      margin: "2rem",
    },
    textField: {
      "& .MuiFormLabel-root": {
        fontSize: "1rem",
      },
      "& .MuiFormLabel-root.Mui-focused": {
        color: theme.palette.type === "dark" ? "white" : undefined,
      },
      "& .MuiFilledInput-root": {
        backgroundColor:
          theme.palette.type === "dark"
            ? undefined
            : "rgba(30, 144, 255, 0.08)",
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
    updateMedia: {
      color: theme.palette.common.blue,
      borderColor: theme.palette.common.blue,
      width: "5rem",
      marginRight: "1rem",
    },
    deleteMedia: {
      color: theme.palette.common.red,
      borderColor: theme.palette.common.red,
      width: "5rem",
    },
  };
});

function CollectionTable({
  history,
  videos,
  audios,
  text,
  isLoading,
  isCreating,
  loadVideosInCollection,
  createVideoInCollection,
  updateVideoInCollection,
  deleteVideos,
  loadAudiosInCollection,
  createAudioInCollection,
  updateAudioInCollection,
  deleteAudios,
  mediaType,
  match,
  selectArchived,
  search,
}) {
  const theme = useTheme();
  const classes = useStyles();

  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [archived, setArchived] = useState(false);
  const [action, setAction] = useState(null);
  const [playing, setPlaying] = useState(false);

  const matches = useMediaQuery("(max-width:1086px)");
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const inputWidth = matchesXS ? "20rem" : "35rem";

  const loadMediaInCollection = (id) => {
    switch (mediaType) {
      case "video":
        loadVideosInCollection(id);
        break;
      case "audio":
        loadAudiosInCollection(id);
        break;
      case "text":
      default:
        break;
    }
  };

  const createMediaInCollection = (id, media) => {
    switch (mediaType) {
      case "video":
        createVideoInCollection(id, media);
        break;
      case "audio":
        createAudioInCollection(id, media);
        break;
      case "text":
      default:
        break;
    }
  };

  const updateMediaInCollection = (id, media, mediaId) => {
    switch (mediaType) {
      case "video":
        updateVideoInCollection(id, media, mediaId);
        break;
      case "audio":
        updateAudioInCollection(id, media, mediaId);
        break;
      case "text":
      default:
        break;
    }
  };

  const deleteMediaInCollection = (id, list_id) => {
    switch (mediaType) {
      case "video":
        deleteVideos(id, list_id);
        break;
      case "audio":
        deleteAudios(id, list_id);
        break;
      case "text":
      default:
        break;
    }
  };

  const getMediaInCollection = () => {
    switch (mediaType) {
      case "video":
        return videos;
      case "audio":
        return audios;
      case "text":
      default:
        break;
    }
  };

  const filterMediaByArchive = () => {
    const media = getMediaInCollection();
    if (selectArchived) return media.filter((item) => item.is_archived);
    return media;
  };

  const filterMediaBySearch = () => {
    const media = filterMediaByArchive();
    return media.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
    loadMediaInCollection(match.params.id);
  }, []);

  const fixedColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 230,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body1"
          className={classes.title}
          onClick={() => handleTitleClick(params.id)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "is_archived",
      headerName: "Archived",
      width: 125,
      align: "center",
      headerAlign: "center",
      type: "boolean",
    },
    {
      field: "type",
      headerName: "Type",
      align: "center",
      headerAlign: "center",
      width: 120,
      renderCell: () => <Typography variant="body1">{mediaType}</Typography>,
    },
    {
      field: "created",
      headerName: "Created At",
      align: "center",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body1">{params.value}</Typography>
      ),
    },
    {
      field: "fileSize",
      headerName: "File Size",
      align: "center",
      headerAlign: "center",
      width: 120,
      type: "number",
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toLocaleString();
        return `${valueFormatted} MB`;
      },
    },
    {
      field: "is_summarized",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body1">Completed</Typography>
        ) : (
          <Typography variant="body1">Processing</Typography>
        ),
    },
  ];

  const flexColumns = [
    {
      field: "title",
      headerName: "Title",
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body1"
          className={classes.title}
          onClick={() => handleTitleClick(params.id)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "is_archived",
      headerName: "Archived",
      width: 150,
      align: "center",
      headerAlign: "center",
      type: "boolean",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: () => <Typography variant="body1">{mediaType}</Typography>,
    },
    {
      field: "created",
      headerName: "Created At",
      align: "center",
      headerAlign: "center",
      flex: 1.7,
      renderCell: (params) => (
        <Typography variant="body1">{params.value}</Typography>
      ),
    },
    {
      field: "fileSize",
      headerName: "File Size",
      align: "center",
      headerAlign: "center",
      flex: 1,
      type: "number",
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toLocaleString();
        return `${valueFormatted} MB`;
      },
    },
    {
      field: "is_summarized",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body1">Completed</Typography>
        ) : (
          <Typography variant="body1">Processing</Typography>
        ),
    },
  ];

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const handleTitleClick = (id) => {
    history.push("/dashboard");
  };

  const handleUpdate = () => {
    if (action == "Update") {
      const media = {
        title: title,
        is_archived: archived,
      };
      updateMediaInCollection(match.params.id, media, selectionModel[0]);
      setSelectionModel([]);
    } else {
      // create media
      const media = {
        title: title,
        is_archived: archived,
        collection: match.params.id,
      };
      createMediaInCollection(match.params.id, media);
    }
  };

  const handleDelete = () => {
    deleteMediaInCollection(match.params.id, selectionModel);
    setSelectionModel([]);
  };

  const handleOpenDialog = (action) => {
    setAction(action);
    if (action == "Update") {
      const media = getMediaInCollection().filter(
        (item) => item.id === selectionModel[0]
      )[0];
      setTitle(media.title);
      setArchived(media.is_archived);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTitle("");
    setArchived(false);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Grid
          container
          direction={matchesXS ? "column" : "row"}
          justify={matchesXS ? "center" : "space-between"}
          style={{ padding: 10 }}
          alignItems="center"
        >
          <Grid item>
            <GridToolbarColumnsButton className={classes.toolbar} />
            <GridToolbarFilterButton className={classes.toolbar} />
          </Grid>
          <Grid
            item
            container
            style={{ width: "20rem" }}
            direction="row"
            justify={matchesXS ? "center" : "flex-end"}
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="contained"
                style={{
                  color: "white",
                  background: theme.palette.common.blue,
                  width: "5rem",
                  marginRight: "1rem",
                }}
                onClick={() => handleOpenDialog("Create")}
              >
                Create
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                className={classes.updateMedia}
                onClick={() => handleOpenDialog("Update")}
                disabled={selectionModel.length !== 1}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                disabled={selectionModel.length === 0}
                className={classes.deleteMedia}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </GridToolbarContainer>
    );
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid
        item
        container
        style={{
          maxWidth: 1400,
          width: "100%",
          paddingLeft: matchesXS ? undefined : "2rem",
          paddingRight: matchesXS ? undefined : "2rem",
        }}
      >
        <DataGrid
          className={classes.dataGrid}
          disableColumnMenu
          autoHeight
          checkboxSelection
          columns={matches ? fixedColumns : flexColumns}
          rows={filterMediaBySearch()}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          rowHeight={90}
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection.selectionModel);
          }}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        fullScreen={matchesXS}
        style={{ zIndex: 1303 }}
      >
        <DialogTitle>
          <Typography variant="h4" align={matchesXS ? "center" : "left"}>
            {action}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item>
              <TextField
                label="Title"
                variant="filled"
                value={title}
                fullWidth
                className={classes.textField}
                onChange={(e) => setTitle(e.currentTarget.value)}
                style={{ width: inputWidth }}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={archived}
                    color={
                      theme.palette.type === "dark" ? "secondary" : "primary"
                    }
                    onChange={() => setArchived(!archived)}
                  />
                }
                label="Archived"
                labelPlacement="start"
              />
            </Grid>
            <ControlledVideoPlayer
              playing={playing}
              onPlayPause={() => setPlaying(!playing)}
            />
            <Grid
              item
              container
              justify="center"
              spacing={4}
              style={{ width: inputWidth }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  className={classes.createButton}
                  onClick={() => {
                    handleUpdate();
                    handleDialogClose();
                  }}
                >
                  {action}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  className={classes.cancelButton}
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <LinearProgress
                color={theme.palette.type === "dark" ? "secondary" : "primary"}
                style={{
                  width: inputWidth,
                  color: "black",
                  display: isCreating ? undefined : "none",
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    videos: state.videoReducer.videos,
    audios: state.audioReducer.audios,
    isLoading: state.videoReducer.isLoading || state.audioReducer.isLoading,
    isCreating: state.videoReducer.isCreating || state.audioReducer.isCreating,
  };
}

const mapDispatchToProps = {
  loadVideosInCollection,
  createVideoInCollection,
  updateVideoInCollection,
  deleteVideos,
  loadAudiosInCollection,
  createAudioInCollection,
  updateAudioInCollection,
  deleteAudios,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionTable);
