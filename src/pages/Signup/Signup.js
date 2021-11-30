import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { requestFailed, requestSuccess } from "utils/request";
import * as actions from "store/actions";
import { SIGNUP } from "store/constants";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: "100%",
    margin: "0px",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { handleSubmit, control, errors, watch } = useForm();
  const { status } = useSelector(state => state.auth);
  const [snackOpen, setSnackOpen] = useState(false);
  const [role, setRole] = useState("client");

  useEffect(() => {
    if (status === requestFailed(SIGNUP)) {
      setSnackOpen(true);
    } else if (status === requestSuccess(SIGNUP)) {
      setSnackOpen(true);
    }
  }, [status]);

  useEffect(() => {
    return () => {
      dispatch(actions.clearAuthStatus());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = event => {
    setRole(event.target.value);
  };

  const onSubmit = data => {
    dispatch(
      actions.signup({
        ...data,
        role,
      })
    );
  };

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
          Sign up
        </Typography>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={snackBarhandleClose}
        >
          <Alert variant="filled" severity="error">
            The email you want to signup is already in the database!
          </Alert>
        </Snackbar>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                as={TextField}
                control={control}
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                rules={{ required: "First Name field is required" }}
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
              <ErrorMessage
                errors={errors}
                as={<Typography variant="caption" color="error"></Typography>}
                name="first_name"
              ></ErrorMessage>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                as={TextField}
                control={control}
                autoComplete="lname"
                variant="outlined"
                rules={{ required: "Last Name field is required" }}
                fullWidth
                id="lastName"
                label="Last Name"
                name="last_name"
              />
              <ErrorMessage
                errors={errors}
                as={<Typography variant="caption" color="error"></Typography>}
                name="last_name"
              ></ErrorMessage>
            </Grid>
            <Grid item xs={12}>
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
                as={<Typography variant="caption" color="error"></Typography>}
                name="email"
              ></ErrorMessage>
            </Grid>
            <Grid item xs={12}>
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
                as={<Typography variant="caption" color="error"></Typography>}
                name="password"
              ></ErrorMessage>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                as={TextField}
                control={control}
                rules={{
                  required: "Confirm Password field is required",
                  validate: value => {
                    let pwd = watch("password", "");
                    return value === pwd || "The passwords do not match";
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
                  },
                }}
                variant="outlined"
                fullWidth
                name="repassword"
                label="Confirm Password"
                type="password"
                id="repassword"
                autoComplete="current-password"
              />
              <ErrorMessage
                errors={errors}
                as={<Typography variant="caption" color="error"></Typography>}
                name="repassword"
              ></ErrorMessage>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Role
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={role}
                  onChange={handleRoleChange}
                  label="Role"
                >
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="realtor">Realtor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
