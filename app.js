var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var flash = require("connect-flash")
var seedDB = require("./seeds")
var methodOverride = require("method-override")
//Import Schema
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var User = require("./models/user")
//For authentication
var passport = require("passport")
var LocalStrategy = require("passport-local")

//Requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


//Using MongoDB Atlas (mongoDB stored online)
//In command line: $env:DATABASEURL = 'mongodb://localhost:27017/yelp_camp' 
//Heroku setting: For config vars: Key = DATABASEURL, Value = mongodb+srv://aloh005:GGzuEF9tCcrANPC9@cluster0-zkoo8.mongodb.net/test?retryWrites=true&w=majority
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp'
mongoose.connect(url, {
    useUnifiedTopology:true, 
    useNewUrlParser: true, 
    useCreateIndex: true }).then(function(){   //.then => Executes when previous function is completed
    console.log("Connected to DB!")
}).catch(function(err){                        //.catch => Executes when an error appears
    console.log("ERROR: " + err.message)
})


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
//console.log(_dirname) => directory name of app.js
//express.static helps gain access of public folder 
app.use(express.static(__dirname + "/public"))
//Define method-override as _method
app.use(methodOverride("_method"))
app.use(flash())

//Seed the database
// seedDB()

//Passport Configuration
app.use(require("express-session")({
    secret: "Can be anything here",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Middleware
app.use(function(req, res, next){
    //res would always sent currentUser = req.user for all routes
    res.locals.currentUser = req.user
    //If no value is passed into flash, error OR success = [] (empty array)
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})


//==============
// ROUTES
//==============

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//process.env. = Automatically selects port/IP
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("YELPCAMP STARTED")
})