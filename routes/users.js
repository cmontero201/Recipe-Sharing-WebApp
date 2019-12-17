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
// UPDATE CURRENT USER PROFILE
router.get("/update", checkSession, (req, res) => {
    res.render('partials/updateProfile', { layout:'Dashboard' })
})
router.post("/update", checkSession, async (req, res) => {
    try {
        let updatedInfo = req.body;
        let userId = req.session.user.userId;        

        let updatedUser = await userData.update(userId, updatedInfo.firstName, updatedInfo.lastName, updatedInfo.email, updatedInfo.bio)

        if (updatedUser) {
            let update = await userData.getId(updatedUser._id);
            console.log("UPDATED USER ", update);
            res.redirect('/auth/private/my_profile')
        }

    } catch (err) {
        console.log(err)
        res.redirect(400);
    }
})

//// STILL
// GET OTHER USERS'S POST
router.get("/posts-by/:userId", checkSession, async (req, res) => {
    try {
        let userId = req.params.userId;
        let user = await userData.getId(userId);
        let posts = user.posts
  
        let allPosts = await postData.readAllPosts();
  
        let final =[];
  
        for (var userPost of posts) {
            for (var post of allPosts) {
                if (userPost.postId == post._id) {
                    final.push(post)
                }
            }
        } 
        console.log("POSTSS", final)
  
        res.render('partials/otherProfile', { layout:'Dashboard', userInfo: user, posts: final})

    } catch (err) {
  
    }
});

// DELETE LOGGED IN USERS PROFILE
router.post("/del/:userId", async (req, res) => {
    try {
        let userId = req.params.userId;
        let currentUser = req.session.user.userId;  

        console.log(userId)
        console.log(currentUser)

        if (userId.toString() == currentUser.toString()) {
            console.log("A!!!      ", userId )

            let deletedUser = await userData.removeId(userId)

            if (!deletedUser) throw "User was not deleted"
            res.redirect("/")
        } else {
            throw "Access Denied"
        }
    } catch (err) {
        // res.redirect(400, '/users/' + req.params.id);
    }
})


module.exports = router;