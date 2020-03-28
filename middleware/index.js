const Camp = require("../model/campground");
const comment= require("../model/comments");


var middlewareObject = {};


//middleware
middlewareObject.isLoggedIn = function(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error" , "You need to be logged in to do that");
	res.redirect("/login");
};


middlewareObject.checkCampOwner = function(req , res , next) {
	//is user logged in
	if(req.isAuthenticated()){
		//search campground 
		Camp.findById(req.params.id , function(err , foundCamp){
			
			//(To prevent from crashing by directly by affecting url) if campground does not exist  -  visit for further info: https://www.udemy.com/the-web-developer-bootcamp/learn/lecture/6142122#questions/2758358
			if(err || !foundCamp){
				req.flash("error" , "error: campground not found");
				res.redirect("back");  //redirect back to the previous page
			}
			else {

				//does user own the campground?
				if(foundCamp.author.id.equals(req.user._id)){        //here we dont use 'if(foundCamp.author.id ==== req.user._id)' because 'foundCamp.author.id' is of type ObjectId while 'req.user._id' is of type String
					next();
				}
				//if not then
				else {
					req.flash("error" , "You don't have permission to do that");
					res.redirect("back");
				}    
			}
		});	
	}
	//if not then
	else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
	
};

//check comment ownership

middlewareObject.checkCommentOwner = function(req , res , next){
	//is user logged in
	if(req.isAuthenticated()){
		//search campground 
		comment.findById(req.params.comment_id , function(err , foundComment){

			//To prevent from crashing by directly by affecting url if foundComment does not exist - visit for further info: https://www.udemy.com/the-web-developer-bootcamp/learn/lecture/6142122#questions/2758358
			if(err || !foundComment || !foundComment.author.id){
				req.flash("error", "ERROR : Comment not found.");
				res.redirect("back");  //redirect back to the previous page
			}
			else {

				if(!foundComment){
				 	req.flash("error", "ERROR : Comment not found.");
	                return res.redirect("back");	
				}

				//does user own the campground?
				if(foundComment.author.id.equals(req.user._id)){        //here we dont use 'if(foundComment.author.id ==== req.user._id)' because 'foundComment.author.id' is of type ObjectId while 'req.user._id' is of type String
					next();
				}
				//if not then
				else {
					req.flash("error" , "You don't have permission to do that");
					res.redirect("back");
				}    
			}
		});	
	}
	//if not then
	else{
		req.flash("error" , "You need to be logged in to do that");
		res.redirect("back");
	}
};

module.exports = middlewareObject;