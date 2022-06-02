class StaticPagesController {

    // if have error, next called
    home(req, res, next) {
      res.render('home')
    }
}

module.exports = new StaticPagesController;
