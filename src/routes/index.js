const UserRouter = require("./user");
const HomestayRouter = require("./homestay");
const ServiceRouter = require("./service");
const BookingRouter = require("./booking");
const auth = require("../app/middleware/auth");

function route(app) {
  app.use("/users", UserRouter);
  app.use("/homestays", HomestayRouter);
  app.use("/services", ServiceRouter);
  app.use("", BookingRouter);
}

module.exports = route;
