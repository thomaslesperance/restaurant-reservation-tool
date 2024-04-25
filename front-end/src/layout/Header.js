import React from "react";
//

export default function Header({ headerTitle }) {
  return (
    <div className="card row m-1">
      <h1 className="card-header p-1">{headerTitle}</h1>
    </div>
  );
}
