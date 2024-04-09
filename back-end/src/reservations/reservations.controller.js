const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.sendStatus(204);
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
