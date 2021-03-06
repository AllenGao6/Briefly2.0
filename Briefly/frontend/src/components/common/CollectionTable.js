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
  IconButton,
  Paper,
  ButtonGroup,
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
import {
  loadTextsInCollection,
  createTextInCollection,
  // updateAudioInCollection,
  // deleteAudios,
} from "../../redux/actions/text_actions";
import { transcribeMedia } from "../../redux/actions/summarize_actions";
import MediaUploader from "./MediaUploader";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = () =>
    theme.palette.type === "dark"
      ? lighten(theme.palette.primary.main, 0.2)
      : theme.palette.common.cloud;

  const getHoverBackgroundColor = () =>
    theme.palette.type === "dark"
      ? lighten(theme.palette.primary.main, 0.4)
      : darken(theme.palette.common.cloud, 0.1);

  const getTableBackground = () => {
    theme.palette.type === "dark" ? theme.palette.primary.main.dark : "white";
  };

  return {
    dataGrid: {
      borderRadius: 3,
      border: 0,
      minHeight: "70vh",
      transition: "background-color 0.3s",
      backgroundColor: theme.palette.type === "dark" ? "#424242" : "white",
      "& .MuiDataGrid-row:nth-child(even)": {
        backgroundColor: getBackgroundColor(),
        "&:hover": {
          backgroundColor: getHoverBackgroundColor(),
        },
      },
    },
    title: {
      transition: "color 0.3s",
      color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
      "&:hover": {
        color: "white",
        cursor: "pointer",
      },
    },
    toolbar: {
      color:
        theme.palette.type === "dark" ? theme.palette.common.orange : theme.palette.common.blue,
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
        backgroundColor: theme.palette.type === "dark" ? undefined : "rgba(30, 144, 255, 0.08)",
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
    paper: {
      width: "800px",
    },
    status: {
      ...theme.typography.roundedButton,
      width: "8rem",
      height: "2rem",
      fontSize: "1rem",
    },
    archiveIcon: {
      height: "1.5rem",
      width: "1.5rem",
    },
    titleButton: {
      height: "1.7rem",
      padding: 10,
      paddingLeft: "1rem",
      paddingRight: "1rem",
      fontSize: "1rem",
      width: undefined,
      "&:hover": {
        background:
          theme.palette.type === "dark" ? theme.palette.common.orange : theme.palette.common.blue,
      },
    },
  };
});

function CollectionTable({
  history,
  videos,
  audios,
  texts,
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
  transcribeMedia,
  createTextInCollection,
  loadTextsInCollection,
}) {
  const theme = useTheme();
  const classes = useStyles();

  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [youtube, setYoutube] = useState("");
  const [isYoutube, changeYoutube] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [archived, setArchived] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [action, setAction] = useState(null);
  const [textInput, setTextInput] = useState("");

  const matches = useMediaQuery("(max-width:1086px)");
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const inputWidth = matchesXS ? "20rem" : "35rem";

  const fixedColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 230,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <React.Fragment>
          {params.row.transcript === null ? (
            <Typography variant="body1">{params.value}</Typography>
          ) : (
            <Button
              variant="outlined"
              color={theme.palette.type === "dark" ? "secondary" : "primary"}
              className={classes.titleButton}
              onClick={() => handleTitleClick(params.id)}
            >
              <Typography variant="body1" className={classes.title}>
                {params.value}
              </Typography>
            </Button>
          )}
        </React.Fragment>
      ),
    },
    {
      field: "is_archived",
      headerName: "Archived",
      width: 125,
      align: "center",
      headerAlign: "center",
      type: "boolean",
      renderCell: (params) => (
        <IconButton>
          <ArchiveIcon archived={params.value} />
        </IconButton>
      ),
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
      renderCell: (params) => <Typography variant="body1">{params.value}</Typography>,
    },
    {
      field: "fileSize",
      headerName: "File Size",
      align: "center",
      headerAlign: "center",
      width: 120,
      type: "number",
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value / 1048576).toLocaleString();
        return `${valueFormatted} MB`;
      },
    },
    {
      field: "transcript",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <Status status="Completed" />
        ) : (
          <Status status="Transcribe" id={params.id} />
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
        <React.Fragment>
          {params.row.transcript === null ? (
            <Typography variant="body1">{params.value}</Typography>
          ) : (
            <Button
              variant="outlined"
              color={theme.palette.type === "dark" ? "secondary" : "primary"}
              className={classes.titleButton}
              onClick={() => handleTitleClick(params.id)}
            >
              <Typography variant="body1" className={classes.title}>
                {params.value}
              </Typography>
            </Button>
          )}
        </React.Fragment>
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
      renderCell: (params) => (
        <IconButton>
          <ArchiveIcon archived={params.value} />
        </IconButton>
      ),
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
      renderCell: (params) => <Typography variant="body1">{params.value}</Typography>,
    },
    {
      field: "fileSize",
      headerName: "File Size",
      align: "center",
      headerAlign: "center",
      flex: 1,
      type: "number",
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value / 1048576).toLocaleString();
        return `${valueFormatted} MB`;
      },
    },
    {
      field: "transcript",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <Status status="Completed" />
        ) : (
          <Status status="Transcribe" id={params.id} />
        ),
    },
  ];

  useEffect(() => {
    loadVideosInCollection(match.params.id);
    loadAudiosInCollection(match.params.id);
    loadTextsInCollection(match.params.id);
  }, []);

  const loadMediaInCollection = (id) => {
    switch (mediaType) {
      case "video":
        loadVideosInCollection(id);
        break;
      case "audio":
        loadAudiosInCollection(id);
        break;
      case "text":
        loadTextsInCollection(id);
        break;
      default:
        break;
    }
  };

  const createMediaInCollection = async (id, media) => {
    let createdMedia;
    switch (mediaType) {
      case "video":
        createdMedia = await createVideoInCollection(id, media);
        break;
      case "audio":
        createdMedia = await createAudioInCollection(id, media);
        break;
      case "text":
        createdMedia = await createTextInCollection(id, media);
        break;
      default:
        break;
    }
    handleDialogClose();
    handleMediaTranscription(createdMedia.id);
  };

  const handleMediaTranscription = async (mediaId) => {
    const transcribeSuccess = await transcribeMedia(match.params.id, mediaId, mediaType);
    if (transcribeSuccess) loadMediaInCollection(match.params.id);
  };

  const updateMediaInCollection = async (id, media, mediaId) => {
    switch (mediaType) {
      case "video":
        await updateVideoInCollection(id, media, mediaId);
        break;
      case "audio":
        await updateAudioInCollection(id, media, mediaId);
        break;
      case "text":
        await updateAudioInCollection(id, media, mediaId);
        break;
      default:
        break;
    }
    handleDialogClose();
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
        deleteAudios(id, list_id);
        break;
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
        return texts;
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
    return media.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  };

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const handleTitleClick = (id) => {
    history.push(`/dashboard/${match.params.id}/${mediaType}/${id}/`);
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("is_archived", archived);
      formData.append("collection", match.params.id);
      if (mediaType === "text") {
        formData.append(mediaType, textInput);
      } else if (mediaType === "video" && isYoutube) {
        // pass whether input is youtube link or uploaded file
        formData.append("is_youtube", isYoutube);
        formData.append("youtube_url", youtube);
      } else {
        formData.append(mediaType, mediaStream, mediaStream.name);
      }

      createMediaInCollection(match.params.id, formData);
    }
  };

  const handleDelete = () => {
    deleteMediaInCollection(match.params.id, selectionModel);
    setSelectionModel([]);
  };

  const handleOpenDialog = (action) => {
    setAction(action);
    if (action == "Update") {
      const media = getMediaInCollection().filter((item) => item.id === selectionModel[0])[0];
      setTitle(media.title);
      setArchived(media.is_archived);
      setMediaUrl(media[mediaType]);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTitle("");
    setArchived(false);
    setMediaStream(null);
    setMediaUrl(null);
    setTextInput("");
  };

  const handleUploadFinish = (e) => {
    if (mediaType === "text") {
      setTextInput(e.currentTarget.value);
    } else {
      setMediaStream(e.target.files[0]);
      setMediaUrl(URL.createObjectURL(e.target.files[0]));
    }
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

  function Status({ status, id }) {
    return (
      <Button
        variant="contained"
        disabled={status === "Completed" || status === "Transcribe"}
        className={classes.status}
        style={{
          background: status === "Transcribe" ? "#f9ca24" : "#2ed573",
        }}
        onClick={() => handleMediaTranscription(id)}
      >
        <Typography variant="h6" style={{ color: "white" }}>
          {status === "Transcribe" ? "Processing..." : "Completed"}
        </Typography>
      </Button>
    );
  }

  //check if youtube url is valid
  function matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
      return true;
    }
    return false;
  }

  function ArchiveIcon({ archived }) {
    return (
      <Button
        variant="contained"
        className={classes.archiveIcon}
        disabled
        style={{ background: archived ? "#2ed573" : "#ff6348" }}
      >
        {archived ? (
          <DoneIcon style={{ color: "white" }} />
        ) : (
          <CloseIcon style={{ color: "white" }} />
        )}
      </Button>
    );
  }

  return (
    <Grid container direction="column" alignItems="center" style={{ minHeight: "100vh" }}>
      <Grid
        item
        container
        style={{
          maxWidth: 1400,
          width: "100%",
          paddingLeft: matchesXS ? undefined : "2rem",
          paddingRight: matchesXS ? undefined : "2rem",
          marginBottom: "3rem",
        }}
      >
        <Paper elevation={5} style={{ width: "100%" }}>
          <DataGrid
            className={classes.dataGrid}
            disableColumnMenu
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
        </Paper>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        fullScreen={matchesXS}
        style={{ zIndex: 1303 }}
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h4" align={matchesXS ? "center" : "left"}>
            {action}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item container style={{ paddingLeft: 36, paddingRight: 36 }}>
              <TextField
                label="Title"
                variant="filled"
                value={title}
                fullWidth
                className={classes.textField}
                style={{ width: "100%" }}
                onChange={(e) => setTitle(e.currentTarget.value)}
                disabled={isCreating}
              />
            </Grid>
            <Grid item style={{ paddingBottom: 0 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={archived}
                    disabled={isCreating}
                    color={theme.palette.type === "dark" ? "secondary" : "primary"}
                    onChange={() => setArchived(!archived)}
                  />
                }
                label="Archived"
                labelPlacement="start"
              />
            </Grid>
            {mediaType === "video" && action === "Create" ? (
              <Grid container item justify="center">
                <ButtonGroup variant="contained" color="primary">
                  <Button onClick={() => changeYoutube(true)}>Youtube Url</Button>
                  <Button
                    onClick={() => {
                      changeYoutube(false);
                    }}
                  >
                    File Upload
                  </Button>
                </ButtonGroup>
              </Grid>
            ) : null}
            <Grid item container style={{ paddingTop: mediaUrl ? 0 : undefined }}>
              <MediaUploader
                textInput={textInput}
                action={action}
                mediaType={mediaType}
                isCreating={isCreating}
                onUploadFinish={handleUploadFinish}
                mediaUrl={mediaUrl}
                youtube={youtube}
                setYoutube={setYoutube}
                isYoutube={isYoutube}
                mediaStream={mediaStream}
              />
            </Grid>
            <Grid item container style={{ paddingLeft: 36, paddingRight: 36 }}>
              <LinearProgress
                color={theme.palette.type === "dark" ? "secondary" : "primary"}
                style={{
                  width: "100%",
                  color: "black",
                  display: isCreating ? undefined : "none",
                }}
              />
            </Grid>
            <Grid item container justify="center" spacing={4} style={{ width: inputWidth }}>
              <Grid item>
                <Button
                  variant="contained"
                  disabled={
                    title.length === 0 ||
                    (mediaType !== "text" && mediaUrl === null && isYoutube === false) ||
                    isCreating ||
                    (mediaType === "video" && isYoutube && matchYoutubeUrl(youtube) === false)
                  }
                  className={classes.createButton}
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  {action}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  disabled={isCreating}
                  className={classes.cancelButton}
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
              </Grid>
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
    texts: state.textReducer.texts,
    isLoading:
      state.videoReducer.isLoading || state.audioReducer.isLoading || state.textReducer.isLoading,
    isCreating:
      state.videoReducer.isCreating ||
      state.audioReducer.isCreating ||
      state.textReducer.isCreating,
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
  transcribeMedia,
  createTextInCollection,
  loadTextsInCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionTable);
