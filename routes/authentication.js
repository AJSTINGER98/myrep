const express = require("express");
const router = express.Router(); //router is an express property which can be imported to app.js file 
const passport = require("passport");
const User = require("../model/user");

//HOME

router.get("/",function(req , res){
	res.render("home");
});


//==========================================
//AUTHENTICATION//
//==========================================


//register new user
router.get("/register",function(req ,res){
	res.render("register" , {page: 'register'});  //page is used to make sign up icon active
});

//handle new register

router.post("/register",function(req , res){
	User.register(new User({username: req.body.username}) , req.body.password,function(err , user){
		if(err){
			req.flash("error" , err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req , res , function(){
			req.flash("success" , "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});

	});
});

//login form

router.get("/login",function(req ,res){
	res.render("login" , {page: 'login'});  //page is used to make login icon active
});

//handle login

router.post("/login", passport.authenticate("local" ,{
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
}) , function(req ,res){
	
});

//logout route

router.get("/logout",function(req, res){
	req.logout();
	req.flash("success" , "Logged out Successfully");
	res.redirect("/campgrounds");
});


module.exports = router;