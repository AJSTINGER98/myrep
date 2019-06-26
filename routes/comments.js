
const express = require("express");
const router = express.Router({mergeParams: true}); //router is an express property which can be imported to app.js file
//if we directly pass  "/campgrounds/:id/comments" from app.js , it will leave an error as id when used over here is left null because here id is variable for every campground 
//in order for that to work we add  {mergeParams: true} so that we can access :id from app.js in this file

const Camp = require("../model/campground");
const comment = require("../model/comments");
const middleware = require("../middleware"); // here index.js is a special file that is by default required by express when we require the directory
//============================================================
//NESTED ROUTING

//Here new and create of comment is nested with campground routes
//because every comments are dependent on their corresponing campgrounds

//NEW - campgrounds/:id/comments/new   GET

//CREATE - campgrounds/:id/comments/   post

	
//NEW COMMENT ROUTE

router.get("/new", middleware.isLoggedIn ,function(req , res){
	Camp.findById(req.params.id,function(err , campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});

	
});

router.post("/", middleware.isLoggedIn ,function(req , res){   
	//We are adding isLoggedIn to the post request as well because one might directly send 
	//a post request without logging in (through postman). Hence we add a isLoggedIn middle to make adding comments more secure


	//lookup campground using id
	Camp.findById(req.params.id, function(err , campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			//create new comment
			comment.create(req.body.comment,function(err ,comment){
				if(err){
					req.flash("error" , "Something went wrong");
					console.log(err);
					res.redirect("/campgrounds");
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;	
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment Added ");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
			//connect new comment to campground
			//redirect campground show page
		}
	});
	

});

//COMMENT EDIT

router.get("/:comment_id/edit" ,middleware.checkCommentOwner, function(req ,res){
	comment.findById(req.params.comment_id, function(err , foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {comment: foundComment , campgroundId: req.params.id});

		}
	});
});

//COMMENT UPDATE

router.put("/:comment_id",middleware.checkCommentOwner, function(req , res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err , updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}	
	});
});

//COMMENT DELETE

router.delete("/:comment_id",middleware.checkCommentOwner, function(req , res){
	comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error","Cannot delete comment");
			res.redirect("back");
		}
		else{
			req.flash("success","Comment Deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;