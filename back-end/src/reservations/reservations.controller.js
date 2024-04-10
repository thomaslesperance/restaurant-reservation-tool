const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasValidDayOfWeek(req, res, next) {
  const reqDateString = req.body.data.reservation_date;
  const dateObj = new Date(reqDateString);
  const dayOfWeek = dateObj.getDay();
  console.log(dayOfWeek);
  if (dayOfWeek === 1) {
    next({ status: 400, message: "Reservations cannot be made on a Tuesday" });
  } else {
    next();
  }
}

async function hasFutureDate(req, res, next) {}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.sendStatus(204);
}

async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

module.exports = {
  create: [hasValidDayOfWeek, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
