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

function logReqData(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = {},
  } = req.body;

  const [year, month, day] = reservation_date.split("-");
  const [hours, minutes] = reservation_time.split(":");
  const dateObject = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);

  const reservationData = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    dateObject,
    year,
    month,
    day,
    hours: Number(hours),
    minutes: Number(minutes),
    dayOfWeek: dateObject.getDay(),
    currentDateObject: new Date(),
  };

  console.log("Req time", Date.now());

  for (const [key, value] of Object.entries(reservationData)) {
    res.locals[key] = value;
    console.log(`${key}: ${value}, type ${typeof value}`);
  }

  next();
}

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
  if (res.locals.dayOfWeek === 2) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made on a Tuesday",
    });
  } else {
    next();
  }
}

function notOnPreviousDate(req, res, next) {
  const { day, currentDateObject } = res.locals;
  if (day - currentDateObject.getDate() < 0) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made for a previous date",
    });
  } else {
    next();
  }
}

function notAtPreviousTime(req, res, next) {
  const { dateObject, currentDateObject } = res.locals;

  if (dateObject - currentDateObject < 0) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made for a previous time",
    });
  } else {
    next();
  }
}

function notAfter930(req, res, next) {
  const { hours, minutes } = res.locals;
  if ((hours === 21 && minutes >= 30) || hours > 21) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made after 9:30 PM",
    });
  } else {
    next();
  }
}

function notBefore1030(req, res, next) {
  const { hours, minutes } = res.locals;
  if ((hours === 10 && minutes <= 30) || hours < 10) {
    next({
      status: 400,
      message: "Server: Reservations cannot be made before 10:30 AM",
    });
  } else {
    next();
  }
}

async function create(req, res) {
  await service.create(req.body.data);
  res.sendStatus(204);
}

async function list(req, res) {
  if (req.query.date) {
    res.json({ data: await service.list(req.query.date) });
  } else if (req.query.reservation_id) {
    res.json({ data: await service.read(req.query.reservation_id) });
  } else {
    next({
      status: 400,
      message: "Server: Requests must include a date or reservation id",
    });
  }
}

module.exports = {
  create: [
    logReqData,
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    notATuesday,
    notOnPreviousDate,
    notAtPreviousTime,
    notAfter930,
    notBefore1030,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};
