import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Slider,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

import * as actions from "store/actions";

const headCells = [
  {
    id: "name",
    align: "left",
    disablePadding: false,
    label: "Name",
  },
  {
    id: "location",
    align: "left",
    disablePadding: false,
    label: "Location",
  },
  {
    id: "description",
    align: "left",
    disablePadding: false,
    label: "Description",
  },
  {
    id: "floorSize",
    align: "right",
    disablePadding: false,
    label: "Floor Size",
  },
  {
    id: "pricePerMonth",
    align: "right",
    disablePadding: false,
    label: "Price per month",
  },
  {
    id: "rooms",
    align: "right",
    disablePadding: false,
    label: "Rooms",
  },
  {
    id: "realtor",
    align: "left",
    disablePadding: false,
    label: "Realtor",
  },
  {
    id: "rentable",
    align: "left",
    disablePadding: false,
    label: "Rentable",
  },
  {
    id: "actions",
    align: "center",
    disablePadding: false,
    label: "Action",
  },
];

function RealtorTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={idx}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

RealtorTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
    paddingTop: "20px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  add: {
    marginTop: "25px",
  },
  addLink: {
    textDecoration: "none",
    color: "#3f51b5",
  },
}));

const RealtorTableToolbar = props => {
  const dispatch = useDispatch();
  const classes = useToolbarStyles();
  const [priceValue, setPriceValue] = React.useState([1, 10000]);
  const [floorSizeValue, setFloorSizeValue] = React.useState([1, 10000]);
  const [roomsValue, setRoomsValue] = React.useState([1, 100]);

  const { pageInfo } = props;

  // handle Price Change
  const handlePriceChange = (event, newValue) => {
    setPriceValue(newValue);
  };
  const handlePriceUp = (event, newValue) => {
    setPriceValue(newValue);
    dispatch(
      actions.setApartmentsFilter({ priceValue, floorSizeValue, roomsValue })
    );
    dispatch(actions.getApartments({ ...pageInfo }));
  };

  // handle Floor Size Change
  const handleFloorSizeChange = (event, newValue) => {
    setFloorSizeValue(newValue);
  };
  const handleFloorSizeUp = (event, newValue) => {
    setFloorSizeValue(newValue);
    dispatch(
      actions.setApartmentsFilter({ priceValue, floorSizeValue, roomsValue })
    );
    dispatch(actions.getApartments({ ...pageInfo }));
  };

  // handle Rooms Number Change
  const handleRoomsChange = (event, newValue) => {
    setRoomsValue(newValue);
  };
  const handleRoomsUp = (event, newValue) => {
    setRoomsValue(newValue);
    dispatch(
      actions.setApartmentsFilter({ priceValue, floorSizeValue, roomsValue })
    );
    dispatch(actions.getApartments({ ...pageInfo }));
  };

  return (
    <Toolbar className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Apartments
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Price
          </Typography>
          <Slider
            value={priceValue}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceUp}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            max={10000}
            min={1}
            step={100}
            marks={true}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Rooms
          </Typography>
          <Slider
            value={roomsValue}
            onChange={handleRoomsChange}
            onChangeCommitted={handleRoomsUp}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            max={100}
            min={1}
            step={1}
            marks={true}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Floor Size
          </Typography>
          <Slider
            value={floorSizeValue}
            onChange={handleFloorSizeChange}
            onChangeCommitted={handleFloorSizeUp}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            max={10000}
            min={1}
            step={100}
            marks={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <NavLink to="/apartment/add" className={classes.addLink}>
            <MenuItem className={classes.add}>
              <IconButton color="inherit">
                <AddCircleIcon />
              </IconButton>
              <p>Add Apartment</p>
            </MenuItem>
          </NavLink>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  actions: {
    width: "18%",
  },
  actionButtons: {
    margin: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 2, 2),
  },
  cancel: {
    margin: theme.spacing(3, 2, 2),
  },
  norecord: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    textAlign: "center",
  },
}));

export default function RealtorTable() {
  const history = useHistory();
  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("created");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [apartmentDeleteId, setApartmentDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const priceValue = [1, 10000];
    const floorSizeValue = [1, 10000];
    const roomsValue = [1, 100];
    dispatch(
      actions.setApartmentsFilter({ priceValue, floorSizeValue, roomsValue })
    );
    dispatch(
      actions.getApartments({
        order,
        orderBy,
        rowsPerPage,
        page,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, orderBy, page, rowsPerPage]);

  const { apartmentsInfo } = useSelector(state => state.apartment);
  const { apartments, totalCount } = apartmentsInfo;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = row => {
    dispatch(actions.saveEditApartment(row));
    history.push(`/apartment/${row._id}`);
  };

  const handleDelete = () => {
    dispatch(actions.deleteApartment({ id: apartmentDeleteId }));
    setPage(0);
    setOrder("desc");
    setOrderBy("created");
    setRowsPerPage(5);
    setOpenDelete(false);
  };

  const showDeleteDiaglog = id => {
    setApartmentDeleteId(id);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <RealtorTableToolbar pageInfo={{ order, orderBy, rowsPerPage, page }} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <RealtorTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {apartments &&
                apartments.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.location}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="right">
                        {row.floorSize && row.floorSize}
                      </TableCell>
                      <TableCell align="right">
                        {row.pricePerMonth && row.pricePerMonth}
                      </TableCell>
                      <TableCell align="right">{row.rooms}</TableCell>
                      <TableCell align="left">
                        {row.realtor &&
                          `${row.realtor.firstName} ${row.realtor.lastName}`}
                      </TableCell>
                      <TableCell align="left">
                        {row.rentable ? "Rentable" : "Already rented"}
                      </TableCell>
                      <TableCell align="center" className={classes.actions}>
                        <IconButton
                          className={classes.actionButtons}
                          color="inherit"
                          onClick={() => handleEdit(row)}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          className={classes.actionButtons}
                          color="secondary"
                          onClick={() => showDeleteDiaglog(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {!apartments.length && (
            <Typography
              variant="captain"
              className={classes.norecord}
              component="div"
            >
              No apartment found
            </Typography>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Apartment</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this apartment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            variant="contained"
            color="default"
            className={classes.cancel}
          >
            No
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="secondary"
            autoFocus
            className={classes.submit}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
