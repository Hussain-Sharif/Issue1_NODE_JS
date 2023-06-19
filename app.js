const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());
let db = null;
const dbpath = path.join(__dirname, "cricketTeam.db");

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is started at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error : ${e}`);
    process.exit(1);
  }
};

initializeDBandServer();
//API 1
app.get("/players/", async (request, response) => {
  const allQuery = `
        SELECT * 
        FROM cricket_team
        ORDER BY player_id;
    `;
  const allresult = await db.all(allQuery);
  response.send(allresult);
});
//API 2
app.post("/players/", async (request, response) => {
  const r_body = request.body;
  const { playerName, jerseyNumber, role } = r_body;
  const postQuery = `
        INSERT INTO cricket_team(player_name,jersey_number,role)
        VALUES ('${playerName}','${jerseyNumber}','${role}');
    `;
  await db.run(postQuery);
  response.send("Player Added to Team");
});
//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `
        SELECT * FROM cricket_team
        WHERE player_id=${playerId};
    `;
  const getResult = await db.get(getQuery);
  response.send(getResult);
});

//Put

app.put("/players/:playerId/", async (request, response) => {
  const r_body = request.body;
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = r_body;
  const putQuery = `
        UPDATE cricket_team
        SET 
            player_name='${playerName}',
            jersey_number=${jerseyNumber},
            role='${role}'
        WHERE player_id=${playerId};
    `;
  await db.run(putQuery);
  response.send("Player Details Updated");
});
//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dQuery = `
        DELETE FROM cricket_team
        WHERE player_id=${playerId};
    `;

  await db.run(dQuery);
  response.send("Player Removed");
});

module.exports = app;
