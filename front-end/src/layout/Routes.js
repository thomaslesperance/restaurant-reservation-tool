import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useLocation,
} from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservations/CreateReservation";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

function Routes() {
  const { search } = useLocation();
  let routeParams = useParams();
  const searchParams = new URLSearchParams(search);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route path="/dashboard">
        <Dashboard
          date={searchParams.size ? searchParams.get("date") : today()}
          today={today()}
        />
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
