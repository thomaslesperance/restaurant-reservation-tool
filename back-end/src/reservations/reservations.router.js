const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:reservation_id/status")
  .put(controller.update)
  .all(methodNotAllowed);

module.exports = router;

//{body: {data: { status: "<new-status>" } }} //for PUT
//"http://localhost:5001/reservations?mobile_number=123456" // for GET
