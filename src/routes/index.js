const staticPagesRouter = require('./staticPages');

function route(app) {
    app.use('/', staticPagesRouter);
}

module.exports = route;
