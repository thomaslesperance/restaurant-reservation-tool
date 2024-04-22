const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table, ["table_id"])
    .then(([id]) => id);
}

function read(table_id) {
  return knex("tables")
    .where({ table_id })
    .then(([table]) => table);
}

function update(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id }, ["*"])
    .then(([response]) => response);
}

function destroy(table_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null })
    .then(([response]) => response);
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
