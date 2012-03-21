/**
 * @fileoverview Action (controller-action) list,
 * e.g. main routing configuration.
 *
 */

var {Application} = require("stick");
var {app, config} = require("./main");

app.get("/", require("./actions/index").index);
app.get("/mobile", require("./actions/index").mobile);

app.get("/mon", require("./actions/monitoring").index);
app.get("/asyncmon", require("./actions/monitoring").async);
app.get("/addhost", require("./actions/monitoring").addhost);
app.post("/addhost", require("./actions/monitoring").addhost);

app.get("/pacman", require("./actions/pacman").index);

app.get("/test", require("./actions/index").test);
