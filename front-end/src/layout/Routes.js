import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
//
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservations/CreateReservation";
import SeatReservation from "../reservations/SeatReservation";
import CreateTable from "../tables/CreateTable";
import NotFound from "./NotFound";
//

function Routes() {
  console.log("top of Routes");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/seat">
        <SeatReservation />
      </Route>

      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

//  Dev client = port 3000
//  Dev api = port 5001
//  //
//  Routing scheme
//  /dashboard  ("/" redirects here)
//  /search
//  /reservations/new
//  /reservations/:reservation_id/edit
//  /reservations/:reservation_id/seat
//  /tables/new
