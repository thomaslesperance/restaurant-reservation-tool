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

function update(reservation_id, fields) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ ...fields }, ["*"])
    .then((items) => items[0]);
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status }, ["*"])
    .then((items) => items[0]);
}

function list(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .orderBy("reservation_time")
    .select("*");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  create,
  read,
  update,
  updateStatus,
  list,
  search,
};
