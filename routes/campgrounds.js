const express = require("express");
const router = express.Router(); //router is an express property which can be imported to app.js file
const Camp = require("../model/campground");
const comments= require("../model/comments");
const middleware = require("../middleware"); // here index.js is a special file that is by default required when we require the directory

//INDEX ROUTE

router.get("/",function(req , res){

	//req.user contains user data (userID in this case) if he/she is logged in, else it contains the value undefined

	//Get all campground from DB
	Camp.find({},function(err, campgrounds){
		if(err){
			console.log(err);
		}
		else{
				res.render("campgrounds/index" ,{campground:campgrounds , page: "campgrounds"}); //make home page active on navbar
		}
	})


});

//Here we observe the url for the the response 'get' and 'post' is '/campgrounds'. They might appear same but are two completely different urls
//This makes the two routes follow a convention called REST

//CREATE ROUTE

router.post("/",middleware.isLoggedIn,function(req , res){
	var name = req.body.name;
	var img = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}

	var newCamp = {Name: name , Image: img , Description: desc, Price: price , author: author}
	
	//Create a new campground and save to db
	Camp.create(newCamp,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
				res.redirect("/campgrounds"); 
				//The default for the ridirect method is set as a GET request
		}
	})


});

//NEW ROUTE

router.get("/new", middleware.isLoggedIn,function(req ,res){
	res.render("campgrounds/new");
});


//SHOW ROUTE
//The below route should be created after the above route because if the below route us wriiten first then the upper route is not executed
router.get("/:id",function(req , res){
	
	var id = req.params.id;
	Camp.findById(id).populate("comments").exec(function(err,campground){
		//To prevent from crashing by directly by affecting url if foundComment does not exist - visit for further info: https://www.udemy.com/the-web-developer-bootcamp/learn/lecture/6142122#questions/2758358
		if(err || !campground){
			req.flash("error","ERROR: Campground does not exist")
			res.redirect("back");
		}	
		else{
			
			res.render("campgrounds/show", {campground : campground});
		}
	});

	
});

//EDIT CAMPGROUND

router.get("/:id/edit" , middleware.checkCampOwner,function(req ,res){
		
	Camp.findById(req.params.id , function(err , foundCamp){
		if(err){
			res.redirect("/campgrounds");
		}
		else {
			res.render("campgrounds/edit", {campground: foundCamp});
		}
	});
	
});

//UPDATE CAMPGROUND

router.put("/:id", middleware.checkCampOwner,function(req , res){
	//find and update the correct campground
	Camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
		if(err)
			res.redirect("/campgrounds");
		else{
			//redirect to show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});


	
});

//DELETE CAMPGROUND

router.delete("/:id",middleware.checkCampOwner ,function(req ,res){

	Camp.findByIdAndRemove(req.params.id,function(err,campground){
		if(err)
			res.redirect("/campgrounds");
		else
			var commentId = campground.comments;
			deleteComment(commentId);
			res.redirect("/campgrounds");
	});
});

deleteComment = function(commentId){
	commentId.forEach(function(comment){
		comments.findByIdAndRemove(comment, function(err){
			if(err)
				console.log(err);
		});
	});
}



module.exports = router;