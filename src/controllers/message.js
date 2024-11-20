const Message = require('../models/message');

//Initialize socket.io server connection
var socket = io();

//Initialize socket.io on client side
//& emit input message
(function() {
    var  socket  =  io();
    $("form").submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit("chat message", $("#m").val());
        $("#m").val("");
    return  true;
});
})();

//Sumbission & emit to server
$("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#m").val());
    $("#m").val("");
 return  true;
});