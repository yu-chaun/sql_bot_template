const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const fs = require("node:fs");

function ValidateDbExists(){
    return fs.existsSync(path.join(__dirname, "mock.db"))
}

function OpenConnection(){
    return new sqlite3.Database(path.join(__dirname, "mock.db"), sqlite3.OPEN_READWRITE, (error) => {
        if (error){
            return console.error(error);
        }
    })
}

function MigrateJSON(){
    if (!fs.existsSync("players.json")){
        console.log("players.json not found, nothing to migrate!");
    }
    const DataToMigrate = fs.readFileSync("players.json");
    const PlayerList = JSON.parse(DataToMigrate);
    const db = OpenConnection();
    for (let i = 0; i < PlayerList.length; i++){
        const { id, money } = PlayerList[i];
        db.serialize(() => {
            let sql = `
            --Do you remember how to insert data into tables?
            `
            //How do we execute this query 🤔
        });
    }
    db.close();
    fs.renameSync("players.json", "ARCHIVED_players.json");
    console.log("Migration completed");
}


function InitDb(){
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        CREATE TABLE IF NOT EXISTS Players(
            --what are the fields here? (hint: check players.json)
        );
        `
        db.serialize(() => {
            db.exec(sql, (error) => {
                db.close();
                if (error){
                    console.error(error);
                    return resolve(false);
                }
                console.log("DB initialized");
                MigrateJSON();
                return resolve(true);
            });
        });
    });
}

function ListPlayers(){
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --How can we retrieve all data from the table
        ` 
        db.all(sql, (error, Results) => {
            db.close();
            if (error){
                console.error(error);
                return resolve(false);
            }
            return resolve(Results);
        });
    });
}

function SearchPlayer(){
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --how can we search for a particular user (hint: I forgot WHERE to put this hint)
        `
        db.all(sql, (error, Results) => {
            db.close();
            if (error){
                console.error(error);
                return resolve(false);
            }
            return resolve(Results);
        });
    });
}

function UpdatePlayer(PlayerId, NewVal){
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --How do we UPDATE a record 🤔
        `
        db.exec(sql, (error) => {
            if (error){
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

module.exports = {
    ValidateDbExists: ValidateDbExists,
    InitDb: InitDb,
    ListPlayers: ListPlayers,
    SearchPlayer: SearchPlayer,
    UpdatePlayer: UpdatePlayer,
}