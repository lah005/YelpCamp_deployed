var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")

//Root route
router.get("/", function(req,res){
    res.render("landing")
})

//REGISTER FORM
router.get("/register", function(req,res){
    res.render("register")
})

//REGISTER LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    //Save only username in Database; password saved in another form
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //err.message --> Check by console.log(err)
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        //Log user IN
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds")
        })
    })
})

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login")
 })

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT
router.get("/logout", function(req, res){
    req.logout()
    req.flash("success", "Logged You Out!")
    res.redirect("/campgrounds")
 });

//Import everything that is router
module.exports = router