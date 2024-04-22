import React from "react";
//
import { finishTable } from "../utils/api";

function Table({ table, setTablesError }) {
  function handleClick() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishTable({ reservation_id: table.reservation_id }, table.table_id)
        .then(window.location.reload())
        .catch(setTablesError);
    } else {
      return;
    }
  }

  return (
    <article className="card col-md-4 p-0">
      <div className="card-header p-0">
        <div className="row m-0">
          <div className="col-md">
            <h5>{table.table_name}</h5>
            <h6 dtable-table-id-status={`${table.table_id}`}>
              {table.reservation_id ? "Occupied" : "Free"}
            </h6>
          </div>
          {table.reservation_id && (
            <button
              className="btn btn-primary btn-small col-md m-1"
              onClick={handleClick}
              data-table-id-finish={table.table_id}
            >
              Finish
            </button>
          )}
        </div>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item p-2"> Table ID: {table.table_id}</li>
        <li className="list-group-item p-2"> Capacity: {table.capacity}</li>
      </ul>
    </article>
  );
}

export default Table;
