import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ApartmentsTable from "components/ApartmentsTable";
import ApartmentsListmap from "components/ApartmentsListmap";
import * as actions from "store/actions";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: "30px 40px 0px 20px",
  },
  map: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Rent() {
  const classes = useStyles();
  const [lat] = useState(53.54617425411336);
  const [lng] = useState(-113.49361780290296);
  const [center, setCenter] = useState({ lat, lng });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getTotalApartments());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchBoxChange = (lat, lng) => {
    if (lat) {
      setCenter({ lat, lng });
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ApartmentsTable setSelectCoordinate={setCenter} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <ApartmentsListmap
            center={center}
            placeholder="Find Location"
            searchBoxChange={handleSearchBoxChange}
          />
        </Grid>
      </Grid>
    </div>
  );
}
