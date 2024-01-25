@echo off

echo Checking for Updates...
CALL git pull 

echo Installing Dependencies...
CALL npm i

echo Starting Server...
CALL node . nogenerate

pause >nul