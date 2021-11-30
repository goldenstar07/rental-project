import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import RealtorTable from "components/RealtorTable";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: "20px 30px 30px 0px",
  },
}));

export default function Apartments() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <RealtorTable />
        </Grid>
      </Grid>
    </div>
  );
}
