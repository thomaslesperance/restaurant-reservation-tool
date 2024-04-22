const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:tableId/seat")
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

module.exports = router;

//body: {data: { reservation_id: reservation.reservation_id }}  //for PUT
//body: {data: { reservation_id: table.reservation_id }}     //for DELETE
