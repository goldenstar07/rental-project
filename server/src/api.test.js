const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../src/models/user");
const Apartment = require("../src/models/apartment");
const routes = require("../src/routes");

const app = express();

describe("api", () => {
  beforeAll(done => {
    mongoose.Promise = global.Promise;
    mongoose
      .connect("mongodb://localhost:27017/testdb", {
        useNewUrlParser: true,
      })
      .then(() => console.log("connected to MongoDB..."))
      .catch(err => console.error("Could not connect to  MongoDB..."));

    app.use(bodyParser.json({ limit: "20mb" }));
    app.use(bodyParser.urlencoded({ limit: "20mb", extended: false }));
    app.use("/", routes);
    done();
  });

  beforeAll(done => {
    User.deleteMany({ email: "testuser@test.com" }).then(() => {
      done();
    });
  });

  describe("auth", () => {
    test("expect successfully registered", () =>
      request(app)
        .post("/auth/signup")
        .send({
          email: "testuser@test.com",
          password: "Password123!",
          repassword: "Password123!",
          first_name: "test",
          last_name: "user",
          role: "realtor",
        })
        .then(resp => {
          expect(resp.statusCode).toBe(201);
        }));

    test("expect successfully logged in with correct credentials", () =>
      request(app)
        .post("/auth/login")
        .send({
          email: "testuser@test.com",
          password: "Password123!",
        })
        .then(resp => {
          expect(resp.statusCode).toBe(200);
        }));
  });

  describe("Apartment", () => {
    let authToken = "";
    let userId = "";

    const testApartment = {
      name: "test apartment",
      description: "This is test for adding",
      floor_size: 222,
      price: 1000,
      lat: 2.232323,
      lng: -26.23423,
      rooms: 2,
      location: "Edmonton, Canada",
      rentable: false,
    };

    const user = new User({
      firstName: "Test",
      lastName: "Admin",
      email: "testadmin2@test.com",
      password: "Password123!",
      repassword: "Password123!",
      role: "admin",
    });

    beforeAll(done => {
      user.save().then(newUser => {
        userId = newUser._id;
        authToken = `Bearer ${jwt.sign(
          {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
          },
          "apartmentrental",
          { expiresIn: "5d" }
        )}`;
        done();
      });
    });

    afterAll(done => {
      Apartment.deleteMany({ realtor: userId }).then(() => {
        User.deleteOne({ _id: userId }).then(() => {
          done();
        });
      });
    });

    test("expect apartment created", () =>
      request(app)
        .post("/apartments/")
        .set("Authorization", authToken)
        .send({
          name: testApartment.name,
          description: testApartment.description,
          floor_size: testApartment.floor_size,
          price: testApartment.price,
          lat: testApartment.lat,
          lng: testApartment.lng,
          realtor: userId,
          rooms: testApartment.rooms,
          location: testApartment.location,
          rentable: testApartment.rentable,
        })
        .then(resp => {
          expect(resp.statusCode).toBe(200);
        }));

    describe("Apartment detail", () => {
      let currentApartmentId = "";

      beforeAll(done => {
        const crudApartment = {
          name: "test apartment",
          description: "This is test for crud apartment",
          floorSize: 222,
          pricePerMonth: 1000,
          lat: 2.232323,
          lng: -26.23423,
          rooms: 2,
          location: "Edmonton, Canada",
          rentable: false,
          realtor: userId,
        };
        Apartment.create(crudApartment).then(newApartment => {
          currentApartmentId = newApartment._id;
          done();
        });
      });

      test("should delete apartment", () =>
        request(app)
          .delete(`/apartments/${currentApartmentId}`)
          .set("Authorization", authToken)
          .then(resp => {
            expect(resp.statusCode).toBe(204);
          }));
    });
  });

  afterAll(done => {
    User.deleteMany({ email: "testadmin@test.com" }).then(() => {
      mongoose.disconnect();
      done();
    });
  });

  afterAll(done => {
    User.deleteMany({ email: "testuser@test.com" }).then(() => {
      mongoose.disconnect();
      done();
    });
  });

  afterAll(() => mongoose.disconnect());
});
