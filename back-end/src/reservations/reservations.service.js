const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation, ["reservation_id"])
    .then(([id]) => id);
}

function read(reservation_id) {
  return knex("reservations")
    .where({ reservation_id })
    .then((items) => items[0]);
}

function list(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .orderBy("reservation_time")
    .select("*");
}

module.exports = {
  create,
  read,
  list,
};
