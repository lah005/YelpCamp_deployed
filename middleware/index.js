var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All the middleware functions goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error", "Campground not found")
               res.redirect("back");
           }  else {
                // does user own the campground?
                // equals() > Compares value of ID (originally, it's an object so cannot be compared)
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found!")
               res.redirect("/campgrounds");
           }  else {
               // does user own the comment?
               // Comparison with objectID (mongoose)
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //Simply just passing on the key and value into flash; one time thing and then it disappears
    //MUST BE BEFORE REDIRECT
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login");
}

module.exports = middlewareObj;