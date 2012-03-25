/**
 * @fileoverview Action (controller-action) list,
 * e.g. main routing configuration.
 *
 */

var {Application} = require("stick");
var {app, config} = require("./main");

app.get("/", require("./actions/monitoring").addhost);
app.post("/", require("./actions/monitoring").addhost);

app.get("/addhost", require("./actions/monitoring").addhost);
app.post("/addhost", require("./actions/monitoring").addhost);

app.get("/mon", require("./actions/monitoring").index);
app.get("/asyncmon", require("./actions/monitoring").async);

app.get("/test", require("./actions/index").test);
