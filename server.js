if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config(); // Load environment variables
}

/*=====================================
        Dependencies
======================================*/
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql2");

var app = express();
var PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*=====================================
        View Engine
======================================*/
app.engine('html', require('ejs').renderFile);
app.set("views", path.resolve(__dirname, "views"));
app.set('view engine', 'ejs');
app.enable("view cache");

/*=====================================
        MySQL connection
======================================*/
var connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "butterflyMySql619!",
    database: process.env.DB_NAME || "memoryGameDB" // Add database name to avoid multiple `USE` statements
});

//CONNECT
connection.connect(function(err) {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        process.exit(1); // Exit the process if the connection fails
    }
    console.log("Connected as id " + connection.threadId);

    // Extract reusable query function
    const executeQuery = async (query, params = []) => {
        try {
            const [results] = await connection.promise().query(query, params);
            return results;
        } catch (err) {
            console.error("Database query error:", err.message);
            throw err;
        }
    };

    // Use async/await for better readability
    (async () => {
        try {
            await executeQuery("DROP DATABASE IF EXISTS memoryGameDB");
            console.log("Database dropped successfully");

            await executeQuery("CREATE DATABASE memoryGameDB");
            console.log("Database created successfully");

            await executeQuery("USE memoryGameDB");
            console.log("Using memoryGameDB");

            await executeQuery(`
                CREATE TABLE user_account (
                    user_name VARCHAR(255) NOT NULL,
                    pswd VARCHAR(255) NULL,
                    active_status ENUM('active', 'inactive'),
                    PRIMARY KEY (user_name)
                )
            `);
            console.log("Table user_account created successfully");

            await executeQuery(`
                CREATE TABLE leaderboard (
                    game_id INT NOT NULL AUTO_INCREMENT,
                    user_name VARCHAR(255) NOT NULL,
                    game_date VARCHAR(255) NULL,
                    game_start VARCHAR(255) NULL,
                    game_end VARCHAR(255) NULL,
                    game_complete INT NULL,
                    PRIMARY KEY (game_id),
                    INDEX user_name_idx (user_name ASC),
                    CONSTRAINT user_name FOREIGN KEY (user_name)
                        REFERENCES memoryGameDB.user_account (user_name)
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION
                )
            `);
            console.log("Table leaderboard created successfully");

            // Hardcoding users and leaderboard scores
            const users = [
                ['Sarah', 'ILoveu', 'active'],
                ['Bobby', 'Howdy33', 'active'],
                ['Jessica', 'Hahaha', 'inactive'],
                ['Donte', 'funny1', 'inactive'],
                ['Amy', 'ReallyGurl', 'active'],
                ['Niecee', 'mine39', 'active']
            ];
            for (const user of users) {
                await executeQuery(
                    "INSERT INTO user_account (user_name, pswd, active_status) VALUES (?, ?, ?)",
                    user
                );
            }
            console.log("User accounts hardcoded successfully");

            const scores = [
                ['Sarah', '1/12/19', '10:30:00', '10:40:00', 600],
                ['Sarah', '1/13/19', '12:12:00', '12:12:10', 310],
                ['Bobby', '10/13/17', '12:00:00', '12:20:00', 1200],
                ['Bobby', '09/08/18', '11:00:00', '11:30:00', 1800],
                ['Jessica', '09/18/17', '10:00:00', '10:40:00', 2400],
                ['Jessica', '10/28/19', '10:00:00', '10:10:00', 260],
                ['Donte', '10/29/19', '09:00:00', '09:00:40', 340],
                ['Donte', '10/28/19', '10:00:00', '10:50:00', 3000],
                ['Amy', '11/12/18', '10:00:00', '10:55:00', 3300],
                ['Amy', '11/15/19', '12:00:00', '12:56:00', 3360],
                ['Niecee', '11/01/19', '12:12:00', '12:24:00', 720],
                ['Niecee', '08/08/16', '12:00:00', '12:59:00', 3540]
            ];
            for (const score of scores) {
                await executeQuery(
                    "INSERT INTO leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?, ?, ?, ?, ?)",
                    score
                );
            }
            console.log("Leaderboard scores hardcoded successfully");
        } catch (err) {
            console.error("Error during database setup:", err.message);
        }
    })();

    /*=====================================
        LOCAL EJS TEMPLATE VARIABALES
    ======================================*/
    app.locals.users = [];
    app.locals.status = null;
    app.locals.currentUser = "Player";
    app.locals.winners = [];
    app.locals.filterOption = null;

    /*=====================================
        MIDDLEWARE FUNCTIONS AND ROUTES
    ======================================*/
    app.use(function (req, res, next) {
        console.log(`${req.method} request for '${req.url}'`);
        next();
    });

    app.use(express.static("./public"));

    /*=====================================
        Error Handling Middleware
    ======================================*/
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong! Please try again later.");
    });

    // Replace hardcoded URLs with dynamic URLs
    const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

    /*=====================================
            GET MEMORY HOME PAGE
    ======================================*/
    app.get("/", function (req, res) {
        res.render("index.ejs", {
            currentUser: "Player"
        });
    });//end app.get "/"

    /*=====================================
            GET MEMORY GAME PAGE
    ======================================*/
    app.get("/memoryGame", function(req, res) {
        console.log(app.locals.currentUser, "the currentUser when GET memory Game page");

        if(app.locals.currentUser == undefined || app.locals.currentUser == "Player" ){
            res.redirect("/");
        }else{
            res.render("memoryGame.ejs", {
                currentUser: app.locals.currentUser
            });
        }
    });//end app.get "/memoryGame"

    /*=====================================
            GET LEADERBOARD PAGE
    ======================================*/
    app.get("/leaderBoard", function(req, res) {
        console.log(app.locals.filterOption, 'filter options on the leaderboard page');
        console.log(app.locals.currentUser, 'the current user on the leaderboard page');

        function renderPage() {
            res.render("leaderBoard.ejs", {
                currentUser: app.locals.currentUser || "Player",
                winners: app.locals.winners || [],
                filter_default: app.locals.filterOption || "all_Players"
            });
        }

        if(app.locals.filterOption == 'all_Players' || app.locals.filterOption == undefined){
            connection.query("SELECT user_name, game_date, game_complete from memoryGameDB.leaderboard order by game_complete",
                function (err, results){
                if(err){
                    throw err;
                }
                app.locals.winners = results;
                console.log(app.locals.winners, "this is the results for the leaderboard");
                renderPage();
        });//end query selection  
        }else
        if(app.locals.filterOption == 'your_Scores'){
            if(app.locals.currentUser && app.locals.currentUser !== "Player"){
                connection.query("SELECT user_name, game_date, game_complete FROM memoryGameDB.leaderboard " +
                "where user_name=? order by game_complete",[app.locals.currentUser],
                    function (err, results){
                    if(err){
                        throw err;
                    }
                    app.locals.winners = results;
                    console.log(app.locals.winners, "this is the results for the leaderboard");
                    console.log(app.locals.currentUser, "the current user when filtering your scores only");
                    renderPage();
                });//end query selection  
            } else {
                // If no current user, show all scores
                connection.query("SELECT user_name, game_date, game_complete from memoryGameDB.leaderboard order by game_complete",
                    function (err, results){
                    if(err){
                        throw err;
                    }
                    app.locals.winners = results;
                    app.locals.filterOption = "all_Players";
                    renderPage();
                });
            }
        } else {
            // Default to all players
            connection.query("SELECT user_name, game_date, game_complete from memoryGameDB.leaderboard order by game_complete",
                function (err, results){
                if(err){
                    throw err;
                }
                app.locals.winners = results;
                app.locals.filterOption = "all_Players";
                renderPage();
            });
        }

    });//end app.get "/leaderBoard"

    /*=====================================
         GET AVAILABLE PHOTOS
    ======================================*/
    app.get("/api/photos", function(req, res) {
        const fs = require('fs');
        const gameCardsDir = path.join(__dirname, 'public', 'photos', 'gameCards');
        
        fs.readdir(gameCardsDir, (err, files) => {
            if (err) {
                console.error("Error reading gameCards directory:", err);
                return res.status(500).json({ error: "Failed to load photos" });
            }
            
            // Filter for image files - any image file is valid for the game
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            });
            
            // Create photo objects with metadata
            const photos = imageFiles.map(file => ({
                filename: file,
                path: `/photos/gameCards/${file}`,
                name: path.parse(file).name
            }));
            
            res.json(photos);
        });
    });//end app.get "/api/photos"



    /*=====================================
            SEND TO ERROR 403 PAGE
    ======================================*/
    app.get("/public", function(req, res) {
        res.status(403).sendFile(path.join(__dirname, "/public/noAccess.html"));
    });//end app.get "/public"

    /*=====================================
            START GAME
    ======================================*/
    app.post("/startGame", function(req, res) {
        let playerName = req.body.playerName;
        
        if (!playerName || playerName.trim() === "") {
            return res.redirect("/");
        }
        
        // Store the player name in session
        app.locals.currentUser = playerName.trim();
        
        console.log("Starting game for player:", playerName);
        res.redirect(getBaseUrl(req) + "/memoryGame");
    });//end app.post "/startGame"



    /*=====================================
         POST SCORE
    ======================================*/
    app.post('/postScore', function(req, res) {
        console.log(req.body, "req.body in the POST postScore");

        // Use the current session player name if not provided
        let playerName = req.body.player_name || app.locals.currentUser || "Anonymous";

        connection.query(
            "INSERT INTO leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?, ?, ?, ?, ?)",
            [playerName, req.body.date_played, req.body.time_start, req.body.time_end, req.body.total_time],
            function (err, results) {
                if (err) {
                    console.error("Error posting score:", err.message);
                    return res.status(500).send("Error posting score");
                }
                console.log(results.affectedRows, "rows affected for POST SCORE");
                res.redirect(getBaseUrl(req) + "/leaderBoard");
            }
        );
    });//end app.post postScore

    /*=====================================
         LEADER BOARD FILTERING
    ======================================*/
    app.post("/leaderBoard", function (req, res){
        let choose = req.body;
        console.log(choose , "filter options");
       
        if(choose.filter_option == 'all_Players'){
            app.locals.filterOption = "all_Players";
        }else if(choose.filter_option == 'your_Scores'){
            app.locals.filterOption = "your_Scores";
        } else {
            app.locals.filterOption = "all_Players";
        }

        res.redirect(getBaseUrl(req) + "/leaderBoard");

    });//end app.post leaderboard filtering



    /*=====================================
            SEND TO ERROR 404 PAGE
    ======================================*/
    app.use(function(req, res) {
        res.status(404).sendFile(path.join(__dirname, "/public/pageNotFound.html"));
    });//end error 404

    /*=====================================
            APP LISTENING ON PORT
    ======================================*/
    const port = process.env.PORT || PORT; // Fix fallback logic
    app.listen(port, function() {
        console.log(`App listening on PORT ${port}`);
    });//end app.listen

});//end connect.connection
