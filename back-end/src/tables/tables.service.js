const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table, ["*"])
    .then((items) => items[0]);
}

function read(table_id) {
  return knex("tables")
    .where({ table_id })
    .then(([table]) => table);
}

function update(table_id, reservation_id) {
  return knex
    .transaction((trx) => {
      knex("reservations")
        .where({ reservation_id })
        .update({ status: "seated" })
        .transacting(trx)
        .then(() => {
          return knex("tables")
            .where({ table_id })
            .update({ reservation_id }, ["*"])
            .transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(([response]) => response)
    .catch((error) => {
      throw new Error(error);
    });
}

function destroy(reservation_id, table_id) {
  return knex
    .transaction((trx) => {
      knex("tables")
        .where({ table_id })
        .update({ reservation_id: null })
        .transacting(trx)
        .then(() => {
          return knex("reservations")
            .where({ reservation_id })
            .update({ status: "finished" }, ["*"])
            .transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(([response]) => response)
    .catch((error) => {
      throw new Error(error);
    });
}

function list() {
  return knex("tables").orderBy("table_name").select("*");
}

function listAvailable() {
  return knex("tables")
    .orderBy("table_name")
    .select("*")
    .where({ reservation_id: null });
}

module.exports = {
  create,
  read,
  update,
  destroy,
  list,
  listAvailable,
};
