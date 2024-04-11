const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasValidDayOfWeek(req, res, next) {
  const reqDateString = req.body.data.reservation_date;
  const dateObj = new Date(reqDateString);
  const dayOfWeek = dateObj.getDay();
  if (dayOfWeek === 1) {
    next({
      status: 400,
      message: "(API) Reservations cannot be made on a Tuesday",
    });
  } else {
    next();
  }
}

function hasFutureDate(req, res, next) {
  const present = Date.now();
  const resDate = Date.parse(req.body.data.reservation_date);
  if (resDate - present < 0) {
    next({
      status: 400,
      message: "(API) Reservations cannot be made for a previous date",
    });
  } else {
    next();
  }
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.sendStatus(204);
}

async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

module.exports = {
  create: [hasValidDayOfWeek, hasFutureDate, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
