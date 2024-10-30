const userController = require("../controllers/user");
const Users = require("../models/users");
const router = require("express").Router();


//GET & POST for Signup


//GET & POST for Login
//Get /login
router.get('/login', (req, res) => {
    res.render('login');
});

//Post /login
router.post('/login', async (req, res) => {
    var userInfo = await req.body; //Get parsed info
    if(!userInfo.username || !userInfo.password) {
        res.render('login', {message: "Please enter all both username and password!"});
        return;
    }

    const user = await Users.findOne({ username: req.body.username });

    if (user) {
        if (user.password == userInfo.password) {
            req.session.user = user;
            console.log(`${user.id} logged in.`);
            res.redirect('/protected_page');
        } else {
            res.render('login', {message: "Invalid credentials!"});
            return;
        }
    } else {
        res.render('login', {message: "User does not exist!"});
    }
});

//Get /logout
router.get('/logout', (req, res) => {
    let user = req.session.user.username;
    req.session.destroy( () => {
        console.log(`${user} logged out.`)
    });
    res.redirect('/login');
});

//Get /protected_page
router.get('/protected_page', (req, res) => {
    res.render('protected_page', {id: req.session.user.id})
});

router.use('/protected_page', (err, req, res, next) => {
    res.redirect('/login');
});

//GET & POST for Forgot Uname
// - input email to retreive uname


//GET & POST for Forgot Pass
// - input uname/email to recover pass

module.exports = router;