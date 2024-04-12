const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const uiPropertyNames = {
  first_name: "First Name",
  last_name: "Last Name",
  mobile_number: "Mobile Number",
  reservation_date: "Reservation Date",
  reservation_time: "Reservation Time",
  people: "Party Size",
};

function bodyDataHas(property) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[property]) {
      next();
    } else {
      next({
        status: 400,
        message: `Server: Reservations must include '${uiPropertyNames[property]}'`,
      });
    }
  };
}

function notATuesday(req, res, next) {
  const reservation_date = req.body.data.reservation_date;
  const resDayOfWeek = new Date(reservation_date.replaceAll("-", "/")).getDay();
  if (reservation_date) {
    res.locals.reservation_date = reservation_date;
  }

  if (resDayOfWeek === 2) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made on a Tuesday",
    });
  } else {
    next();
  }
}

function notOnPreviousDate(req, res, next) {
  const presentDate = new Date().getDate();
  const resDate = new Date(
    res.locals.reservation_date.replaceAll("-", "/")
  ).getDate();

  if (resDate - presentDate < 0) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made for a previous date",
    });
  } else {
    next();
  }
}

function notAtPreviousTime(req, res, next) {}

function notAfter930(req, res, next) {}

function notBefore1030(req, res, next) {}

async function create(req, res) {
  await service.create(req.body.data);
  res.sendStatus(204);
}

async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

module.exports = {
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    notATuesday,
    notOnPreviousDate,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};

//  New reservation needed validations:
//  Date-
/// Not a Tuesday
/// Not in the past(date)
/// Time-
/// Not in the past(time)
/// Not after 9:30 PM
/// Not before 10:30 AM
/// validateDate = [notATuesday, notOnPreviousDate]
/// validateTime = [notAtPreviousTime, notAfter930, notBefore1030]
/// req, res, next objects passed to each; res.locals mutated by each
