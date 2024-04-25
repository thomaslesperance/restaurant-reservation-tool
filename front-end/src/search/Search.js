import React, { useState, useEffect } from "react";
//
import Header from "../layout/Header";
import SearchBox from "./SearchBox";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "../reservations/ReservationsDisplay";
//
import { listReservations } from "../utils/api";
//

export default function Search() {
  const [searchString, setSearchString] = useState("");
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(fetchSearchResults, [searchString]);

  function fetchSearchResults() {
    if (searchString) {
      setIsLoading(true);
    }
    setApiError(null);
    const abortController = new AbortController();
    listReservations({ mobile_number: searchString }, abortController.signal)
      .then((response) => {
        setReservations(response);
        setIsLoading(false);
      })
      .catch((error) => {
        if (searchString) {
          setApiError(error);
        }
      });
    return () => abortController.abort();
  }

  if (isLoading) {
    return (
      <main>
        <Header headerTitle={"Search"} />
        <SearchBox setSearchString={setSearchString} />
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main>
      <Header headerTitle={"Search"} />
      <SearchBox setSearchString={setSearchString} />
      <ErrorAlert error={apiError} />
      <ReservationsDisplay reservations={reservations} />
    </main>
  );
}
