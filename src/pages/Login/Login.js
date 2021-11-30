import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Container,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { requestFailed, requestSuccess } from "utils/request";

import * as actions from "store/actions";
import { LOGIN } from "store/constants";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { handleSubmit, control, errors } = useForm();
  const { status } = useSelector(state => state.auth);
  const [snackOpen, setSnackOpen] = useState(false);

  const onSubmit = data => {
    dispatch(actions.login(data));
  };

  useEffect(() => {
    return () => {
      dispatch(actions.clearAuthStatus());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === requestFailed(LOGIN)) {
      setSnackOpen(true);
    } else if (status === requestSuccess(LOGIN)) {
      setSnackOpen(true);
    }
  }, [status]);

  const snackBarhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={snackBarhandleClose}
        >
          <Alert variant="filled" severity="error">
            Incorrect email or password!
          </Alert>
        </Snackbar>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Controller
                as={TextField}
                control={control}
                autoComplete="email"
                variant="outlined"
                rules={{ required: "Email field is required" }}
                fullWidth
                id="email"
                type="email"
                label="Email Address"
                name="email"
              />
              <ErrorMessage
                errors={errors}
                as={<Typography variant="captain" color="error"></Typography>}
                name="email"
              ></ErrorMessage>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                as={TextField}
                control={control}
                rules={{
                  required: "Password field is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
                  },
                }}
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <ErrorMessage
                errors={errors}
                as={<Typography variant="captain" color="error"></Typography>}
                name="password"
              ></ErrorMessage>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
