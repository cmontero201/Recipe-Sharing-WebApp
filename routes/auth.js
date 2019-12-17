const express = require('../node_modules/express');
const router = express.Router();
const userData = require('../data/users');
const postData = require('../data/posts');
const likesData = require("../data/likes");
const Hash = require('../models/Users').hashPassword;
const compareHash = require('../models/Users').compareHash;

var checkSession = (req, res, next) => {
  if (req.session && req.cookies.AuthCookie) {
      if (req.session.user && req.cookies.AuthCookie) {
          next();
      }

  } else {
      res.redirect('/logout')
  }    
};

//// DONE
// GET DASHBOARD FEED (ALL POSTS)
router.get('/dashboard', checkSession, async (req, res) => {
  try {
    let allPosts = await postData.readAllPosts()
    let postList = []
    for (var post of allPosts) {
      postList.push(post)
      if (postList.length == 10) {
        break;
      }
    }

    res.render('partials/dashboard', { layout:'Dashboard', posts: postList})
  
  } catch (err) {
    
  }
});
router.get("/dashboard/:startInd", checkSession, async (req,res) => {
  try {
    let start = req.params.startInd ;
    let offset = Number(start) + 9;
  
    let allPosts = await postData.readAllPosts()
    let postList = []

    for (i = start; i <= offset; i++) {
      if(allPosts[i]) {
        postList.push(allPosts[i])
      } else {
        continue
      }
    }    
  
    res.send({layout: "/partials/dashboard", posts: postList})
  } catch (err) {

  }

})


//// DONE
// SEARCH ALL POST TITLES/INGREDIENTS FOR SEARCH PARAM
router.post("/search", checkSession, async (req,res) => {

  try {
    if (req.session.user) {
      let searchParam = req.body.search;
      let results = new Array();
      let data = await postData.readAllPosts();
      let count = 0;
  
      for (var ind in data) {
        var ingredients = data[ind].ingredients.toLowerCase();
        var titles = data[ind].title.toLowerCase();

        if (ingredients.includes(searchParam.toLowerCase()) || titles.includes(searchParam.toLowerCase())) {
          count ++;
          results.push(data[ind]);
        }
      }
      res.render('partials/dashboard', { layout:'Dashboard', posts: results})

    } else {
      res.redirect("/logout")
    }

  } catch (err) {
    res.status(400).render("layouts/Login", {error: { status:400,message:"No results.." } })
  }

});

//// DONE
// GET ALL POSTS LIKED BY CURRENT USER
router.get("/likes", checkSession, async (req, res) => {
  try {
    let userId = req.session.user.userId;
    let user = await userData.getId(userId);
    let likes = user.likes

    let allPosts = await postData.readAllPosts();

    let final =[];

    for (var userLike of likes) {
      for (var post of allPosts) {
        if (userLike == post._id) {
          final.push(post)
        }
      }
    }

    res.render('partials/dashboard', { layout:'Dashboard', posts: final})

  } catch (err) {
    res.status(400).render("layouts/Login", {error: { status:400,message:"No results.." } })
  }
})


//// DONE
// VIEW CURRENT USER'S PROFILE
router.get("/private/my_profile", checkSession, async (req, res) => {
  try {
    var userId = req.session.user.userId;
    let allPosts = await postData.readAllPosts();
    let user = await userData.getId(userId);
  
    let userPosts = user.posts
    console.log(userPosts)
    let final = [];
  
    for (var post of userPosts) {
      for (var aPost of allPosts) {
        if (post.postId == aPost._id) {
          final.unshift(aPost)
        }
      }
    }
  
    res.render('partials/profile', { layout:'Dashboard', userInfo: user, posts: final})
    return;
  } catch (err) {
    res.status(400).render("layouts/Login", {error: { status:400,message:"No results.." } })
  }

});

//// DONE
// ADD POST TO CURRENT USER'S LIKES
router.post("/addLike/:id", checkSession, async (req, res) => {
  try {
    var userId = req.session.user.userId;
    let currentLikes = (await userData.getId(userId, req.params.id)).likes
    console.log(currentLikes)

    if (currentLikes.includes(req.params.id)) {
      let removeLike = await likesData.unlike(userId, req.params.id)
      res.redirect('/auth/likes')

    } else {
      console.log("THERE")

      let addLike = await likesData.like(userId, req.params.id)
      res.redirect('/auth/likes')
    }

  } catch (err) {
    res.status(400).render("layouts/Login", {error: { status:400,message:"No results.." } })
  }
})



module.exports = router;