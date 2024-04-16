const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const uiPropertyNames = {
  table_name: "Table Name",
  capacity: "Table Capacity",
};

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

async function create(req, res) {
  await service.create(req.body.data);
  res.sendStatus(204);
}

async function list(req, res) {
  res.json({ data: await service.list() });
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
  list: asyncErrorBoundary(list),
};
