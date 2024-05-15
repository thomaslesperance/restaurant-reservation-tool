import React, { useState } from "react";
//
import Table from "./Table";
import ErrorAlert from "../layout/ErrorAlert";
//

export default function TableDisplay({ tables, setTablesUpdated }) {
  const [tablesError, setTablesError] = useState(null);

  const tableArray = tables.map((table) => {
    return (
      <Table
        key={table.table_id}
        table={table}
        setTablesError={setTablesError}
        setTablesUpdated={setTablesUpdated}
      />
    );
  });

  const tableComponents = tableArray.length ? (
    tableArray
  ) : (
    <div className="row m-1 justify-content-center">
      <h6>No tables found</h6>
    </div>
  );

  return (
    <>
      <ErrorAlert error={tablesError} />
      <div className="row m-1 p-0">{tableComponents}</div>
    </>
  );
}
