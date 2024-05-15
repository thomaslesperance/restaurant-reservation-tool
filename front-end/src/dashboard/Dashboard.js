import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
//
import Header from "../layout/Header";
import ErrorAlert from "../layout/ErrorAlert";
import TableDisplay from "../tables/TableDisplay";
import DatePaginator from "./DatePaginator";
import ReservationsDisplay from "../reservations/ReservationsDisplay";
//
import { listReservations, listTables } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import { today } from "../utils/date-time";
//

export default function Dashboard() {
  const { search } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [tablesUpdated, setTablesUpdated] = useState(false);
  const [reservationsUpdated, setReservationsUpdated] = useState(false);

  //Calculate date for browsing reservations
  let date;
  const searchParams = new URLSearchParams(search);

  if (searchParams.has("date")) {
    date = searchParams.get("date");
  } else {
    date = today();
  }

  useEffect(loadTables, [tablesUpdated]); // tables = type Array
  useEffect(loadReservations, [date, reservationsUpdated]); // reservations = type Array

  function loadTables() {
    setIsLoading(true);
    setApiError(null);
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then((response) => {
        setTables(response);
        setIsLoading(false);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  function loadReservations() {
    setIsLoading(true);
    setApiError(null);
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then((response) => {
        formatReservationDate(response);
        formatReservationTime(response);
        setReservations(response);
        setIsLoading(false);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  if (isLoading) {
    return (
      <main>
        <Header headerTitle={"Dashboard"} />
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main>
      <Header headerTitle={"Dashboard"} />
      <ErrorAlert error={apiError} />
      <TableDisplay tables={tables} setTablesUpdated={setTablesUpdated} />
      <DatePaginator date={date} />
      <ReservationsDisplay
        reservations={reservations}
        setReservationsUpdated={setReservationsUpdated}
      />
    </main>
  );
}
