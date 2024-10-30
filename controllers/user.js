// I'm thinking similar to CandyLand controller,
// where this file contains the functions to alter the
// DB rather than having pug/html files do it directly.
// These functions can be called by various routes in '/routes'
// I imagined using 'accounts.js' to handle
// login/signup/forgot password routes, while other .js files can
// handle other various routes

const User = require('../models/users');

const userExists = async (username, email) => {
    query = {user: username, email: email};
    return await User.exists(query);
};

//Request Handling
const createUser = async (req, res) => {
    try {
        //Get the user info from the request body
        const userData = await req.body;
        console.log(`This is the data: ${JSON.stringify(userData)}`);

        let pname = userData.name
        let uname = userData.username;
        let email = userData.email;
        let password = userData.password; 

        if (await candyExists(uname, email)) {
            res.status(400).json({ success: false, message: "User already exists!" });
            return;
        }

        //Create a new task then save
        let db_data = {uname: uname, email: email, password: password};
        await User.create(db_data).then( (createUser) => {
            if (!createdUser)
                return res.status(404).json({ sucesss: false, message: "User creation failed", error: "Unable to get User" });
            //201 -- Created success status
            res.status(201).json({ success: true, createdUser });
        })
        .catch( (error) => {
            res.status(404).json({ success: false, error: error.message });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};

const getUser = async (req, res) => {
    try {
        let uname = req.params.username
        let email = req.params.email
        let query = {user: uname, email: email};

        await User.findOne(query).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({sucess: false, message: "User retrieval failed", error: "Unable to retrieve User"});
            //201 -- created success status
            res.status(201).json({success: true, foundUser});
        })
        .catch( (error) => {
            res.status(404).json({ success: false, error: error.message});
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};

//check sign in
const checkSignIn = (req, res, next) => {
    if(req.session.user){
        return next();      //If session exists, proceed to page
    } else {
        const err = new Error("Not logged in!");
        err.status = 400;
        return next(err);   //Error, trying to access unauthorized page!
    }
};

// Not sure how to do this yet, user should be able to
// Change Uname, Email, and pass just not all at the same time
// So these three functions should be split up

// const updateCandy = async (req, res) => {
//     try {
//         let cname = req.params.company;
//         let bname = req.params.brand;
//         let num = req.params.quanity;
//         let query = {company: cname, brand: bname};
//         let update = {quanity: num};
        
//         await Candy.findOneAndUpdate(query, update, {new:true}).then( (foundCandy) => {
//             if (!foundCandy)
//                 return res.status(404).json({ success: false, message: "Candy update failed", error: "Unable to locate Candy"});
//             //201 -- Update success status
//             res.status(201).json({ success: true, foundCandy });
//         })
//         .catch( (error) => {
//             res.status(404).json({ success: false, error: error.message });
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Internal server error"});
//     }
// };

const deleteUser = async (req, res) => {
    try {
        let uname = req.params.username
        let email = req.params.email
        let query = {user: uname, email: email};
        
        await User.findOneAndDelete(query).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({ success: false, message: "User deletion failed", error: "Unable to locate User"});
            //201 -- Update success status
            res.status(201).json({ success: true, foundUser });
        })
        .catch( (error) => {
            res.status(404).json({ success: false, error: error.message });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};

const getAllUser = async (req, res) => {
    //Get all the data in the model and return it as response
    try {
        User.find().sort('-date').then( (allUsers) => {
            console.log(allUsers);
            res.status(200).render('all',{ success: true, allUsers});
        })
        .catch( (error) => {
            res.status(404).json({ success: false, message: "Can't find ", error });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = {userExists, createUser, getUser, deleteUser, /*updateCandy,*/ getAllUser};