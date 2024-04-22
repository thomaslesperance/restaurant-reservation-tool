const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const uiPropertyNames = {
  table_name: "Table Name",
  capacity: "Table Capacity",
};

// Validation middleware
function logReqData(req, res, next) {
  console.log("Req timestamp", Date.now());
  const { data = {} } = req.body;

  for (const [key, value] of Object.entries(data)) {
    res.locals[key] = value;
    console.log(key, typeof value, value);
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
        message: `Server: Tables must include ${uiPropertyNames[property]}`,
      });
    }
  };
}

function nameValid(req, res, next) {
  const { table_name } = res.locals;

  if (table_name.length < 2) {
    next({
      status: 400,
      message: `Server: Table name must be at least 2 characters`,
    });
  } else {
    next();
  }
}

function capacityValid(req, res, next) {
  const { capacity } = res.locals;
  console.log(Number(capacity));
  if (Number.isNaN(Number(capacity))) {
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
  const table = await service.read(req.params.tableId);
  if (!table.reservation_id) {
    res.locals.tableId = req.params.tableId;
    next();
  } else {
    next({
      status: 400,
      message: "Server: Table must be 'Free'",
    });
  }
}

async function sufficientTableCapacity(req, res, next) {
  const { people } = await reservationsService.read(
    req.body.data.reservation_id
  );
  const { capacity } = await service.read(res.locals.tableId);
  if (people > capacity) {
    next({
      status: 400,
      message: "Server: Insufficient table capacity",
    });
  } else {
    res.locals.reservation_id = req.body.data.reservation_id;
    next();
  }
}

async function tableOccupied(req, res, next) {
  const table = await service.read(req.params.tableId);
  if (table.reservation_id) {
    res.locals.reservation_id = table.reservation_id;
    res.locals.table_id = req.params.tableId;
    next();
  } else {
    next({
      status: 400,
      message: "Server: Only 'Occupied' tables can be finished",
    });
  }
}

////

// CRUDL functions
async function create(req, res) {
  await service.create(req.body.data);
  res.sendStatus(204);
}

async function update(req, res) {
  const { tableId, reservation_id } = res.locals;
  res.json({
    data: await service.update(tableId, reservation_id),
  });
}

async function destroy(req, res) {
  const { reservation_id, table_id } = res.locals;
  const result = await service.destroy(reservation_id, table_id);
  console.log(result);
  res.status(204).json(result);
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
    logReqData,
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    nameValid,
    capacityValid,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableAvailable),
    asyncErrorBoundary(sufficientTableCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(tableOccupied), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
};
