const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasDataProp(req, res, next) {
  if (req.body.data) {
    next();
  } else {
    next({
      status: 400,
      message: `Server: POST requests must include 'data' property`,
    });
  }
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      res.locals[propertyName] = data[propertyName];
      next();
    } else {
      next({
        status: 400,
        message: `Server: Reservations must include '${propertyName}' field`,
      });
    }
  };
}

function reservationDateValid(req, res, next) {
  const { reservation_date } = res.locals;
  if (reservation_date === "" || reservation_date === "not-a-date") {
    next({
      status: 400,
      message:
        "Server: 'reservation_date' cannot be missing and must be a valid date",
    });
  } else {
    next();
  }
}

function reservationTimeValid(req, res, next) {
  const { reservation_time } = res.locals;
  if (reservation_time === "not-a-time") {
    next({
      status: 400,
      message: "Server: 'reservation_time' must be a valid time",
    });
  } else {
    next();
  }
}

function peopleValid(req, res, next) {
  const { people } = res.locals;
  if (typeof people !== "number" || !people || people === NaN) {
    next({
      status: 400,
      message: "Server: 'people' must be a number",
    });
  } else {
    next();
  }
}

function constructDateValues(req, res, next) {
  const { reservation_date, reservation_time } = res.locals;

  const dateObject = new Date(`${reservation_date}T${reservation_time}`);

  const dateValues = {
    dateObject,
    year: dateObject.getFullYear(),
    month: dateObject.getMonth(),
    day: dateObject.getDate(),
    hours: Number(dateObject.getHours()),
    minutes: Number(dateObject.getMinutes()),
    dayOfWeek: dateObject.getDay(),
    currentDateObject: new Date(),
  };

  for (const [key, value] of Object.entries(dateValues)) {
    res.locals[key] = value;
  }

  next();
}

function notATuesday(req, res, next) {
  if (res.locals.dayOfWeek === 2) {
    next({
      status: 400,
      message:
        "Server: Restaurant closed on Tuesday; reservations cannot be made on a Tuesday",
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
      message: "Server: Reservations must be made for a future date and time",
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

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const response = await service.read(reservation_id);
  // response will be undefined if reservation_id does not exist
  if (response) {
    res.locals.reservation = response;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservation_id} not found`,
    });
  }
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update(req, res) {
  res.json({
    data: await service.update(req.params.reservation_id, req.body.data),
  });
}

async function updateStatus(req, res) {
  res.json({
    data: await service.updateStatus(
      req.params.reservation_id,
      req.body.data.status
    ),
  });
}

async function list(req, res) {
  if (req.query.date) {
    res.json({ data: await service.list(req.query.date) });
  } else if (req.query.reservation_id) {
    res.json({ data: await service.read(req.query.reservation_id) });
  } else if (req.query.mobile_number) {
    res.json({ data: await service.search(req.query.mobile_number) });
  } else {
    next({
      status: 400,
      message: "Server: Requests must include a date or reservation id",
    });
  }
}

module.exports = {
  create: [
    hasDataProp,
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    reservationDateValid,
    reservationTimeValid,
    peopleValid,
    constructDateValues,
    notATuesday,
    notOnPreviousDate,
    notAtPreviousTime,
    notAfter930,
    notBefore1030,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    hasDataProp,
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    reservationDateValid,
    reservationTimeValid,
    peopleValid,
    constructDateValues,
    notATuesday,
    notOnPreviousDate,
    notAtPreviousTime,
    notAfter930,
    notBefore1030,
    asyncErrorBoundary(update),
  ],
  updateStatus: asyncErrorBoundary(updateStatus),
  list: asyncErrorBoundary(list),
};
