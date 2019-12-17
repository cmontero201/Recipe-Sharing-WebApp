const express = require('../node_modules/express');
const router = express.Router();
const userData = require('../data/users');
const postData = require('../data/posts');

var checkSession = (req, res, next) => {
    if (req.session && req.cookies.AuthCookie) {
        if (req.session.user && req.cookies.AuthCookie) {
            next();
        }
  
    } else {
        res.render('partials/login', { layout:'login', pageHeader: "Login" })
    }    
};

//// DONE
// CREATE NEW POST BY CURRENT USER
router.get('/newPost', (req, res, next) => {
    res.render('partials/newPost', { layout:'Dashboard' })
});
router.post("/newPost", async (req, res) => {
    try {
        let userId = req.session.user.userId;
        let postTitle = req.body.title;
        let postDesc = req.body.desc;
        let postIngredients = req.body.ingredients;
        let postDirections = req.body.directions;
        let postMedia
        if (req.body.video) {
            postMedia = req.body.video;
        } else if (req.body.image) {
            postMedia = req.body.image;
        } else {
            postMedia = "";
        }

        let newPost = await postData.createPost(userId, postTitle, postDesc, postIngredients, postDirections, postMedia);
        console.log("!!!!", newPost)
        if (newPost) {
            let posted = await postData.readPost(newPost._id);
            console.log("CREATED POST ", posted)
            res.redirect('/posts/' + posted._id)
        } 

    } catch (err) {
        res.redirect("/newPost", { message: "Unable to post"})
    }
})

//// DONE
// GET OTHER USERS POST
router.get("/:postId", checkSession, async (req, res) => {
    try {
        let postId = req.params.postId

        let postFound = await postData.readPost(postId)

        if (postFound) {
            let post = postFound;
            post.ingredients = postFound.ingredients.split("\n")
            post.directions = postFound.directions.split("\n")

            res.render('partials/post', { layout:'Dashboard', posts: post} )
        }

    } catch (err) {

    }
})

//// DONE
// UPDATE CURRENT USERS POST
router.get("/update/:id", async (req, res) => {
    res.render('partials/updatePost', { layout:'Dashboard', postId: req.params.id})
});
router.post("/update/:id?", async (req, res) => {
    try {
        let updatedInfo = req.body;
        let userId = req.session.user.userId;
        let media;

        if (updatedInfo.video) {
            media = updatedInfo.video
        } else if (updatedInfo.image) {
            media = updatedInfo.image;
        } else {
            media = "";
        }

        let updatedPost = await postData.updatePost(
            req.params.id, 
            userId, 
            updatedInfo.title, 
            updatedInfo.desc, 
            updatedInfo.ingredients, 
            updatedInfo.directions, 
            media 
        );
        console.log("!!!!!!!!!!!!!!!!", updatedPost)

        if (updatedPost) {
            let update = await postData.readPost(updatedPost._id);
            console.log("UPDATED POST ", update);

            update.ingredients = update.ingredients.split('\n');
            update.directions = update.directions.split("\n");

            console.log("\n\n\n!!!UPDATED POST ", update);

            res.render('partials/post', { layout:'Dashboard', posts: update})
        }

    } catch (err) {
        res.redirect(400, "/auth/dashboard");
    }
})


//// DONE
// DELETE POST BY CURRENT USER
router.post("/del/:id", async (req, res) => {
    try {
        const removePost = await postData.deletePost(req.params.id);
        console.log("REMOVED POST ", removePost);
        res.redirect("/auth/private/my_profile")

    } catch (err) {
        // res.redirect(400, '/posts/' + req.params.id);
    }
})


module.exports = router;