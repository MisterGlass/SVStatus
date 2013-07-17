#!/usr/bin/python
import MySQLdb as mdb

def logPlanetCount(player):
  con = mdb.connect('localhost', 'user', 'password', 'dbname')
  cur = con.cursor()
  if(cur.execute("select * from planet_stats where round=%d and tic=%d and username='%s'" % (player['round'],player['tic'],player['username'])) == 0):
    cur.execute("insert into planet_stats set planets=%d, round=%d, tic=%d, username='%s', color='%s'" % (player['planet_count'],player['round'],player['tic'],player['username'],player['color']))
  else:
    cur.execute("update planet_stats set planets=%d, color='%s' where round=%d and tic=%d and username='%s'" % (player['planet_count'],player['color'],player['round'],player['tic'],player['username']))
  con.commit()

import psycopg2
def getCon():
  return psycopg2.connect("host=db.schemaverse.com dbname=schemaverse user=username password=password") #establish DB connection 
  
from psycopg2.extras import DictCursor
def getCur(con):
  return con.cursor(cursor_factory=psycopg2.extras.DictCursor)

cur = getCur(getCon())
cur.execute('''
    select
       count(planets.id) as planet_count, 
       player_stats.username, 
      (SELECT last_value FROM tic_seq) AS tic, 
      (SELECT round_id FROM round_stats ORDER BY round_id DESC LIMIT 1) AS round,
       get_player_rgb(planets.conqueror_id) AS color
    from planets 
    join player_stats on player_stats.player_id = planets.conqueror_id
    group by player_stats.username, planets.conqueror_id
    having count(planets.id) > 1
    order by planet_count desc
''')

players = cur.fetchall()

for player in players:
    logPlanetCount(player)
