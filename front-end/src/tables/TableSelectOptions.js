import React from "react";

export default function TableSelectOptions({ tables }) {
  return (
    tables.length &&
    tables.map((table) => {
      return (
        <option value={table.table_id} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    })
  );
}
