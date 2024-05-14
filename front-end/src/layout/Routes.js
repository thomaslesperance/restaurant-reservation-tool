import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
//
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservations/CreateReservation";
import EditReservation from "../reservations/EditReservation";
import SeatReservation from "../reservations/SeatReservation";
import CreateTable from "../tables/CreateTable";
import Search from "../search/Search";
import NotFound from "./NotFound";
//

//TEST SUITES FAILING
//5, 6, 8

export default function Routes() {
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

      <Route exact={true} path="/reservations/:reservationId/edit">
        <EditReservation />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/seat">
        <SeatReservation />
      </Route>

      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>

      <Route exact={true} path="/search">
        <Search />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
