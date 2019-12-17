const mongoCollections = require("./collections");
const mongo = require('../node_modules/mongodb');
const { ObjectID } = require('../node_modules/mongodb');
const userData = require("./users");
const users = mongoCollections.users;
const posts = mongoCollections.posts;

let exportedMethods = {
    async createPost(userId, title, postDesc, ingredients, directions, media) {
        try {
            if (!userId) throw "You must provide an poster ID"
            if (!title) throw "You must provide a title";
            if (!postDesc) throw "You must provide a description of your recipe";
            if (!ingredients) throw "You must include ingredients for your recipe in your post";
            if (!directions) throw "You must include directions for your recipe in your post";
            if (!media) { 
                media = "" 
            };

            if (typeof(title) != "string" || typeof(postDesc) != "string" || typeof(ingredients) != "string" || typeof(directions) != "string" ) {
                throw "Post titles, descriptions, ingredients, and directions (along with all other content), must be of type String";
            }
            if (typeof(userId) != "string") {
                if (!(userId instanceof ObjectID)) {
                    throw "Author must be of type string or ObjectID";
                }
            }

            if (typeof(media) != "string") throw "You must include an media URL of type String"

            const postCollection = await posts();
            const userCollection = await users();
            const userThatPosted = await userData.getId(userId);
            console.log("THEY POSTED",userThatPosted)

            var theId = new mongo.ObjectID(userId);
            let newPostInfo = {}

            if (media.includes("youtu")) {
                newPostInfo = {
                    "userId": userId,
                    "username": userThatPosted.username,
                    "postDate": new Date().toUTCString(),
                    "postRating": 0,
                    "ratedBy": [],
                    "title": title,
                    "video": media,
                    "postDesc": postDesc,
                    "ingredients": ingredients,
                    "directions": directions,
                    "numberOfLikes": 0,
                    "likedBy": []
                };

            } else {
                newPostInfo = {
                    "userId": userId,
                    "username": userThatPosted.username,
                    "postDate": new Date().toUTCString(),
                    "postRating": 0,
                    "ratedBy": [],
                    "title": title,
                    "image": media,
                    "postDesc": postDesc,
                    "ingredients": ingredients,
                    "directions": directions,
                    "numberOfLikes": 0,
                    "likedBy": []
                };
            }


            const insertInfo = await postCollection.insertOne(newPostInfo);
            if (insertInfo.insertedCount === 0) throw "Unable to add post";

            const newPost = await this.readPost(insertInfo.insertedId);

            let postJSON = {
                "postId": newPost._id.toHexString(),
                "postTitle": title
            };

            if (userThatPosted.posts == undefined) {
                userThatPosted.posts = [];
                const updated = await userCollection.updateOne( {_id: theId}, {$set: userThatPosted} );
                if (updated.insertedCount === 0) throw "Unable to add post";
            } else {
                const updated = await userCollection.updateOne( {_id: theId}, {$addToSet: {posts: postJSON} });
                if (updated.insertedCount === 0) throw "Unable to add post";
            }

            console.log(newPost);
            return newPost;
        } catch (err) {
            return err;
        }
    },

    async readAllPosts() {
        try {
            const postCollection = await posts();

            const allPosts = await postCollection.find({}).sort({_id:-1}).toArray();

            return allPosts;
        } catch (err) {
            return err;
        }
    },

    async readPost(postId) {
        try {
            if (!postId) throw "You must provide an id to search for";
            if (typeof(postId) != "string") {
                if (!(postId instanceof ObjectID)) {
                    throw "Author must be of type string or ObjectID";
                }
            }

            const theId = new mongo.ObjectID(postId);
            const postCollection = await posts();
            const post = await postCollection.findOne({ _id: theId });

            if (post === null) throw "No post with that id";
    
            return post;
        } catch (err) {
            return (err);
        }
    },

    async updatePost(postId, authorId, newTitle, newPostDesc, newIngredients, newDirections, newMedia) {
        try {
            if (!postId || !authorId) throw "You must provide a post and author ID";
            if (typeof(postId || typeof(authorId)) != "string") {
                if (!(postId instanceof ObjectID) || !(authorId instanceof ObjectID)) {
                    throw "IDs must be of type string or ObjectID";
                }
            }

            const theId = new mongo.ObjectID(postId);
            const authId = new mongo.ObjectID(authorId)

            const noUpdate = await this.readPost(theId);
            let updatedPost;

            if (!noUpdate) throw "Unable to find post with given post ID"

            if (!newTitle) { newTitle = noUpdate.title };
            if (!newMedia) { 
                if (noUpdate.video != undefined) {
                    newMedia = noUpdate.video 
                } else {
                    newMedia = noUpdate.image
                }
            };
            if (!newPostDesc) { newPostDesc = noUpdate.postDesc };
            if (!newIngredients) { newIngredients = noUpdate.ingredients };
            if (!newDirections) { newDirections = noUpdate.directions }

            if (!newTitle && !newMedia && !newPostDesc && newIngredients && newDirections) throw "User must update one field of the post";

            const postCollection = await posts();
            if (postCollection == null) throw "Unable to get posts";
            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";
            let checkUserExists = await userCollection.findOne( {_id: authId} )
            if (checkUserExists == null) throw "There is no user associated with the provided user ID";


            if (newMedia.includes("youtu")) {
                updatedPost = {
                    "userId": authId,
                    "username": noUpdate.username,
                    "postDate": noUpdate.postDate,
                    "postRating": noUpdate.postRating,
                    "ratedBy": noUpdate.ratedBy,
                    "title": newTitle,
                    "video": newMedia,
                    "postDesc": newPostDesc,
                    "ingredients": newIngredients,
                    "directions": newDirections,
                    "numberOfLikes": noUpdate.numberOfLikes,
                    "likedBy": noUpdate.likedBy
                };

            } else {
                updatedPost = {
                    "userId": authId,
                    "username": noUpdate.username,
                    "postDate": noUpdate.postDate,
                    "postRating": noUpdate.postRating,
                    "ratedBy": noUpdate.ratedBy,
                    "title": newTitle,
                    "image": newMedia,
                    "postDesc": newPostDesc,
                    "ingredients": newIngredients,
                    "directions": newDirections,
                    "numberOfLikes": noUpdate.numberOfLikes,
                    "likedBy": noUpdate.likedBy
                };
            }

            const updatedInfo = await postCollection.replaceOne(
                { _id: theId },
                updatedPost
            );
            if (updatedInfo.modifiedCount === 0) {
            throw "could not update post successfully";
            }
            let oldPosts = checkUserExists.posts

            for (post of oldPosts) {
                if (post.postId == theId.toString()) {
                    post.postTitle = newTitle
                }
            }
            checkUserExists.posts = oldPosts

            const useInfo = await userCollection.replaceOne(
                { _id: authId },
                checkUserExists
            );

            const finalPost = await this.readPost(theId);
            console.log("FINALL", finalPost)


            return finalPost
        } catch (err) {
            return err;
        }
    },

    async deletePost(postId) {
       try {
           if (!postId) throw "You must provide an id to search for a post";
            if (typeof(postId) != "string") {
                if (!(postId instanceof ObjectID)) {
                    throw "Post ID must be of type string or ObjectID";
                }
            }

            const theId = new mongo.ObjectID(postId);

            const postCollection = await posts();
            if (postCollection == null) throw "Unable to get posts";
            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";

            let postToDelete = await this.readPost(theId);
            if (postToDelete == null) throw "There is no post associated with the provided post ID";
            let authorId = postToDelete.userId;

            const theAuthorId = new mongo.ObjectID(authorId);
            let authorInfo = await userCollection.findOne( {_id: theAuthorId})

            const deletionInfo = await postCollection.removeOne({ _id: theId });
            if (deletionInfo.deletedCount == 0) throw `Could not delete post with id of ${postId}`;

            let postList = authorInfo.posts;
            for (var ind in postList) {
                var id = postList[ind].postId;
                if (id == theId) {
                    postList.splice(ind, 1)
                }
            }

            authorInfo.posts = postList
            const newAuth = await userCollection.updateOne( {_id: theAuthorId} , {$set: authorInfo} );

            let disp = {
                deleted: true,
                data: {
                    "_id": postToDelete._id,
                    "userId": authorInfo._id,
                    "title": postToDelete.title,
                    "postDesc": postToDelete.postDesc
                }
            }
            return disp;
       } catch (err) {
           return err;
       }
    }
};

module.exports = exportedMethods;