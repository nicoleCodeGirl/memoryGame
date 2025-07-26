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

// Add base path support for subdirectory deployment
const BASE_PATH = process.env.BASE_PATH || '';

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
var connection;

// Check if we have a DATABASE_URL (Railway) or separate connection params (local)
if (process.env.DATABASE_URL) {
    // Railway provides a full connection URL
    connection = mysql.createConnection(process.env.DATABASE_URL);
} else {
    // Local development with separate parameters
    connection = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "butterflyMySql619!",
        database: process.env.DB_NAME || "memoryGameDB"
    });
}

//CONNECT
connection.connect(function(err) {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        console.error("Please ensure MySQL is running and the connection details are correct");
        console.error("Starting server without database functionality...");
        
        // Set up app without database
        setupAppWithoutDatabase();
        return;
    }
    console.log("Connected as id " + connection.threadId);

    // Extract reusable query function with better error handling
    const executeQuery = async (query, params = []) => {
        try {
            const [results] = await connection.promise().query(query, params);
            return results;
        } catch (err) {
            console.error("Database query error:", err.message);
            console.error("Query:", query);
            console.error("Parameters:", params);
            throw err;
        }
    };

    // Use async/await for better readability with comprehensive error handling
    (async () => {
        try {
            console.log("Starting database setup...");
            
            // For Railway, the database already exists, so we don't need to create/drop it
            if (!process.env.DATABASE_URL) {
                // Only for local development
                await executeQuery("DROP DATABASE IF EXISTS memoryGameDB");
                console.log("Database dropped successfully");

                await executeQuery("CREATE DATABASE memoryGameDB");
                console.log("Database created successfully");

                await executeQuery("USE memoryGameDB");
                console.log("Using memoryGameDB");
            } else {
                console.log("Using Railway MySQL database");
            }

            await executeQuery(`
                CREATE TABLE leaderboard (
                    game_id INT NOT NULL AUTO_INCREMENT,
                    user_name VARCHAR(255) NOT NULL,
                    game_date VARCHAR(255) NULL,
                    game_start VARCHAR(255) NULL,
                    game_end VARCHAR(255) NULL,
                    game_complete INT NULL,
                    PRIMARY KEY (game_id),
                    INDEX user_name_idx (user_name ASC)
                )
            `);
            console.log("Table leaderboard created successfully");

            // Hardcoding some sample leaderboard scores
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
            console.log("Sample leaderboard data inserted successfully");

        } catch (err) {
            console.error("Critical error during database setup:", err.message);
            console.error("The application may not function properly without a working database");
            console.error("Please check your MySQL installation and connection settings");
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
    
    // Set up the rest of the app
    setupApp();

// Function to set up app without database
function setupAppWithoutDatabase() {
    console.log("Setting up app without database functionality...");
    
    /*=====================================
        LOCAL EJS TEMPLATE VARIABALES
    ======================================*/
    app.locals.users = [];
    app.locals.status = null;
    app.locals.currentUser = "Player";
    app.locals.winners = [];
    app.locals.filterOption = null;
    
    // Set up the rest of the app
    setupApp();
}

// Function to set up the main application
function setupApp() {

    /*=====================================
        MIDDLEWARE FUNCTIONS AND ROUTES
    ======================================*/
    app.use(function (req, res, next) {
        console.log(`${req.method} request for '${req.url}'`);
        next();
    });

    app.use(BASE_PATH + '/', express.static("./public"));

    /*=====================================
        Error Handling Middleware
    ======================================*/
    app.use((err, req, res, next) => {
        console.error("Unhandled error occurred:");
        console.error("Error:", err.message);
        console.error("Stack:", err.stack);
        console.error("Request URL:", req.url);
        console.error("Request method:", req.method);
        console.error("Request body:", req.body);
        
        // Don't expose internal errors to the client
        res.status(500).json({
            error: "Internal server error",
            message: "Something went wrong! Please try again later.",
            timestamp: new Date().toISOString()
        });
    });

    // Replace hardcoded URLs with dynamic URLs
    const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

    /*=====================================
            GET MEMORY HOME PAGE
    ======================================*/
    app.get(BASE_PATH + "/", function (req, res) {
        res.render("index.ejs", {
            currentUser: "Player"
        });
    });//end app.get "/"

    /*=====================================
            GET MEMORY GAME PAGE
    ======================================*/
    app.get(BASE_PATH + "/memoryGame", function(req, res) {
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
    app.get(BASE_PATH + "/leaderBoard", function(req, res) {
        console.log(app.locals.filterOption, 'filter options on the leaderboard page');
        console.log(app.locals.currentUser, 'the current user on the leaderboard page');

        function renderPage() {
            res.render("leaderBoard.ejs", {
                currentUser: app.locals.currentUser || "Player",
                winners: app.locals.winners || [],
                filter_default: app.locals.filterOption || "all_Players"
            });
        }

        function handleDatabaseError(err, operation) {
            console.error(`Database error during ${operation}:`, err.message);
            console.error("Query details:", err.sql);
            app.locals.winners = [];
            app.locals.filterOption = "all_Players";
            renderPage();
        }

        if (!connection) {
            // No database available, show empty leaderboard
            console.log("No database available, showing empty leaderboard");
            app.locals.winners = [];
            app.locals.filterOption = "all_Players";
            renderPage();
            return;
        }
        
        if(app.locals.filterOption == 'all_Players' || app.locals.filterOption == undefined){
            connection.query("SELECT user_name, game_date, game_complete from memoryGameDB.leaderboard order by game_complete",
                function (err, results){
                if(err){
                    return handleDatabaseError(err, "fetching all scores");
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
                        return handleDatabaseError(err, "fetching user scores");
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
                        return handleDatabaseError(err, "fetching all scores (fallback)");
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
                    return handleDatabaseError(err, "fetching all scores (default)");
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
    app.get(BASE_PATH + "/api/photos", function(req, res) {
        const fs = require('fs');
        const gameCardsDir = path.join(__dirname, 'public', 'photos', 'gameCards');
        
        // Check if directory exists first
        if (!fs.existsSync(gameCardsDir)) {
            console.error("Game cards directory not found:", gameCardsDir);
            return res.status(404).json({ 
                error: "Game cards directory not found",
                message: "Please ensure the gameCards folder exists in public/photos/"
            });
        }
        
        fs.readdir(gameCardsDir, (err, files) => {
            if (err) {
                console.error("Error reading gameCards directory:", err);
                return res.status(500).json({ 
                    error: "Failed to load photos",
                    message: "Unable to read game cards directory"
                });
            }
            
            // Filter for image files - any image file is valid for the game
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            });
            
            if (imageFiles.length === 0) {
                console.warn("No image files found in gameCards directory");
                return res.status(404).json({ 
                    error: "No game cards found",
                    message: "Please add image files (.jpg, .jpeg, .png, .gif, .webp) to the gameCards folder"
                });
            }
            
            // Create photo objects with metadata
            const photos = imageFiles.map(file => ({
                filename: file,
                path: `/photos/gameCards/${file}`,
                name: path.parse(file).name
            }));
            
            console.log(`Successfully loaded ${photos.length} game cards`);
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
    app.post(BASE_PATH + "/startGame", function(req, res) {
        let playerName = req.body.playerName;
        
        // Validate player name
        if (!playerName || playerName.trim() === "") {
            console.warn("Attempt to start game with empty player name");
            return res.status(400).json({
                error: "Player name is required",
                message: "Please enter your name to start the game"
            });
        }
        
        // Sanitize player name
        playerName = playerName.trim();
        
        // Check for reasonable length
        if (playerName.length > 50) {
            console.warn("Player name too long:", playerName.length, "characters");
            return res.status(400).json({
                error: "Player name too long",
                message: "Please use a name with 50 characters or less"
            });
        }
        
        // Check for potentially problematic characters
        const invalidChars = /[<>\"'&]/;
        if (invalidChars.test(playerName)) {
            console.warn("Player name contains invalid characters:", playerName);
            return res.status(400).json({
                error: "Invalid characters in name",
                message: "Please use only letters, numbers, and basic punctuation"
            });
        }
        
        // Store the player name in session
        app.locals.currentUser = playerName;
        
        console.log("Starting game for player:", playerName);
        res.redirect(getBaseUrl(req) + "/memoryGame");
    });//end app.post "/startGame"



    /*=====================================
         POST SCORE
    ======================================*/
    app.post(BASE_PATH + '/postScore', function(req, res) {
        console.log(req.body, "req.body in the POST postScore");

        // Validate required fields
        const requiredFields = ['date_played', 'time_start', 'time_end', 'total_time'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.error("Missing required fields for score posting:", missingFields);
            return res.status(400).json({ 
                error: "Missing required fields", 
                missing: missingFields 
            });
        }

        // Validate total_time is a number
        const totalTime = parseInt(req.body.total_time);
        if (isNaN(totalTime) || totalTime < 0) {
            console.error("Invalid total_time value:", req.body.total_time);
            return res.status(400).json({ 
                error: "Invalid total time value" 
            });
        }

        // Use the current session player name if not provided
        let playerName = req.body.player_name || app.locals.currentUser || "Anonymous";
        
        // Sanitize player name
        playerName = playerName.trim().substring(0, 255); // Limit length and trim whitespace

        if (!connection) {
            // No database available, just redirect to leaderboard
            console.log("No database available, score not saved");
            res.redirect(getBaseUrl(req) + BASE_PATH + "/leaderBoard");
            return;
        }
        
        connection.query(
            "INSERT INTO leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?, ?, ?, ?, ?)",
            [playerName, req.body.date_played, req.body.time_start, req.body.time_end, totalTime],
            function (err, results) {
                if (err) {
                    console.error("Error posting score:", err.message);
                    console.error("Score data:", {
                        playerName,
                        date_played: req.body.date_played,
                        time_start: req.body.time_start,
                        time_end: req.body.time_end,
                        total_time: totalTime
                    });
                    return res.status(500).json({ 
                        error: "Failed to save score",
                        message: "Unable to save your score to the leaderboard"
                    });
                }
                console.log(results.affectedRows, "rows affected for POST SCORE");
                res.redirect(getBaseUrl(req) + BASE_PATH + "/leaderBoard");
            }
        );
    });//end app.post postScore

    /*=====================================
         LEADER BOARD FILTERING
    ======================================*/
    app.post(BASE_PATH + "/leaderBoard", function (req, res){
        let choose = req.body;
        console.log(choose , "filter options");
       
        if(choose.filter_option == 'all_Players'){
            app.locals.filterOption = "all_Players";
        }else if(choose.filter_option == 'your_Scores'){
            app.locals.filterOption = "your_Scores";
        } else {
            app.locals.filterOption = "all_Players";
        }

        res.redirect(getBaseUrl(req) + BASE_PATH + "/leaderBoard");

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
    const server = app.listen(port, function() {
        console.log(`App listening on PORT ${port}`);
        console.log(`Server started at ${new Date().toISOString()}`);
    });//end app.listen

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully...');
        server.close(() => {
            console.log('Server closed');
            if (connection) {
                connection.end((err) => {
                    if (err) {
                        console.error('Error closing database connection:', err);
                    } else {
                        console.log('Database connection closed');
                    }
                    process.exit(0);
                });
            } else {
                process.exit(0);
            }
        });
    });

    process.on('SIGINT', () => {
        console.log('SIGINT received, shutting down gracefully...');
        server.close(() => {
            console.log('Server closed');
            if (connection) {
                connection.end((err) => {
                    if (err) {
                        console.error('Error closing database connection:', err);
                    } else {
                        console.log('Database connection closed');
                    }
                    process.exit(0);
                });
            } else {
                process.exit(0);
            }
        });
    });

}//end setupApp function
});//end connect.connection
