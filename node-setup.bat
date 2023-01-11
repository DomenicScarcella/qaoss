ECHO Checking Windows OS architecture...

ECHO %PROCESSOR_ARCHITECTURE%  | findstr /i ".64." > nul
IF %ERRORLEVEL% EQU 0 GOTO ver_64
GOTO ver_32

:ver_32
ECHO 32 bit detected
ECHO.
ECHO Downloading nodejs ...
ECHO.

START /B /wait curl -O https://nodejs.org/dist/v16.14.0/node-v16.14.0-x86.msi
START /B /wait msiexec /i node-v16.14.0-x86.msi /qn /l*v install.log
GOTO install


:ver_64
ECHO 64 bit detected
ECHO Downloading nodejs ...
ECHO.

START /B /wait curl -O https://nodejs.org/dist/v16.14.0/node-v16.14.0-x64.msi
START /B /wait msiexec /i node-v16.14.0-x64.msi /qn /l*v install.log
GOTO install

:install
ECHO Installing node modules for Qaoss ... please be patient ... this could take a few minutes ...
ECHO.

CALL npm install

ECHO ***********Enter a Name for your Qaoss site (all one word)************

SET /p domain=
echo %domain%
echo {"port":"3000","group":"0","subdomain":"%domain%","alias":""} > .\config\config.json
pause
ECHO.

ECHO Qaoss has been installed! Double click the 'Launch.bat' file and open your favorite browser and type 'localhost:3000' in the address window. 
pause