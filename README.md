# Messenger App (CPS 490 Group 12)

## Project Overview
This real-time Messenger Application was developed for Capstone 1 using Node.js, Express, Socket.io, and MongoDB. It supports both private and group chats with secure user authentication and a user-friendly interface.

## Features
- Real-time messaging between users
- Group chat functionality
- User authentication and session management
- Password hashing for security
- RESTful API for backend/frontend communication
- Dynamic EJS views and interactive UI

## Authors
- Shayna Guilfoyle  
- Zach Spears  
- Paras Rajan
- Abby Foppe

## Prerequisites
- Node.js v14+  
- npm v6+  
- MongoDB (local instance or URI)

## Installation & Setup

```bash
git clone https://github.com/guilfoyles1/cps490group12
cd cps490group12
npm install
```

Create a `.env` file in the `src/` directory with the following content:
```
PORT=3000
MONGODB_URI=<your-mongodb-uri>
SESSION_SECRET=<your-session-secret>
```

To start the app:
```bash
cd src
nodemon index.js
```

## Project Structure

```
cps490group12/
├── src/
│   ├── config/         # DB config
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── public/         # Static files
│   ├── views/          # EJS templates
│   ├── routes.js       # Main routes
│   └── index.js        # App entry point
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

## Dependencies
- express  
- socket.io  
- mongodb  
- bcrypt  
- dotenv  
- morgan  
- cors  
- ejs  
- express-session  

## Usage
- Users register/login with email + password
- Access protected account and chat pages
- Create or join 1:1 and group chat rooms
- Update profile info
- Post to a shared global feed

## Screenshots

### Homepage After Logging In
![Homepage](figures/HomePage.png)

### Protected Page After Clicking Account Button
![Account](figures/Account_ProtectedPage.png)

### Chat Page After Clicking Chats
![Chat](figures/ChatPage.png)

### Chat Room After Creating Chat
![Chatroom](figures/ChatRoom.png)

### Post Feed After Clicking Open Chat
![Posts](figures/PostFeed.png)

### Update Page After Clicking Update User Info
![Update](figures/UpdateInfo.png)

## Status
This app was previously deployed to Heroku (now inactive due to Heroku's free tier shutdown).  
All core functionality can be run locally via the setup instructions above.

## Future Improvements
- Add a persistent navigation bar
- Support profile pictures and enhanced profiles
- Enable message reactions (emoji support)
- Add file/media sharing
- Implement user search

## License
This project is licensed under the ISC License.

## Contact
- Shayna Guilfoyle – guilfoyles1@udayton.edu  
- Zach Spears – spearsz2@udayton.edu

