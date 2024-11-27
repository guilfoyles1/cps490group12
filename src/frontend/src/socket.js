import { io } from "socket.io-client";

const URL = "https://group12frontendserver-1bde9aa1d224.herokuapp.com/";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
