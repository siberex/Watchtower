/**
 * @fileoverview Action (controller-action) list,
 * e.g. main routing configuration.
 *
 */

var {Application} = require("stick");
var {app, config} = require("./main");

app.get("/", require("./actions/index").index);
app.get("/mobile", require("./actions/index").mobile);

<<<<<<< HEAD
app.get("/mon", require("./actions/monitoring").index);
app.get("/pacman", require("./actions/pacman").index);

app.get("/test", require("./actions/index").test);
=======
// Password protected admin zone.
app.basicauth(adminUrl, config.general.login, config.general.password);

app.get(adminUrl, require("./actions/administrivia").index);


app.get("/monochrome", require("./actions/monochrome").index);


app.get("/sitemap", require("./actions/sitemap").index);

app.get("/rss", require("./actions/rss").index);

//app.get("/", require("./actions/index").index);
app.get("/", require("./actions/monochrome").index);
>>>>>>> 60e387e92e1af057c0f0147a3b5dcf43a3443490
