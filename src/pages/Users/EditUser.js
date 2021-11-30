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
import { omit } from "lodash";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { requestFailed } from "utils/request";
import { UPDATE_USER } from "store/constants";
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

export default function EditUser() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.user);
  const { user } = useSelector(state => state.user);
  const { handleSubmit, control, errors, setValue, watch } = useForm();
  const [role, setRole] = useState("client");
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    if (status === requestFailed(UPDATE_USER)) {
      setSnackOpen(true);
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      const { firstName, lastName, email, role } = user;
      setValue("first_name", firstName);
      setValue("last_name", lastName);
      setValue("email", email);
      setRole(role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = data => {
    const { _id } = user;
    const { password } = data;
    if (!password) {
      dispatch(
        actions.updateUser({
          ...omit(data, ["password", "repassword"]),
          _id,
          role,
        })
      );
    } else {
      dispatch(
        actions.updateUser({
          ...data,
          _id,
          role,
        })
      );
    }
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
                Edit User
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
                      as={<Typography color="error"></Typography>}
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
                      as={<Typography color="error"></Typography>}
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
                      as={<Typography color="error"></Typography>}
                      name="email"
                    ></ErrorMessage>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      variant="outlined"
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      rules={{
                        validate: {
                          rule1: value => {
                            const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$|^$/.test(
                              value || ""
                            );
                            return (
                              isValid ||
                              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                            );
                          },
                        },
                      }}
                    />
                    <ErrorMessage
                      errors={errors}
                      as={
                        <Typography
                          variant="caption"
                          color="error"
                        ></Typography>
                      }
                      name="password"
                    ></ErrorMessage>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      variant="outlined"
                      fullWidth
                      name="repassword"
                      label="Confirm Password"
                      type="password"
                      id="repassword"
                      rules={{
                        validate: {
                          rule1: value => {
                            let pwd = watch("password", "");
                            return (
                              (value || "") === pwd ||
                              "The passwords do not match"
                            );
                          },
                          rule2: value => {
                            const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$|^$/.test(
                              value || ""
                            );
                            return (
                              isValid ||
                              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                            );
                          },
                        },
                      }}
                    />
                    <ErrorMessage
                      errors={errors}
                      as={
                        <Typography
                          variant="caption"
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
                  Edit User
                </Button>
              </form>
            </div>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}
