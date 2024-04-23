import React, { useState, useEffect } from "react";
//
import SearchBox from "./SearchBox";
import Reservation from "../reservations/Reservation";
import ErrorAlert from "../layout/ErrorAlert";
//
import { listReservations } from "../utils/api";
//

function Search() {
  console.log("top of Search");

  const [searchString, setSearchString] = useState("");
  const [returnedReservations, setReturnedReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(fetchSearchResults, [searchString]);
  function fetchSearchResults() {
    console.log("fetchSearchResults with searchString :", searchString);
    setIsLoading(true);
    setApiError(null);
    const abortController = new AbortController();
    listReservations({ mobile_number: searchString }, abortController.signal)
      .then((response) => {
        setReturnedReservations(response);
        setIsLoading(false);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  if (isLoading) {
    return (
      <main>
        <h1>Search</h1>
        <SearchBox setSearchString={setSearchString} />
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main>
      <h1>Search</h1>

      <SearchBox setSearchString={setSearchString} />

      {/* API error alert */}
      <ErrorAlert error={apiError} />

      {returnedReservations.length ? (
        returnedReservations.map((reservation) => {
          return (
            <Reservation key={reservation.reservation_id} data={reservation} />
          );
        })
      ) : (
        <h6>No reservations found</h6>
      )}
    </main>
  );
}

export default Search;

//<Search /> = "Search for a reservation by phone number (partial or complete)"
//  useState [searchString, setSearchString], [returnedReservations, setReturnedReservations]
//  useEffect(fetchSearchResults, [searchString])
//  async function fetchSearchResults() => setReturnedReservations(data from api)
//  return: <h1> Search
//  return: <SearchBox setSearchString={setSearchString} />
//  return: {returnedReservations.map() => <Reservation />}
//  return: or <h6> No reservations found
