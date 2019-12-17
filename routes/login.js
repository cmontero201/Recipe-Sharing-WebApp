const express = require('../node_modules/express');
const router = express.Router();
const userData = require('../data/users');
const Hash = require('../models/Users').hashPassword;
const compareHash = require('../models/Users').compareHash;

var checkSession = (req, res, next) => {
    if (req.session && req.cookies.AuthCookie) {
        if (req.session.user && req.cookies.AuthCookie) {
            next();
        }

    } else {
        res.redirect('/login')
    }    
};


router.get('/', checkSession, (req,res) => {
    return
});


router.get('/signup', (req,res) => {
    res.render('partials/signup', { layout:'Login', pageHeader: "Signup" })
});
router.post('/signup', async (req, res) => {
    try {
        signupInfo = req.body;
        let usersE = await userData.checkEmail(signupInfo.email)
        let usersU = await userData.checkUsername(signupInfo.username)

        if (usersE) {
            res.render("partials/signup", { layout:'Login', pageHeader: "Login" }, { "message": "That email is currently associated with another user.." } ); 
            return
        } 
        if (usersU) {
            res.render("partials/signup", { layout:'Login', pageHeader: "Login" }, { "message": "That username is currently associated with another user.." } ); 
            return
        }

        if (signupInfo.password1 == signupInfo.password2) {
            const hashed = await Hash(signupInfo.password1);

            let addUser = await userData.create(signupInfo.username.toLowerCase().trim(), 
                                                signupInfo.firstName.charAt(0).toUpperCase().trim() + signupInfo.firstName.substring(1).toLowerCase().trim(), 
                                                signupInfo.lastName.charAt(0).toUpperCase().trim() + signupInfo.lastName.substring(1).toLowerCase().trim(), 
                                                signupInfo.email,
                                                hashed, 
                                                signupInfo.bio
            );

            if (!addUser) throw "COULDNT ADD"
            console.log("ADDED USER: ", addUser._id, "  ", addUser.username, "   ", addUser.firstName, "    ", addUser.lastName)

            res.redirect('auth/dashboard');
        }

    } catch (err) {
        console.log(res.status(400).json( {error : err} ));
        console.log(err)
    }
});



router.get('/login', (req,res) => {
    res.render('partials/login', { layout:'Login'})
})
router.post('/login', async (req, res) => {
    try {
       let username = req.body.username.toLowerCase().trim();
       let password = req.body.password.trim();

       let usersE = await userData.checkEmail(username)
       let usersU = await userData.checkUsername(username)

       if (username.includes('@')) {
           let userEmail = username;
           if (userEmail == usersE.email) {
               let confirmPass = await compareHash(password, usersE.hashedPassword)
               if (confirmPass) {
                   req.session.user = { "userId": usersE._id, "username": usersE.username, "password": usersE.hashedPassword };
                   res.redirect('auth/dashboard');
                   return;
               }
           }

        } else {
            if (username == usersU.username) {
                let confirmPass = await compareHash(password, usersU.hashedPassword)
                if (confirmPass) {
                    req.session.user = { "userId": usersU._id, "username": usersU.username, "password": usersU.hashedPassword };
                    res.redirect('/auth/dashboard');
                    return;
                }
            }
        }
    } catch (err) {
        res.render("partials/login", { layout:'Login', pageHeader: "Login" }, { "message": "Incorrect username/password" } ); 
    }
});

router.get('/logout', (req, res) => {
    if (req.session.user) {
        res.clearCookie("AuthCookie", { domain: "localhost", path: "/" });
        res.redirect('/');
        
    } else {
        res.redirect('/');
    }
});


module.exports = router;
