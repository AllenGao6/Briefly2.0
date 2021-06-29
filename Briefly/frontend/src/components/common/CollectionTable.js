import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  updateCollection,
  deleteCollection,
} from "../../redux/actions/collection_actions";
import {
  DataGrid,
  GridToolbar,
  useGridSlotComponentProps,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import { XGrid } from "@material-ui/x-grid";
import { useDemoData } from "@material-ui/x-grid-data-generator";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

function createData(id, createdAt, title, archived, type, fileSize, status) {
  return { id, title, archived, type, createdAt, fileSize, status };
}

function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={state.pagination.page}
      count={state.pagination.pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value)}
    />
  );
}

const useStyles = makeStyles({
  dataGrid: {
    borderRadius: 3,
    border: 0,

    height: 48,

    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    width: "70vw",
  },
});

export default function CollectionPage() {
  const theme = useTheme();
  const classes = useStyles();

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

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      editable: true,
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

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Grid
          container
          justify="space-between"
          style={{ padding: 10 }}
          alignItems="center"
        >
          <Grid item>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
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

  const [editRowsModel, setEditRowsModel] = useState({});
  const handleEditRowModelChange = useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  const [selectionModel, setSelectionModel] = useState([]);

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
          width: "90vw",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          minWidth: 1024,
        }}
      >
        <DataGrid
          autoHeight
          checkboxSelection
          columns={columns}
          rows={rows}
          disableColumnMenu
          rowPerPage={5}
          rowsPerPageOptions={[5, 10, 20, 30, 40]}
          components={{
            Toolbar: CustomToolbar,
          }}
          rowHeight={100}
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection.selectionModel);
          }}
          selectionModel={selectionModel}
          className={classes.dataGrid}
        />
      </Grid>
    </Grid>
  );
}
