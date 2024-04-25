import React from "react";
//
import Menu from "./Menu";
import Routes from "./Routes";
import "./Layout.css";
//

export default function Layout() {
  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-md-2 side-bar">
          <Menu />
        </div>
        <div className="col">
          <Routes />
        </div>
      </div>
    </div>
  );
}
