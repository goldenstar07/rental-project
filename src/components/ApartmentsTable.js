import React, { useEffect } from "react";
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
} from "@material-ui/core";
import * as actions from "store/actions";

const headCells = [
  {
    id: "name",
    align: "left",
    disablePadding: false,
    label: "Name",
  },
  { id: "location", numeric: true, disablePadding: false, label: "Location" },
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
];

function ApartmentsTableHead(props) {
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
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ApartmentsTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  title: {
    flex: "1 1 100%",
    paddingTop: "20px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ApartmentsTableToolbar = props => {
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
    dispatch(actions.getApartments({ ...pageInfo, rentable: "rentable" }));
    dispatch(actions.getTotalApartments());
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
    dispatch(actions.getApartments({ ...pageInfo, rentable: "rentable" }));
    dispatch(actions.getTotalApartments());
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
    dispatch(actions.getApartments({ ...pageInfo, rentable: "rentable" }));
    dispatch(actions.getTotalApartments());
  };

  return (
    <Toolbar className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Find Apartments
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
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
            step={1000}
            marks={true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
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
        <Grid item xs={12} sm={3}>
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
            step={1000}
            marks={true}
          />
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
    height: "50rem",
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
  norecord: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(12),
    textAlign: "center",
  },
  pagination: {
    position: "absolute",
    bottom: "100px",
  },
  tableRow: {
    cursor: "pointer",
  },
}));

export default function ApartmentsTable({ setSelectCoordinate }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("created");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
        rentable: "rentable",
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <ApartmentsTableToolbar
          pageInfo={{ order, orderBy, rowsPerPage, page }}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <ApartmentsTableHead
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
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      className={classes.tableRow}
                      onClick={() =>
                        setSelectCoordinate({
                          lng: parseFloat(row.lng),
                          lat: parseFloat(row.lat),
                        })
                      }
                    >
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
          className={classes.pagination}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
