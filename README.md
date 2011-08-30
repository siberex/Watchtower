Crying Banksy
=============

Crying Banksy is an image gallery engine written completely
on Javascript with RingoJS (JS runtime based on Mozilla Rhino),
and Stick (JSGI middleware for RingoJS).

Written for Google App Engine deployment.


Before deploy (important!)
==========================

1. Edit /app/config.js and add it to Git ignore (/.gitignore).
2. Change {{email}} to real e-mail address in error templates:
   — /app/views/500.html
   — /errors/default.html
   — /errors/overquota.html
   — /errors/timeout.html
3. Rename app.yaml.example to app.yaml and set your application
   identifier (application: YOUR-APP-ID) on first line.
Now you are ready to deploy to Google App Engine.

Also you can deploy to any server with Java installed,
example of web.xml deployment descriptor is provided.
...also some models’ modifications will be necessary I guess.


Google App Engine SDK
=====================

http://code.google.com/intl/ru/appengine/

Latest downloads here:
http://code.google.com/p/googleappengine/downloads/list



Troubleshooting and FAQ
=======================

Ask you questions, I will answer here :-)


Credits
=======

Developed by Stepan Legachev <siberex@gmail.com>
http://www.sib.li
