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
      finishTable(table.table_id)
        .then(window.location.reload())
        .catch(setTablesError);
    } else {
      return;
    }
  }

  return (
    <article className="card col-md-4 p-0">
      <h5 className="card-header">{table.table_name}</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item"> Table ID: {table.table_id}</li>
        <li className="list-group-item"> Capacity: {table.capacity}</li>
        <div className="row card-body justify-content-md-end">
          <div className="col-md" table-table-id-status={`${table.table_id}`}>
            {table.reservation_id ? "Occupied" : "Free"}
          </div>
          {table.reservation_id && (
            <button
              className="col-md btn btn-primary btn-small"
              onClick={handleClick}
              data-table-id-finish={table.table_id}
            >
              Finish
            </button>
          )}
        </div>
      </ul>
    </article>
  );
}

export default Table;
