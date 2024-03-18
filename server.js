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
    host: "localhost",
    port: 3306,
    user: "root",
    password: "butterflyMySql619!"
   });

//CONNECT
connection.connect(function(err) {
    if (err) throw err;

    console.log("CONNECTION  as id " + connection.threadId);

    //DROP DATABASE IF EXISTS
    connection.query("drop database if exists memoryGameDB", function (err, info){
        if(err){
            throw err;
        }
        console.log(info, "info for dropping database");
        console.log(info.affectedRows, "affected rows for dropping database");
    });

    //CREATE DATABASE
    connection.query("create database memoryGameDB", function (err, info){
        if(err){
            throw err;
        }
        console.log(info, "info for creating database");
        console.log(info.affectedRows, "affected rows for creating database");
    });

    //USE DATABASE
    connection.query("use memoryGameDB", function (err, info){
        if(err){
            throw err;
        }
        console.log(info, "info for use memoryGameDB");
        console.log(info.affectedRows, "affected rows for use memoryGameDB");
    });

    //CREATE TABLE
    connection.query("CREATE TABLE user_account " + 
    "(user_name VARCHAR(255) NOT NULL, " +
    "pswd VARCHAR(255) NULL, " +
    "active_status enum('active', 'inactive'), " +
    "PRIMARY KEY (user_name))",
        function (err, info){
        if(err){
            throw err;
        }
        console.log(info, "info for create table user_account");
        console.log(info.affectedRows, "affected rows for create table user_account");
    });

    connection.query("CREATE TABLE leaderboard " +
        "(game_id INT NOT NULL AUTO_INCREMENT, " +
        "user_name VARCHAR(255) NOT NULL, " +
        "game_date varchar(255) NULL, " +
        "game_start varchar(255) NULL, " +
        "game_end varchar(255) NULL, " +
        "game_complete INT NULL, " +
        "PRIMARY KEY (game_id), " +
        "INDEX user_name_idx (user_name ASC) VISIBLE, " +
        "CONSTRAINT user_name " +
          "FOREIGN KEY (user_name) " +
          "REFERENCES memoryGameDB.user_account (user_name) " +
          "ON DELETE NO ACTION " +
          "ON UPDATE NO ACTION)",
        function (err, info){
        if(err){
            throw err;
        }
        console.log(info, "info for create table leaderboard");
        console.log(info.affectedRows, "affected rows for create table leaderboard");
    });


    /*===============================================
        Hardcoding users for presentation purposes
    ================================================*/

    //hardcoding user accounts
    connection.query("INSERT INTO memorygamedb.user_account (user_name, pswd, active_status) VALUES (?,?,?)",['Sarah', 'ILoveu', 'active']);
    connection.query("INSERT INTO memorygamedb.user_account (user_name, pswd, active_status) VALUES (?,?,?)",['Bobby', 'Howdy33', 'active']);
    connection.query("INSERT INTO memorygamedb.user_account (user_name, pswd, active_status) VALUES (?,?,?)",['Jessica', 'Hahaha', 'inactive']);
    connection.query("INSERT INTO memorygamedb.user_account (user_name, pswd, active_status) VALUES (?,?,?)",['Donte', 'funny1', 'inactive']);
    connection.query("INSERT INTO memorygamedb.user_account (user_name, pswd, active_status) VALUES (?,?,?)",['Amy', 'ReallyGurl', 'active']);
    connection.query("INSERT INTO memorygamedb.user_account (user_name, pswd, active_status) VALUES (?,?,?)",['Niecee', 'mine39', 'active']);


    //hardcoding leaderboard scores
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Sarah', '1/12/19', '10:30:00', '10:40:00', '600']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Sarah', '1/13/19', '12:12:00', '12:12:10', '310']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Bobby', '10/13/17', '12:00:00', '12:20:00', '1200']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Bobby', '09/08/18', '11:00:00', '11:30:00', '1800']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Jessica', '09/18/17', '10:00:00', '10:40:00', '2400']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Jessica', '10/28/19', '10:00:00', '10:10:00', '260']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Donte', '10/29/19', '09:00:00', '09:00:40', '340']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Donte', '10/28/19', '10:00:00', '10:50:00', '3000']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Amy', '11/12/18', '10:00:00', '10:55:00', '3300']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Amy', '11/15/19', '12:00:00', '12:56:00', '3360']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Niecee', '11/01/19', '12:12:00', '12:24:00', '720']);
    connection.query("INSERT INTO memorygamedb.leaderboard (user_name, game_date, game_start, game_end, game_complete) VALUES (?,?,?,?,?)", ['Niecee', '08/08/16', '12:00:00', '12:59:00', '3540']);

  
    /*=====================================
        LOCAL EJS TEMPLATE VARIABALES
    ======================================*/
    let users=[];//array to hold user names and passwords
    app.locals.users = users;

    let status;
    let currentUser;
    app.locals.currentUser = currentUser;

    let winners;
    app.locals.winners = winners;

    let filterOption;
    let filter_default;
    app.locals.filter_default = filter_default;

    /*=====================================
        MIDDLEWARE FUNCTIONS AND ROUTES
    ======================================*/
    app.use(function (req, res, next) {
        console.log(`${req.method} request for '${req.url}'`);
        next();
    });

    app.use(express.static("./public"));


    /*=====================================
            GET MEMORY HOME PAGE
    ======================================*/
    app.get("/", function(req, res) {
      
        if(status){
        console.log(status.pswdStat, "the password status in the / GET method"); 
        }
        if(currentUser == undefined){
            currentUser = "Player";
        }

        //select active users
        connection.query("SELECT user_name, pswd from user_account where active_status='active' ",
            function (err, results){
            if(err){
                throw err;
            }
            users = results;
            console.log(users, "ACTIVE USERS when getting HOME PAGE");
            res.render("index.ejs", {
                        currentUser: currentUser,
                        users: users
     
                    });
        });//end connection query select active users
    });//end app.get "/"


    /*=====================================
            GET MEMORY GAME PAGE
    ======================================*/
    app.get("/memoryGame", function(req, res) {
        console.log(currentUser, "the currentUser when GET memory Game page");

        if(currentUser == undefined || currentUser == "Player" ){
            res.status(403).sendFile(path.join(__dirname, "/public/noAccess.html"));
        }else{
            res.render("memoryGame.ejs", {
                currentUser: currentUser
            });
        }
    });//end app.get "/memoryGame"

    /*=====================================
            GET LEADERBOARD PAGE
    ======================================*/
    app.get("/leaderBoard", function(req, res) {
        console.log(filterOption, 'filter options on the leaderboard page');
        console.log(currentUser, 'the current user on the leaderboard page');

        function renderPage() {
            res.render("leaderBoard.ejs", {
                currentUser: currentUser,
                winners: winners,
                filter_default: filterOption
            });
        }

        if(filterOption == 'all_Players' || filterOption == undefined){
            connection.query("SELECT user_name, game_date, game_complete from memoryGameDB.leaderboard order by game_complete",
                function (err, results){
                if(err){
                    throw err;
                }
                winners = results;
                console.log(winners, "this is the results for the leaderboard");
          
                if(currentUser == undefined){
                currentUser = "Player";
            }

                renderPage();
        });//end query selection  
        }else
        if(filterOption == 'active_Players'){
            connection.query("SELECT  l.game_date, a.user_name, l.game_complete FROM memoryGameDB.leaderboard as l inner join memoryGameDB.user_account as a using(user_name) " +
             "where active_status='active' order by l.game_complete",
                function (err, results){
                if(err){
                    throw err;
                }
                winners = results;
                console.log(winners, "this is the results for the leaderboard");
          
                if(currentUser == undefined){
                currentUser = "Player";
            }

                renderPage();
        });//end query selection  
        }
        else

        if(filterOption == 'your_Scores'){
            connection.query("SELECT  l.game_date, a.user_name, l.game_complete FROM memoryGameDB.leaderboard as l inner join memoryGameDB.user_account as a using(user_name) " +
            "where user_name=? order by l.game_complete",[currentUser],
                function (err, results){
                if(err){
                    throw err;
                }
                winners = results;
                console.log(winners, "this is the results for the leaderboard");
                console.log(currentUser, "the current user when filtering your scores only");

                if(currentUser == undefined){
                currentUser = "Player";
            }

                renderPage();
            });//end query selection  
        }//end else if

    });//end app.get "/leaderBoard"


    /*=====================================
            SEND TO ERROR 403 PAGE
    ======================================*/
    app.get("/public", function(req, res) {
        res.status(403).sendFile(path.join(__dirname, "/public/noAccess.html"));
    });//end app.get "/public"


    /*=====================================
            CREATE USER
    ======================================*/
    app.post("/createUser", function(req, res) {
        let createUser = req.body;

        let createdPswd = createUser.createdPswd;
        let newPlayer = createUser.newPlayer;

        //INSERT NEW PLAYER
        connection.query("insert into user_account " +
                      "(user_name, pswd, active_status) " +
                      "values(?,?,'active')", [newPlayer,createdPswd],
            function (err, info){
            if(err){
                throw err;
            }
            console.log(info.affectedRows, "affected rows for inserting created user into user_account");
        });
      
        res.redirect('http://localhost:3000/');
    });//end app.post "/createUser"

    /*=====================================
        PSWD STATUS - DELETE OR PLAY
    ======================================*/
    app.post("/enterPswd", function(req, res) {
        status = req.body;
        console.log(status, "req.body in the enterPswd POST method");
        console.log(status.pswdStat, "the password status");
    
        if(status.pswdStat == "delete"){

            //QUERY THAT UPDATES WITH INACTIVE STATUS
            connection.query("UPDATE user_account SET active_status = 'inactive' WHERE pswd= " + "'" +
                         status.pswdEntered + "'" + " and user_name= " + "'" + status.yourName + "'",
            function (err, results){
            if(err){
                throw err;
            }
            console.log(results, "UPDATE WITH INACTIVE STATUS OK");
        });//end query update

        res.redirect('http://localhost:3000/');
        }else
        if(status.pswdStat == "play"){
            currentUser = status.yourName;

            console.log(currentUser, "CURRENT USER");
            res.redirect('http://localhost:3000/memoryGame'); 
        }//end else if
    });//end app.post "/enterPswd"

    /*=====================================
         POST SCORE
    ======================================*/
    app.post('/postScore', function(req,res) {
        console.log(req.body , "req.body in the GET POST postScore");
        console.log(req.body.player_name , "player name in the POST postScore");

        //QUERY THAT UPDATES WITH INACTIVE STATUS
        connection.query("INSERT INTO leaderboard " +
        "(user_name, game_date, game_start, game_end, game_complete) " + 
        "values(?,?,?,?,?)", [req.body.player_name, req.body.date_played, req.body.time_start, req.body.time_end, req.body.total_time],
            function (err, results){
                if(err){
                    throw err;
                }
                console.log(results.affectedRows, "rows affected for POST SCORE");
        });//end query update

        res.redirect('http://localhost:3000/leaderBoard');
    });//end app.post postScore

    /*=====================================
         LEADER BOARD FILTERING
    ======================================*/
    app.post("/leaderBoard", function (req, res){
        let choose = req.body;
        console.log(choose , "filter options");
       
        if(choose.filter_option == 'all_Players'){
            filterOption = "all_Players";
        }else 
 
        if(choose.filter_option == 'active_Players'){
            filterOption = "active_Players";
        }else

        if(choose.filter_option == 'your_Scores'){
            filterOption = "your_Scores";
        }

        res.redirect('http://localhost:3000/leaderBoard');

    });//end app.post leaderboard filtering

    /*=====================================
         LOG OUT
    ======================================*/
    app.post("/logOut", function(req, res) {

        if(req.body.logOut == "yes"){
            currentUser = "Player";
        }
   
        console.log(req.body, "this is the log out status");
    
        res.redirect('http://localhost:3000/');
    });//end app.post "/logOut"

    /*=====================================
            BACK TO GAME
    ======================================*/
    app.post("/backToGame", function(req, res) {
        currentUser = req.body.current_user;
        
        console.log(req.body, "this is the backtogame status");
    
        res.redirect('http://localhost:3000/memoryGame');
    });//end app.post "/logOut"


    /*=====================================
            SEND TO ERROR 404 PAGE
    ======================================*/
    app.use(function(req, res) {
        res.status(404).sendFile(path.join(__dirname, "/public/pageNotFound.html"));
    });//end error 404


    /*=====================================
            APP LISTENING ON PORT
    ======================================*/
    app.listen(process.env.PORT | PORT, function() {
    console.log("App listening on PORT " + PORT);
    });//end app.listen


});//end connect.connection
