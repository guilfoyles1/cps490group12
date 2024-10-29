const router = require("express").Router();
//const userController = require("../controllers/user");

//C for Create: HTTP POST
//R for Read: HTTP GET
//U for Update: HTTP PUT
//D for Delete: HTTP DELETE

//Set PUG use
// router.set('view engine', 'pug');
// router.set('views', './views');

//Handle the get route
router.get("/", (req, res) => {
    res.render('home_page');
});

//Handle the post route


//Handle the put route


//Handle the delete route


module.exports = router;