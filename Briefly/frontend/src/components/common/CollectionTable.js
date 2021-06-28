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
} from "@material-ui/data-grid";
import { XGrid } from "@material-ui/x-grid";
import { useDemoData } from "@material-ui/x-grid-data-generator";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

function createData(createdAt, title, archived, type, fileSize, status) {
  return { createdAt, title, archived, type, fileSize, status };
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

export default function CollectionPage() {
  const rows = [
    {
      id: 1,
      lastName: "Snowwww",
      firstName: "John",
      date: new Date(1979, 0, 1),
    },
    {
      id: 2,
      lastName: "Lannister",
      firstName: "Cersei",
      date: new Date(1979, 0, 1),
    },
    {
      id: 3,
      lastName: "Lannister",
      firstName: "Jaime",
      date: new Date(1979, 0, 1),
    },
    {
      id: 4,
      lastName: "Stark",
      firstName: "Aryaaaa",
      date: new Date(1979, 0, 1),
    },
    {
      id: 5,
      lastName: "Targaryen",
      firstName: "Daenerys",
      date: new Date(1979, 0, 1),
    },
    {
      id: 6,
      lastName: "SnoAAAAAwwww",
      firstName: "John",
      date: new Date(1979, 0, 1),
    },
    {
      id: 7,
      lastName: "Lannister",
      firstName: "Cersei",
      date: new Date(1979, 0, 1),
    },
    {
      id: 8,
      lastName: "Lannister",
      firstName: "Jaime",
      date: new Date(1979, 0, 1),
    },
    {
      id: 9,
      lastName: "Stark",
      firstName: "Aryaaaa",
      date: new Date(1979, 0, 1),
    },
    {
      id: 10,
      lastName: "Targaryen",
      firstName: "Daenerys",
      date: new Date(1979, 0, 1),
    },
  ];

  const columns = [
    {
      field: "firstName",
      headerName: "First name",
      width: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    { field: "lastName", headerName: "Last name", width: 200 },
    {
      field: "fullName",
      headerName: "Full name",
      width: 160,
      valueGetter: getFullName,
      sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
    },
    {
      field: "date",
      headerName: "Year",
      width: 150,
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
  ];

  function getFullName(params) {
    return `${params.getValue(params.id, "firstName") || ""} ${
      params.getValue(params.id, "lastName") || ""
    }`;
  }

  const [editRowsModel, setEditRowsModel] = useState({});
  const handleEditRowModelChange = useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  return (
    <Grid container direction="column">
      <Grid item>
        <code>editRowsModel: {JSON.stringify(editRowsModel)}</code>
      </Grid>
      <Grid item container style={{ height: 1000, width: "100%" }}>
        <DataGrid
          checkboxSelection
          columns={columns}
          rows={rows}
          disableColumnMenu
          pageSize={5}
          rowHeight={150}
          components={{
            Toolbar: GridToolbar,
          }}
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
        />
      </Grid>
    </Grid>
  );
}
