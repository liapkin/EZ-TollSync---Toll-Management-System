@echo off

REM Test commands for se2441 CLI tool
se2441 healthcheck
se2441 resetpasses
se2441 resetstations
se2441 addpasses



# OK
se2441 tollstationpasses --station NA01 --from 20220101 --to 20220114
# OK
se2441 passanalysis --stationop KO --tagop KO --from 20220101 --to 20220114
# OK
se2441 passescost --stationop KO --tagop KO --from 20220101 --to 20220114
# OK
se2441 chargesby --opid KO --from 20220101 --to 20220114



se2441 admin --addpasses --source ./newpassesXXXXXX.csv
se2441 admin --usermod --username newuser --passw newpass
se2441 admin --users
se2441 invalidcommand
se2441 login --username myuser
se2441 tollstationpasses --station NA01 --from 20220101 --to 20220114
se2441 tollstationpasses --station NA01 --from 20220101 --to 20220114 --format xml
se2441 admin --addpasses