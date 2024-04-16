const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table, ["table_id"])
    .then(([id]) => id);
}

function list() {
  return knex("tables").orderBy("table_name").select("*");
}

module.exports = {
  create,
  list,
};
