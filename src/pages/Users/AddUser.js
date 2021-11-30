import React, { useEffect, useState } from "react";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { requestFailed } from "utils/request";
import { ADD_USER } from "store/constants";
import * as actions from "store/actions";

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

export default function AddUser() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.user);
  const { handleSubmit, control, errors, watch } = useForm();
  const [role, setRole] = useState("client");
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    if (status === requestFailed(ADD_USER)) {
      setSnackOpen(true);
    }
  }, [status]);

  const onSubmit = data => {
    dispatch(
      actions.addUser({
        ...data,
        role,
      })
    );
  };

  const handleRoleChange = event => {
    setRole(event.target.value);
  };

  const snackBarhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add User
              </Typography>
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackOpen}
                autoHideDuration={3000}
                onClose={snackBarhandleClose}
              >
                <Alert variant="filled" severity="error">
                  The email you're adding is already in the database.
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
                      as={
                        <Typography
                          variant="captain"
                          color="error"
                        ></Typography>
                      }
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
                      as={
                        <Typography
                          variant="captain"
                          color="error"
                        ></Typography>
                      }
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
                      as={
                        <Typography
                          variant="captain"
                          color="error"
                        ></Typography>
                      }
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
                      as={
                        <Typography
                          variant="captain"
                          color="error"
                        ></Typography>
                      }
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
                      as={
                        <Typography
                          variant="captain"
                          color="error"
                        ></Typography>
                      }
                      name="repassword"
                    ></ErrorMessage>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
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
                        <MenuItem value={"client"}>Client</MenuItem>
                        <MenuItem value={"realtor"}>Realtor</MenuItem>
                        <MenuItem value={"admin"}>Admin</MenuItem>
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
                  Add User
                </Button>
              </form>
            </div>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}
