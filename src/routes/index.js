const UserRouter = require("./user");
const HomestayRouter = require("./homestay");
const ServiceRouter = require("./service");
const auth = require("../app/middleware/auth");

function route(app) {
  app.use("/users", UserRouter);
  app.use("/homestays", auth, HomestayRouter);
  app.use("/services", auth, ServiceRouter);
}

module.exports = route;
