var express = require("express"),
    router  = express.Router(),
    passport= require("passport"),
    User    = require("../Models/user");

//Root Route
router.get("/", function(req, res){
    res.render("Landing");
});


router.get("/secret", function(req, res){
    res.render("secret");
});

// show registration form
router.get("/register", function(req, res){
    res.render("authCamp/register");
});

//Handle User Registration
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("authCamp/login");
});
// lOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
   
   //logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;