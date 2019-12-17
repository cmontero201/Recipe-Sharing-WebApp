const mongoCollections = require('./collections');
const mongo = require('../node_modules/mongodb');
const { ObjectID } = require('../node_modules/mongodb');
const users = mongoCollections.users;
const posts = mongoCollections.posts;


let exportedMethods = {
    async create(username, firstName, lastName, userEmail, userPassword, userBio) {
        try {
            if (!username || typeof(username) != "string") throw "A name of type string must be provided for your profile!";
            if (!firstName || typeof(firstName) != "string") throw "A name of type string must be provided for your profile!";
            if (!userEmail || typeof(userEmail) != "string") throw "A name of type string must be provided for your profile!";
            if (!userPassword || typeof(userPassword) != "string") throw "A name of type string must be provided for your profile!";
            if (!lastName) { lastName = ""}
            if (!userBio) { userBio = ""}
            
            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";
            const postCollection = await posts();
            if (postCollection == null) throw "Unable to get Posts";

            let newUser = {
                "username": username,
                "firstName": firstName,
                "lastName": lastName,
                "email": userEmail,
                "hashedPassword": userPassword,
                "bio": userBio,
                "posts" : [],
                "likes" : []
            };

            const insertInfo = await userCollection.insertOne(newUser);
            if (insertInfo.insertCount == 0) throw "Unable to add user";

            const newId = insertInfo.insertedId;

            const postsAuthoredById = await postCollection.find({ _id: newId}).toArray();
            if (postsAuthoredById == null) throw "Unable to get post(s)";

            const user = await this.getId(newId);
            if (user == null) throw "Unable to get user";

            user.posts = postsAuthoredById
            const finalUser = await userCollection.updateOne( {_id: newId}, {$set: user} );
            if (finalUser == null) throw "Unable to update user information";
            
            return user;
        } catch (err) {
            return err;
        }
    },

    async getAll() {
        try {
            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";

            const allUsers = await userCollection.find({}).toArray();
            if (allUsers == null) throw "Unable to get users";

            return allUsers;
        } catch (err) {
            return err;
        }
        
    },

    async getId(id) {
        try {
            if (!id) throw "An ID is required to search for a user";
            if (typeof(id) != "string") {
                if (!(id instanceof ObjectID)) {
                    throw "Provided user ID must be of type string or ObjectID";
                }
            }

            const theId = new mongo.ObjectID(id);
            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";

            const checkUserExists = await userCollection.findOne( {_id: theId} );
            if (checkUserExists == null) throw "There is no user associated with the provided user ID";
            
            const thisUser = await userCollection.findOne({ _id: theId });
            if (thisUser === null) throw "There is no user with that ID";
        
            return thisUser;

        } catch (err) {
            return err;
        }
    },

    async removeId(id) {
        try {

            if (!id) throw "An ID is required to search for an user";

            if (typeof(id) != "string") {
                if (!(id instanceof ObjectID)) {
                    throw "Provided user ID must be of type string or ObjectID";
                }
            }

            const theId = new mongo.ObjectID(id);
            const userCollection = await users();
            const postCollection = await posts();
            const checkUserExists = await userCollection.findOne( {_id: theId} );
            if (checkUserExists == null) throw "There is no user associated with the provided user ID";
            console.log("1")
            console.log("2")
      
            if (checkUserExists.posts.length != 0) {
                let postList = checkUserExists.posts;
                for (var ind in postList) {
                    var postId = postList[ind]._id;
                    const removeId = new mongo.ObjectID(postId);
                    
                    try {
                        var thisT = await postCollection.removeOne({ _id: removeId });
                        if (thisT.deletedCount == 0) throw `Could not delete posts associated with user with id ${id}`;
                    } catch (err) {
                        throw err;
                    }
                }
            }
            console.log("3")

            const deletionInfo = await userCollection.removeOne( {"_id": theId} );
            if (deletionInfo.deletedCount == 0) throw `Could not delete user with id of ${id}`;

            deleteInfo = {
                deleted: "true",
                data: checkUserExists
            };

            return deleteInfo;
        } catch (err) {
            return err;
        }
    },

    async update(id, newFirstName, newLastName, newEmail, newBio) { 
        try {
            if (!id) throw "An ID is required to search for an user";
            if (typeof(id) != "string")  {
                if (!(id instanceof ObjectID)) {
                    throw "Provided user ID must be of type string or ObjectID";
                }
            }

            const theId = new mongo.ObjectID(id);
            const userCollection = await users();
            const noUpdate = await this.getId(theId);

            if (!noUpdate) throw "Unable to find user with provided user ID"

            if (!newFirstName || newFirstName.length == 0) { newFirstName = noUpdate.firstName; }
            if (!newLastName || newLastName.length == 0) { newLastName = noUpdate.lastName; }
            if (!newEmail || newEmail.length == 0) { newEmail = noUpdate.email; }
            if (!newBio || newBio.length == 0) { newBio = noUpdate.bio; }

            if (newLastName == " ") { newLastName = "" }
            if (newBio == " ") { newBio = "" }
            
            if (!newFirstName && !newLastName && !newEmail && !newPassword && !newBio) throw "User must update one field of profile";
    
            if (typeof(newFirstName) != "string" || typeof(newFirstName) == "undefined") throw "User names must be of type string";
            if (typeof(newLastName) != "string" || typeof(newLastName) == "undefined") throw "User names must be of type string";
            if (typeof(newEmail) != "string" || typeof(newEmail) == "undefined") throw "User names must be of type string";
            if (typeof(newBio) != "string" || typeof(newBio) == "undefined") throw "User names must be of type string";
            console.log("c")

            const updatedUser = {
                "username": noUpdate.username,
                "firstName": newFirstName,
                "lastName": newLastName,
                "email": newEmail,
                "hashedPassword": noUpdate.hashedPassword,
                "bio": newBio,
                "posts" : noUpdate.posts,
                "likes" : noUpdate.likes
            };
    
            const updatedInfo = await userCollection.updateOne({_id : theId}, {$set: updatedUser});
            if (updatedInfo.modifiedCount === 0) throw 'could not update user successfully';

            let inf = await this.getId(id);
            if (inf == null) throw "Unable to complete update";
                
            return inf;

        } catch (err) {
            return err;
        }
    },

    async checkEmail(email) {
        try {
            if (!email || typeof(email) != "string") {
                throw "Invalid Username" 
            }

            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";

            let userE = await userCollection.findOne( {"email": email });
            if (userE) return userE;

        } catch (err) {
            return err
        }
    },

    async checkUsername(username) {
        try {
            if (!username || typeof(username) != "string") {
                throw "Invalid Username" 
            }

            const userCollection = await users();
            if (userCollection == null) throw "Unable to get users";

            let userU = await userCollection.findOne( {"username": username });
            if (userU) return userU;

        } catch (err) {
            return err
        }

    }
};

module.exports = exportedMethods;










