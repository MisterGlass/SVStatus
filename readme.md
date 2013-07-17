This is a basic visualizer for my AIs progress in Schemaverse, the space-based strategy game implemented entirely within a PostgreSQL database (https://schemaverse.com/).

Logs are saved in a local MySQL database by my AI (not included) every turn, and this displays some vital statistics in (near) real time. 

There is also a python script to log the top player data. this should be run periodically by cron (ideally every minute)

You can view this live and operating at http://yair.silbermintz.com/schemaverse/planets.php & http://yair.silbermintz.com/schemaverse/svStatus.php

Released under the GPLv3.