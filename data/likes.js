const mongoCollections = require("./collections");
const mongo = require('../node_modules/mongodb');
const { ObjectID } = require('../node_modules/mongodb');
const users = mongoCollections.users;
const posts = mongoCollections.posts;


let exportedMethods = {

    async like (userId, postId) {
        try {
            console.log(userId)
            console.log(postId)
            if (!userId || !postId) {
                throw "An user ID and post ID is required";
            }

            if (typeof(userId) != "string") {
                if (!(userId instanceof ObjectID)) {
                    throw "Provided user ID must be of type string or ObjectID";
                }
            }

            if (typeof(postId) != "string") { 
                if (!(postId instanceof ObjectID)) {
                    throw "Provided post ID must be of type string or ObjectID";
                }
            }
            console.log("")

   
            let userCollection = await users();
            let postCollection = await posts();

            let aId = new mongo.ObjectID(userId);
            let pId = new mongo.ObjectID(postId);
            
            const checkUserExists = await userCollection.findOne( {_id: aId} );
            if (checkUserExists == null) throw "There is no user associated with the provided user ID";

            const checkPostExists = await postCollection.findOne( {_id: pId} ); 
            if (checkPostExists == null) throw "There is no post associated with the provided post ID";

            var likes = checkPostExists.numberOfLikes;
            likes++
            checkPostExists.numberOfLikes = likes;
 
            let updatedLikes = await userCollection.updateOne(
                {"_id": aId},
                {$addToSet: {"likes" : pId.toString()}}
            );
            if (updatedLikes.result.n != 1) throw "Unable to like post";

            let updatedNumLikes = await postCollection.updateOne(
                {"_id": pId},
                {$set: checkPostExists}
            );
            if (updatedNumLikes.result.n != 1) throw "Unable to add likes";
    
            return  
        } catch (err) {
            return err;
        }     
    },

    async unlike (userId, postId) {
       try {
           if (!userId) throw "No id provided";
            if (!postId) throw "No postId provided";
            if (typeof(userId) != "string") { 
                if (!(userId instanceof ObjectID)) {
                    throw "Provided ID must be of type string or ObjectID";
                }
            }

            if (typeof(postId) != "string") {
                if (!(postId instanceof ObjectID)) {
                    throw "Provided ID must be of type string or ObjectID";
                }
            }

            const userCollection = await users();
            const postCollection = await posts();

            let aId = new mongo.ObjectID(userId);
            let pId = new mongo.ObjectID(postId);

            const checkUserExists = await userCollection.findOne( {_id: aId} );
            if (checkUserExists == null) throw "There is no user associated with the provided user ID";

            const checkPostExists = await postCollection.findOne( {_id: pId} );
            if (checkPostExists == null) throw "There is no post associated with the provided post ID";

            var likes = checkPostExists.numberOfLikes;
            likes -= 1;
            checkPostExists.numberOfLikes = likes;

            let updatedLikes = await userCollection.updateOne(
                {"_id": aId},
                {$pull: {"likes" : pId.toString()}}
            );
            if (updatedLikes.result.n != 1) throw "Unable to like post";

            let updatedNumLikes = await postCollection.updateOne(
                { "_id": pId },
                { $set: checkPostExists }
            );
            if (updatedNumLikes.result.n != 1) throw "Unable to update likes"
            return 
        } catch (err) {
           return err;
       }
    }
};

module.exports = exportedMethods;
      