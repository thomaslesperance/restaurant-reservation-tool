import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useLocation,
} from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservations/CreateReservation";
import SeatReservation from "../reservations/SeatReservation";
import CreateTable from "../tables/CreateTable";
import NotFound from "./NotFound";
import { listTables, listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";

function Routes() {
  const { search } = useLocation();
  const routeParams = useParams();
  const searchParams = new URLSearchParams(search);

  //  Setup for Dashboard component
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const date = searchParams.size ? searchParams.get("date") : today();
  const previousDate = previous(date);
  const nextDate = next(date);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setTablesError(null);
    setReservationsError(null);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }
  // // //

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard
          date={date}
          today={today()}
          reservations={reservations}
          setReservations={setReservations}
          tables={tables}
          setTables={setTables}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          tablesError={tablesError}
          setTablesError={setTablesError}
          previousDate={previousDate}
          nextDate={nextDate}
        />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route exact={true} path="/reservations/:reservation_id/seat">
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
//
//  Routing scheme
//  /dashboard  ("/" redirects here)
//  /search
//  /reservations/new
//  /reservations/:reservation_id/edit
//  /reservations/:reservation_id/seat
//  /tables/new
