var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware/index")

//INDEX - show all campgrounds
router.get("/", function(req,res){
    //req.user = shows user logged in; returns null if no login
    //Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user})
        }
    })
})

//NEW -shows form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new")
})

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    //Get data from form
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    //Create new campground and save in DB
    Campground.create(newCampground, function(err,newCampground){
        if(err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    })
})

//Need to be declared after "/campgrounds/new"
//SHOW - shows more information about one campground
router.get("/:id", function(req,res){
    //Populate is so that comments can be viewed (if not it'll just be an ObjectID: check mongo > campgrounds )
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground:foundCampground})
        }
    })
    
})

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});;

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
        if(err){
            console.log(err);
        }
        //REMOVE COMMENTS FROM DB
        //$in operator = Selects documents whose value equals to any value in the specified array
        Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, function(err) {
            if(err){
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
});

//Import everything that is router
module.exports = router