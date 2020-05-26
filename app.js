//Require all important packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const Camp = require("./model/campground");
const comment = require("./model/comments");
const User = require("./model/user");
const seedDB = require("./seeds");
const flash = require("connect-flash");

//Import The Routes Code
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const authenticationRoutes = require("./routes/authentication");


//configure Express

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://AbhishekAmann:ghgOLSXlE4uqMEXe@cluster0-ajeew.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname + "/public")); // __dirname represent the current directory in which we are working
//it is used to prevent any potential error that might occur
mongoose.set('useFindAndModify', false);
app.use(methodOverride("_method"));
app.use(flash());	
seedDB();
app.locals.moment = require("moment"); //use moment js to keep track of date of creation
//configure passport

app.use(require("express-session")({
	secret: "Once Again You have no clue what the password is",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Whatever is put in res.local is available to all our templates
//the below code is just a middleware. hence if we dont pass next() the express 
//will end immediately after executing res.locals .
app.use(function(req , res , next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Using the Routes
app.use("/campgrounds" ,campgroundRoutes);  // by adding a parameter "/campgrounds" here we need not use "/campground" in routes.get() or routes.post()
app.use("/campgrounds/:id/comments" ,commentRoutes); 
app.use("/" ,authenticationRoutes);


//Connect to server
app.listen(process.env.PORT||2000, function(){
	console.log("Running");
});
