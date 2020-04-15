Watchtower
=============

Watchtower is a site monitoring system.

You can play with it here: http://mon.sib.li

Written for Google App Engine deployment.


Before deploy (important!)
==========================

1. Edit /app/config.js and add it to Git ignore (/.gitignore).
2. Write your e-mail address in error templates:
   — /app/views/500.html
   — /errors/default.html
   — /errors/overquota.html
   — /errors/timeout.html
3. Check app.yaml and set your application identifier
   (application: YOUR-APP-ID) on first line.

Now you are ready to deploy to Google App Engine.


Google App Engine SDK
=====================

http://code.google.com/intl/ru/appengine/

Latest downloads here:
http://code.google.com/p/googleappengine/downloads/list


RingoJS
=======

http://ringojs.org/


Troubleshooting and FAQ
=======================

Ask you questions, I will answer here :-)


Credits
=======

https://sib.li
