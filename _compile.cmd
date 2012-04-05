@echo off

REM "C:\Program Files\Java\jdk6\bin\javac.exe" -cp WEB-INF\lib\log4j-1.2.16.jar -d WEB-INF\classes -Xlint:all src\sibli\Pinger.java
REM "C:\Program Files\Java\jdk6\bin\javac.exe" -cp WEB-INF\lib\appengine-api-1.0-sdk-1.6.3.1.jar -d WEB-INF\classes -Xlint:all -deprecation -g src\sibli\PingerAsync.java

REM javac -cp "WEB-INF\lib\appengine-api-1.0-sdk-1.6.3.1.jar;WEB-INF\lib\jdo2-api-2.3-eb.jar;WEB-INF\lib\log4j-1.2.16.jar;WEB-INF\classes" -d WEB-INF\classes -Xlint:all -deprecation -g src\sibli\PingerAsync.java
javac -cp "WEB-INF\lib\appengine-api-1.0-sdk-1.6.3.1.jar;WEB-INF\lib\jdo2-api-2.3-eb.jar;WEB-INF\lib\log4j-1.2.16.jar;WEB-INF\classes" -d WEB-INF\classes -deprecation -g src\sibli\PingerAsync.java

"C:\Program Files\Java\jdk6\bin\javac.exe" -cp "WEB-INF\lib\servlet-api.jar;WEB-INF\lib\log4j-1.2.16.jar" -d WEB-INF\classes src\sibli\PingTask.java
"C:\Program Files\Java\jdk6\bin\javac.exe" -cp "WEB-INF\lib\appengine-api-1.0-sdk-1.6.3.1.jar;WEB-INF\lib\jdo2-api-2.3-eb.jar" -d WEB-INF\classes src\sibli\Host.java

REM "C:\Program Files\Java\jdk\bin\java.exe" -XX:-FailOverToOldVerifier -Xverify:all -cp WEB-INF\classes;WEB-INF\lib\appengine-api-1.0-sdk-1.6.3.1.jar sibli.PingerAsync
@pause