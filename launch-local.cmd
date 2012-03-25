@echo off
REM cd C:\USR\appengine-java-sdk\bin\
SET DEFAULT_ENCODING=UTF-8


	REM Production environment:
REM SET RINGO_ENV=production

	REM Development evironment:
SET RINGO_ENV=development

dev_appserver.cmd %~dp0



	REM Deploy with:
REM C:\USR\appengine-java-sdk\bin\appcfg.cmd update ./

	REM Javascript console:
REM java -jar WEB-INF\lib\js.jar