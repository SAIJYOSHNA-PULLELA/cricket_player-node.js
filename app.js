const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null
const initalizeDBAndSever = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}
initalizeDBAndSever()

const convertDbOjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
  SELECT
  *
  FROM
  cricket_team
  `
  const playersArray = await database.all(getPlayersQuery)
  response.send(
    playersArray.map(eachPlayer => convertDbOjectToResponseObject(eachPlayer)),
  )
})
app.get('/players/:/playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayersQuery = `
  SELECT
  *
  FROM
  cricket_team
  where 
  player_id=${playerId};
  `
  const playersArray = await db.get(getPlayersQuery)
  response.send(convertDbOjectToResponseObject(player))
})
app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const postPlayersQuery = `
  insert into 
  cricket_team(player_name,jersey_number,role)
  values 
  ('${playerName}',${jerseyNumber},'${role}');
  `
  const playersArray = await database.run(postPlayersQuery)
  response.send('Player Added to Team')
})
app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const {playerId} = request.params

  const updatePlayersQuery = `
  UPDATE
  cricket_team 
  SET
  player_name='${playerName}',
  jersey_number=${jerseyNumber},
  role='${role}'
  where 
  player_id=${playerId};
  `
  await database.run(updatePlayersQuery)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const deletePlayerQuery = `
  delete from 
  cricket_team
  where 
  player_id=${playerId};`
  const playersArray = await db.run(deletePlayerQuery)
  response.send('Player Removed')
})
module.exports = app
