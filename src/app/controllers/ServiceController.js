const Service = require("../models/service");
const Homestay = require("../models/homestay");

class ServiceController {
  //GET /services/new
  create(req, res, next) {
    res.send("create service");
  }

  //POST /services/create
  async postCreate(req, res, next) {
    try {
      const service = new Service({
        ...req.body,
      });
      service.save();
      res.send(service);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async delete(req, res, next) {
    const service = await Service.findByIdAndDelete({ _id: req.params.id });
    res.send("delete successfully");
  }

  async getService(req, res, next) {
    const service = await Service.findById(req.params.id);
    res.send(service);
  }

  async postUpdate(req, res, next) {
    const updates = Object.keys(req.body);
    console.log("oke");
    const service = await Service.findById(req.params.id);
    try {
      updates.forEach((update) => (service[update] = req.body[update]));
      await service.save();
      res.send(service);
    } catch (e) {
      res.status(400).send(e);
    }
  }
}

module.exports = new ServiceController();
