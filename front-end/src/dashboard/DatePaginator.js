import React from "react";
import { Link } from "react-router-dom";
//
import { previous, next } from "../utils/date-time";
//

export default function DatePaginator({ date }) {
  return (
    <div className="row m-1 align-items-center">
      <div className="col-md border p-1">
        <h4 className="text-center my-1">{date}</h4>
      </div>

      <div className="col-md p-1">
        <Link
          to={`/dashboard?date=${previous(date)}`}
          className="btn btn-primary w-100"
        >
          Previous
        </Link>
      </div>

      <div className="col-md p-1">
        <Link
          to={`/dashboard?date=${next(date)}`}
          className="btn btn-primary w-100"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
