import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, ErrorMessage } from "react-hook-form";
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
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Geocode from "react-geocode";

import ApartmentMap from "components/ApartmentMap";
import * as actions from "store/actions";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(10),
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(6),
    marginBottom: theme.spacing(18),
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

export default function EditApartment() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { handleSubmit, control, errors, setValue } = useForm();
  const [realtorId, setRealtorId] = useState("null");
  const [lat, setLat] = useState(41.608635);
  const [lng, setLng] = useState(21.745275);
  const [center, setCenter] = useState({ lat, lng });
  const { apartment } = useSelector(state => state.apartment);
  const [rentStatus, setRentStatus] = useState(true);
  const { me } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(actions.getRealtors());
    if (apartment) {
      const {
        name,
        description,
        lat,
        lng,
        floorSize,
        rooms,
        pricePerMonth,
        realtor,
        rentable,
      } = apartment;
      setRealtorId(realtor._id);
      setValue("name", name);
      setValue("description", description);
      setValue("floor_size", floorSize);
      setValue("rooms", rooms);
      setValue("price", pricePerMonth);
      setValue("lat", lat);
      setValue("lng", lng);
      setLat(parseFloat(lat));
      setLng(parseFloat(lng));
      setRentStatus(rentable);
      setCenter({ lat, lng });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue("lat", lat);
    setValue("lng", lng);
    setCenter({ lat, lng });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  const realtors = useSelector(state => {
    const { realtorsInfo } = state.user;
    let realtors = realtorsInfo ? realtorsInfo.users : [];
    return realtors;
  });

  const onSubmit = data => {
    Geocode.setApiKey(process.env.REACT_APP_MAP_KEY);
    Geocode.setLanguage("en");
    Geocode.enableDebug();
    Geocode.fromLatLng(data.lat, data.lng).then(
      response => {
        const address = response.results[0].formatted_address;
        dispatch(
          actions.updateApartment({
            ...data,
            _id: apartment._id,
            realtor: realtorId,
            location: address,
            rentable: rentStatus,
          })
        );
      },
      error => {
        console.error(error);
      }
    );
  };

  const handleLatChange = ([event]) => {
    let latitude = parseFloat(event.target.value);
    if (latitude <= 90 && latitude >= -90) {
      setLat(latitude);
    }
  };

  const handleLngChange = ([event]) => {
    let longitude = parseFloat(event.target.value);
    if (longitude <= 180 && longitude >= -180) {
      setLng(longitude);
    }
  };

  const handleRealtorChange = (event, values) => {
    values && setRealtorId(values._id);
  };

  const handleSearchBoxChange = (lat, lng) => {
    if (lat) {
      setValue("lat", lat);
      setValue("lng", lng);
      setCenter({ lat, lng });
    }
  };

  const handleRentableChange = event => {
    setRentStatus(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="fluid">
        <Grid container>
          <Grid item xs={12} sm={6}>
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Edit Apartment
              </Typography>

              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      autoComplete="name"
                      name="name"
                      variant="outlined"
                      rules={{
                        required: "Name field is required",
                      }}
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      as={TextField}
                      control={control}
                      name="lat"
                      variant="outlined"
                      fullWidth
                      label="Latitude"
                      placeholder="Between -90 and 90"
                      type="number"
                      rules={{
                        required: "Latitude field is required",
                        min: {
                          value: -90,
                          message: "Latitude should be bigger than -90",
                        },
                        max: {
                          value: 90,
                          message: "Latitude should be smaller than 90",
                        },
                      }}
                      id="lat"
                      onChange={handleLatChange}
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="lat"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      as={TextField}
                      control={control}
                      name="lng"
                      variant="outlined"
                      placeholder="Between -180 and 180"
                      type="number"
                      rules={{
                        required: "Longitude field is required",
                        min: {
                          value: -180,
                          message: "Longitude should be bigger than -180",
                        },
                        max: {
                          value: 180,
                          message: "Longitude should be smaller than 180",
                        },
                      }}
                      fullWidth
                      id="lng"
                      label="Longitude"
                      onChange={handleLngChange}
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="lng"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      autoComplete="description"
                      name="description"
                      variant="outlined"
                      rules={{ required: "Description field is required" }}
                      fullWidth
                      id="description"
                      label="Description"
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="description"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      as={TextField}
                      control={control}
                      autoComplete="floor_size"
                      name="floor_size"
                      variant="outlined"
                      rules={{
                        required: "Floor Size field is required",
                        validate: value =>
                          value !== 0 || "Floor Size should be over 0",
                        min: {
                          value: 1,
                          message: "Floor Size should be over 0",
                        },
                        max: {
                          value: 10000,
                          message: "Floor Size should be less than 10000",
                        },
                      }}
                      fullWidth
                      id="floor_size"
                      label="Floor Size"
                      type="Number"
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="floor_size"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      as={TextField}
                      control={control}
                      autoComplete="rooms"
                      name="rooms"
                      variant="outlined"
                      rules={{
                        required: "Rooms field is required",
                        min: {
                          value: 1,
                          message: "Rooms count should be more than 1",
                        },
                        max: {
                          value: 100,
                          message: "Rooms count should be less than 100",
                        },
                      }}
                      fullWidth
                      id="rooms"
                      label="Rooms"
                      type="Number"
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="rooms"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      as={TextField}
                      control={control}
                      autoComplete="price"
                      name="price"
                      variant="outlined"
                      rules={{
                        required: "Price field is required",
                        validate: value =>
                          value !== 0 || "Price should be over 0",
                        min: {
                          value: 1,
                          message: "Price should be over 0",
                        },
                        max: {
                          value: 10000,
                          message: "Price should be less than 10",
                        },
                      }}
                      fullWidth
                      id="price"
                      label="Price"
                      type="Number"
                    />
                    <ErrorMessage
                      errors={errors}
                      as={<Typography color="error"></Typography>}
                      name="price"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        defaultValue={apartment.rentable}
                        onChange={handleRentableChange}
                        label="Rentable Status"
                      >
                        <MenuItem value={true}>Rentable</MenuItem>
                        <MenuItem value={false}>Already Rented</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {me && me.role === "admin" && (
                    <Grid item xs={12} sm={12}>
                      <Autocomplete
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        options={realtors && realtors}
                        getOptionLabel={option =>
                          `${option.firstName} ${option.lastName}`
                        }
                        onChange={handleRealtorChange}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Realtor"
                            required
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                              ...params.InputProps,
                              type: "search",
                            }}
                          />
                        )}
                        defaultValue={{
                          firstName: apartment && apartment.realtor.firstName,
                          lastName: apartment && apartment.realtor.lastName,
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Edit Apartment
                </Button>
              </form>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ApartmentMap
              center={center}
              placeholder="Please find a location to add an Apartment"
              searchBoxChange={handleSearchBoxChange}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
