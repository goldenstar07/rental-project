import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Header from "components/Header";
import Rent from "pages/Rent";
import Users from "pages/Users";
import AddUser from "pages/Users/AddUser";
import EditUser from "pages/Users/EditUser";
import Apartments from "pages/Apartments/Apartments";
import AddApartment from "pages/Apartments/AddApartment";
import EditApartment from "pages/Apartments/EditApartment";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Profile from "pages/Profile";

const Routes = props => {
  const { me } = useSelector(state => state.auth);
  const isLoggedIn = me && me.role !== undefined;

  return (
    <>
      <Header />
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            if (isLoggedIn) {
              if (me.role === "client" || me.role === "admin")
                return <Redirect to="/dashboard" />;
              else return <Redirect to="/apartments" />;
            }
            return <Redirect to="/login" />;
          }}
        />
        {!isLoggedIn && (
          <Switch>
            <Route exact path="/signup" component={Signup}></Route>
            <Route exact path="/login" component={Login}></Route>
          </Switch>
        )}
        {isLoggedIn && (
          <>
            <Switch>
              <Route exact path="/profile" component={Profile}></Route>
            </Switch>
            {me.role === "admin" && (
              <Switch>
                <Route exact path="/users" component={Users}></Route>
                <Route exact path="/user/add" component={AddUser}></Route>
                <Route exact path="/user/:id" component={EditUser}></Route>
              </Switch>
            )}
            {(me.role === "admin" || me.role === "realtor") && (
              <Switch>
                <Route exact path="/apartments" component={Apartments}></Route>
                <Route
                  exact
                  path="/apartment/add"
                  component={AddApartment}
                ></Route>
                <Route
                  exact
                  path="/apartment/:id"
                  component={EditApartment}
                ></Route>
              </Switch>
            )}
            {(me.role === "client" || me.role === "admin") && (
              <Switch>
                <Route exact path="/dashboard" component={Rent}></Route>
              </Switch>
            )}
          </>
        )}
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </>
  );
};

export default Routes;
