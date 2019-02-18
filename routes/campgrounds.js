var express = require("express");
var router = express.Router();
var Campground = require("../Models/Camp"),
    middleware  = require("../middleware");

//INDEX - Show all campgrounds. 
router.get("/", function(req, res){
    Campground.find({}, function (err, allCampgrounds){
        if(err){
            console.log("Error");
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});


//CREATE ROUTE- Colts from the Video. 
router.post("/", middleware.isLoggedIn,  function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, descrip: desc, author: author};
    console.log(req.user);
    // Create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "Campground added");
            res.redirect("/campgrounds");
        }
    });
});



//NEW ROUTE - show form to create new campground. 
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW ROUTE-  more info about ONE campground
router.get("/:id", function(req, res){
    //find campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if(error){
            console.log(error);
        } else {
            console.log(foundCampground.name);
            console.log(foundCampground.author);
            console.log(foundCampground.descrip);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE- Get Edit Form
router.get("/:id/editForm", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/editForm", {campground: foundCampground});
    });
});

//UPDATE ROUTE - Update page after editting
router.put("/:id/", middleware.checkCampgroundOwnership, function(req, res){
    //Find campground using ID. 
    req.body.campground.descrip = req.sanitize(req.body.campground.descrip);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, UpdatedCamp){
        if(error){
            res.send("oops");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground editted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//DELETE ROUTE
router.delete("/:id/", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash("success", "Campground successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;