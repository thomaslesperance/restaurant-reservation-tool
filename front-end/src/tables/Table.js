import React from "react";
import { Link } from "react-router-dom";

function Table({ data }) {
  // Button handlers

  return (
    <article className="card col-md-4">
      <div className="card-body">
        <h5 className="card-title">{data.table_name}</h5>

        <p className="card-text"> Table ID: {data.table_id}</p>
        <p className="card-text"> Capacity: {data.capacity}</p>
        <h6 className="card-text" data-table-id-status={`${data.table_id}`}>
          {data.reservation_id ? "Occupied" : "Free"}
        </h6>
      </div>
    </article>
  );
}

export default Table;
