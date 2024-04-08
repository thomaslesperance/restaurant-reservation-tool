const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  // if (req.query) {
  //   res.json({ data: await service.listReservationsByDate(req.query...) });
  // }
  res.json({ data: await service.list() });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
