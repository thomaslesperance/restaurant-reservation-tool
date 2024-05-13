const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
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
        message: `Server: Tables must include '${propertyName}' field`,
      });
    }
  };
}

function nameValid(req, res, next) {
  const { table_name } = res.locals;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: `Server: table_name must be at least 2 characters`,
    });
  } else {
    next();
  }
}

function capacityValid(req, res, next) {
  const { capacity } = res.locals;

  if (typeof capacity !== "number") {
    next({
      status: 400,
      message: `Server: Table capacity must be a number`,
    });
  } else if (Number(capacity) < 1) {
    next({
      status: 400,
      message: `Server: Tables must seat at least 1 person`,
    });
  } else {
    next();
  }
}

async function tableAvailable(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (!table.reservation_id) {
    res.locals.table_id = req.params.table_id;
    next();
  } else {
    next({
      status: 400,
      message: "Server: Table 'occupied'",
    });
  }
}

async function sufficientTableCapacity(req, res, next) {
  const reservation = await reservationsService.read(
    req.body.data.reservation_id
  );

  const { capacity } = await service.read(res.locals.table_id);
  if (!reservation) {
    next({
      status: 404,
      message: `Server: reservation ${req.body.data.reservation_id} does not exist`,
    });
  } else if (reservation.people > capacity) {
    next({
      status: 400,
      message: "Server: Insufficient table capacity",
    });
  } else {
    res.locals.reservation = reservation;
    res.locals.reservation_id = req.body.data.reservation_id;
    next();
  }
}

function reservationNotSeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    next({
      status: 400,
      message: "Server: Reservation already seated",
    });
  } else {
    next();
  }
}

async function tableOccupied(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (!table) {
    next({
      status: 404,
      message: `Server: table_id ${req.params.table_id} does not exist`,
    });
  } else if (table.reservation_id) {
    res.locals.reservation_id = table.reservation_id;
    res.locals.table_id = req.params.table_id;
    next();
  } else {
    next({
      status: 400,
      message: "Server: Table not occupied",
    });
  }
}

////

// CRUDL functions
async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

async function update(req, res) {
  const { table_id, reservation_id } = res.locals;
  res.json({
    data: await service.update(table_id, reservation_id),
  });
}

async function destroy(req, res) {
  const { reservation_id, table_id } = res.locals;
  const result = await service.destroy(reservation_id, table_id);
  res.json(result);
}

async function list(req, res) {
  if (req.query.available) {
    res.json({ data: await service.listAvailable() });
  } else {
    res.json({ data: await service.list() });
  }
}

module.exports = {
  create: [
    hasDataProp,
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    nameValid,
    capacityValid,
    asyncErrorBoundary(create),
  ],
  update: [
    hasDataProp,
    bodyDataHas("reservation_id"),
    asyncErrorBoundary(tableAvailable),
    asyncErrorBoundary(sufficientTableCapacity),
    reservationNotSeated,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(tableOccupied), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
};
