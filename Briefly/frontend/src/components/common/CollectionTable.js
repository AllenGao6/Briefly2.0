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
  };
});

export default function CollectionPage({ history }) {
  const theme = useTheme();
  const classes = useStyles();

  const [rows, setRows] = useState(createDemoRows());
  const [editRowsModel, setEditRowsModel] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const matches = useMediaQuery("(max-width:1086px)");
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const fixedColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 230,
      align: "center",
      headerAlign: "center",
      editable: true,
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
      editable: true,
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

  const handleEditRowModelChange = useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const handleTitleClick = (id) => {
    console.log(id);
    history.push("/dashboard");
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
          <Grid item>
            <Button
              variant="outlined"
              style={{
                color: theme.palette.common.blue,
                borderColor: theme.palette.common.blue,
                width: "5rem",
                marginRight: "1rem",
              }}
            >
              Open
            </Button>
            <Button
              variant="outlined"
              style={{
                color: theme.palette.common.red,
                borderColor: theme.palette.common.red,
                width: "5rem",
              }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </GridToolbarContainer>
    );
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <code>editRowsModel: {JSON.stringify(editRowsModel)}</code>
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
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
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
    </Grid>
  );
}
