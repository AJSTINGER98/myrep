	const mongoose = require("mongoose");
 
 //SCHEMA SETUP
var campSchema = new mongoose.Schema({
	Name: String,
	Image: String,
	Description: String,
	Price: String,
	createdAt: {
		type: Date ,
		default: Date.now
	},
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "comments"
	}]
});

module.exports= mongoose.model("Camp",campSchema);