const knex = require("../db/connection");

function create(reservation) {
  // const columns = [];

  // for (let [key, value] of Object.entries(reservation)) {
  //   const column = {
  //     [key]: value,
  //   };
  //   columns.push(column);
  // }

  return knex("reservations")
    .insert(reservation, ["reservation_id"])
    .then(([id]) => id);
}

function list() {
  return knex("reservations").orderBy("reservation_time").select("*");
}

module.exports = {
  create,
  list,
};
