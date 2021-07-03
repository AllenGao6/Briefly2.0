import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect, useCallback } from "react";
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
import { darken, lighten } from "@material-ui/core/styles";
import DashboardBar from "../common/DashboardBar";
import Navigator from "../common/Navigator";
import DashboardContent from "../common/DashboardContent";
import { connect } from "react-redux";
import {
  loadCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../../redux/actions/collection_actions";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";
import { set } from "js-cookie";

function createData(id, createdAt, title, archived, type, fileSize, status) {
  return { id, title, archived, type, createdAt, fileSize, status };
}

function createDemoRows() {
  const rows = [];
  for (let i = 1; i < 200; i++) {
    rows.push(
      createData(
        i,
        new Date(1999, 1, 1),
        "QWERTYU ASDF ZXCVB AS AS",
        true,
        "video",
        72381,
        "complete"
      )
    );
  }
  return rows;
}

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
      boxShadow: "0px 5px 7px 5px rgba(165,165,165,0.68)",
      "& .collection-table-evenRow": {
        transition: "background-color 0.3s",
        backgroundColor: getBackgroundColor(),
        "&:hover": {
          backgroundColor: getHoverBackgroundColor(),
        },
      },
      "& .collection-table-oddRow": {
        transition: "background-color 0.3s",
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
  };
});

export default function CollectionPage({ history }) {
  const theme = useTheme();
  const classes = useStyles();

  const [rows, setRows] = useState(createDemoRows());
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState(null);
  const [archived, setArchived] = useState(false);
  const [action, setAction] = useState(null);

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
      field: "archived",
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
    },
    {
      field: "createdAt",
      headerName: "Created At",
      align: "center",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <strong>
          {params.value.getFullYear()}
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
          >
            Open
          </Button>
        </strong>
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
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 180,
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
      field: "archived",
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
    },
    {
      field: "createdAt",
      headerName: "Created At",
      align: "center",
      headerAlign: "center",
      flex: 1.7,
      renderCell: (params) => (
        <strong>
          {params.value.getFullYear()}
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
          >
            Open
          </Button>
        </strong>
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
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 180,
    },
  ];

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const handleTitleClick = (id) => {
    console.log(id);
    history.push("/dashboard");
  };

  const handleDelete = () => {
    setRows(
      rows.filter(
        (row) => selectionModel.find((id) => row.id === id) === undefined
      )
    );
    setSelectionModel([]);
  };

  const handleUpdate = () => {
    setAction("Update");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
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
              >
                Create
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                style={{
                  color: theme.palette.common.blue,
                  borderColor: theme.palette.common.blue,
                  width: "5rem",
                  marginRight: "1rem",
                }}
                onClick={handleUpdate}
                disabled={selectionModel.length !== 1}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                style={{
                  color: theme.palette.common.red,
                  borderColor: theme.palette.common.red,
                  width: "5rem",
                }}
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
      <Grid item>
        <code>selectRowsModel: {JSON.stringify(selectionModel)}</code>
      </Grid>
      <Grid
        item
        container
        style={{
          width: "100%",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <DataGrid
          className={classes.dataGrid}
          disableColumnMenu
          autoHeight
          checkboxSelection
          columns={matches ? fixedColumns : flexColumns}
          rows={rows.map((row, i) => ({ ...row, evenRow: i % 2 !== 0 }))}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          rowHeight={90}
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection.selectionModel);
          }}
          getRowClassName={(params) =>
            `collection-table-${
              params.getValue(params.id, "evenRow") ? "evenRow" : "oddRow"
            }`
          }
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
            <Grid
              item
              container
              justify="center"
              spacing={4}
              style={{ width: inputWidth }}
            >
              <Grid item>
                <Button variant="contained" className={classes.createButton}>
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
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
