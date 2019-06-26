const mongoose = require("mongoose")
const Camp = require("./model/campground");

const comments = require("./model/comments"); 

var data = [
	{
		Name: "Igneous Station",
		Image: "https://images.unsplash.com/photo-1560274779-5af55b70ad9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		Description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Eu tincidunt tortor aliquam nulla. Faucibus vitae aliquet nec ullamcorper sit. Nullam non nisi est sit amet facilisis magna etiam. Et magnis dis parturient montes nascetur ridiculus. Libero nunc consequat interdum varius sit amet mattis. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Ornare arcu dui vivamus arcu felis bibendum",
		Price: "9.00",
		author: {
			id: "5d135eb2365282338036dbd6",
			username: "Admin"
		}
	},
	{
		Name: "Mount Bahuka",
		Image: "https://images.unsplash.com/photo-1541363452546-84aa064f4806?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		Description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Eu tincidunt tortor aliquam nulla. Faucibus vitae aliquet nec ullamcorper sit. Nullam non nisi est sit amet facilisis magna etiam. Et magnis dis parturient montes nascetur ridiculus. Libero nunc consequat interdum varius sit amet mattis. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Ornare arcu dui vivamus arcu felis bibendum",
		Price: "10.75",
		author: {
			id: "5d135eb2365282338036dbd6",
			username: "Admin"
		}
	},
	{
		Name: "Zilli Rocks",
		Image:"https://images.unsplash.com/photo-1429044605642-68283f617432?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		Description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Eu tincidunt tortor aliquam nulla. Faucibus vitae aliquet nec ullamcorper sit. Nullam non nisi est sit amet facilisis magna etiam. Et magnis dis parturient montes nascetur ridiculus. Libero nunc consequat interdum varius sit amet mattis. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Ornare arcu dui vivamus arcu felis bibendum",
		Price: "12.50",
		author: {
			id: "5d135eb2365282338036dbd6",
			username: "Admin"
		}
	},
	
	{
		Name: "Rear Valley",
		Image:"https://images.unsplash.com/photo-1533664733275-8b7566eb8b4f	?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		Description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Eu tincidunt tortor aliquam nulla. Faucibus vitae aliquet nec ullamcorper sit. Nullam non nisi est sit amet facilisis magna etiam. Et magnis dis parturient montes nascetur ridiculus. Libero nunc consequat interdum varius sit amet mattis. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Ornare arcu dui vivamus arcu felis bibendum",
		Price: "22.00",
		author: {
			id: "5d135eb2365282338036dbd6",
			username: "Admin"
		}
	},
	
]


function seedDB(){   
//Remove all campgrounds

	Camp.deleteMany({},function(err) {   //collection.remove() has been depracated hence use .deleteOne() or .deleteMany() instead
		if(err){
			console.log(err);
		}
		else{
			comments.deleteMany({},function(err){
				if(err){
					console.log(err);
				}
				else {
					console.log("removed comments")
				}
			});
			console.log("removed campgrounds");

			//We move this section of code within the delete callback function because 
			//if we had kept it outside there was no sureity that the remove code will 
			//always be executed first . Instead sometimes the create function might be 
			//executed before remove. Hence to ensure that create() runs after remove()
			//we move the create function within remove callback

			//Add Campgrounds
			data.forEach(function(camp){
				Camp.create(camp,function(err,data){
					if(err){
						console.log(err);
					}
					else{
						console.log("Data Added");

						//Adding comment within the create() callback function has the same 
						//reason as above

						//Add Comment
						comments.create({
							text: "This place is amazing but I wish there was internet",
							author: {
								id: "5d135eb2365282338036dbd6",
								username: "Admin"
							}
						},function(err,comment){
							if(err){
								console.log(err);
							}
							else{
								console.log("comment added");
								data.comments.push(comment);
								data.save();
								
							}
						});
					}
				});
			});
	
		}
		
	 });


}

module.exports = seedDB;