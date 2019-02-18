var Campground = require("../Models/Camp");
var Comment = require("../Models/comments");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
               req.flash("error", "Campground not found");
               res.redirect("/campgrounds");
           }  else {
               // does user own the campground?
               if(foundCampground.author.id.equals(req.user._id)) {
                   next();
                   
               } else {
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You are not the campgroud owner!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment doesn't exist");
               res.redirect("/campgrounds");
           } else {
               // does user own the comment?
               if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
           }
        });
    } else {
        req.flash("error", "You are not the Comment author");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = middlewareObj;