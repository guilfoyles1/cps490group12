const userController = require("../controllers/user");
const Users = require("../models/users");
const router = require("express").Router();


//GET & POST for Signup
router.get('/signup', (req, res) => {  //signup get request
    res.render('signup');
});
router.post('/signup', async (req, res) => { //signup Post request //debugging
    if(!req.body.name || !req.body.password || !req.body.email || !req.body.username){ //make sure all boxes filled in
        res.render('signup', {message: "Please enter both name, username, email, and password!"});
        return;    
    }
    const user = Users.find( (element) => {
        return element.username === req.body.username ;
    });

    // const userExists = asynce(uname) => {

    // }
    if (await Users.exists({username: req.body.username}))

    console.log("<Signup> Find: ", user);
    if (user === undefined || user === null) {
        let newUser = {name: req.body.name, password: req.body.password, email: req.body.email, username: req.body.username}; 
        Users.push(newUser);
        req.session.user = newUser;
        res.redirect('/protected_page'); 
        return;     //create new user, proceed to protected page
    } else {
        res.render('signup', { message: "User Already Exists! Login or choose another user id"});
        return;
    }
});


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