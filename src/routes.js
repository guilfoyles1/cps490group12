const router = require("express").Router();
const userRouter = require("../src/routes/accounts");
const messageRouter = require("../src/routes/message");
// Allow communication between message server and website
const { createProxyMiddleware } = require('http-proxy-middleware');

// C for Create: HTTP POST
// R for Read: HTTP GET
// U for Update: HTTP PUT
// D for Delete: HTTP DELETE

// Handle '/' loading home page
router.get("/", (req, res) => {
    // Check user logged in and pass username to pug
    if (req.session && req.session.user) {
        username = req.session.user.username;
    } else {
        username = '';
    }
    res.render('home_page', {
        isLoggedIn: req.session && req.session.user,
        username
    });
});


// Tell routes.js to use accounts.js for handling user account info
router.use('/', userRouter);

//Adds message routes
router.use('/', messageRouter);

// Connects to message server
router.use('/', createProxyMiddleware({
    target: 'https://group12frontend-defd760e75d0.herokuapp.com/',
    changeOrigin: true,
    ws: true, // Enables websocket communication
    pathRewrite: { '^/chat': '' },
    // Sends session info between servers
    onProxyReq: (proxyReq, req) => {
        // Forward session cookie to the target server
        if (req.headers.cookie) {
            proxyReq.setHeader('Cookie', req.headers.cookie);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        // Send target server cookies back to the client
        const setCookieHeaders = proxyRes.headers['set-cookie'];
        if (setCookieHeaders) {
            res.setHeader('set-cookie', setCookieHeaders);
        }
    }
}));

// General error handling middleware
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong!"); // Customize as needed
});

module.exports = router;