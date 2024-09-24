# Sprint 1 Document

## Group 12

#### Abby, Paras, Shay, Zach


## **Use Case #1**

**Use Case Name:** Login

*Actors:* 
* User: person interacting with the messenger app
* System

*Description:* 
Log in to the messenger system

*Triggering Event:*
User interacts with website to initialize login

*Steps:*
1. User visits website
2. User clicks on login button
3. User enters information
4. System checks input information with database
5. System grants user access to their account

*Preconditions:*
* User has an account

*Postconditions:*
* User input correct login information

**Login Sequence Diagram**

<img src="/figures/LoginCommDiagram.drawio.png">




## **Use Case #2**

**Use Case Name:** Send message

*Actors:* 
* User

*Description:* 
Sending a message 

*Triggering Event:* 
The user opens the application

*Steps:*
1. The user selects the receiver 
2. The user types a message 
3. The user uses the “Send” key to send the message

*Preconditions:* 
* Recipient account exists
  
*Postcondition:*  
* Confirmation message (that says that message has been delivered or not)

**Sending a message Sequence Diagram**
<img src="/figures/ss-capstone1-1.png">

## **Use Case #3**

**Use Case Name:** Send message to user

*Actors:* 
* User sending message
* Recipient
* Messenger system

*Description:* 
Message system sends message to recipient 

*Triggering Event:* 
User sends message

*Steps:*
1. User selects recipient
2. User types message in messaging interface
3. User users “Send” key to send message
4. The system sends the message to recipient’s messaging interface
5. The system saves the message in the database
6. Recipient acknowledges message
7. System notifies user that message has been sent

*Preconditions:* 
* User has an account
* Recipient has an account

*Postconditions:* 
* message is saved in both users’ message history




## **Use Case #4**

**Use Case Name:** Receive message

*Actors:* 
* Sender: The user who sends the message.
* Recipient: The user who receives the message.
* Messenger System: The system responsible for processing messages, delivering them to recipients and managing notifications.

*Description:* 
The system delivers a message to the intended recipient when a message is sent to them, and notifications are sent regardless of recipient’s online status.

*Triggering Event:* 
Another user sends a message to the recipient.

*Steps:*
1. Sender sends a message.
2. Messenger system receives the message and identifies the recipient’s device.
3. Messenger system checks the recipient’s status (online/ offline).
4. If the recipient is online, the system delivers the message and displays it in the chat interface.
5. If the recipient is offline, the Messenger system pushes the message to the notification service on the recipient’s device.
6. The message is stored in the system’s message history.

*Preconditions:* 
* The recipient is registered and logged into the Messenger system, or at least has the app installed and registered to receive notifications.

*Postconditions:* 
* The message is delivered in real-time (or through the notification system if the recipient is offline) and stored in the message history. 

**Receive Message Sequence Diagram**
<img width="833" alt="Screen Shot 2024-09-22 at 7 37 50 PM" src="https://github.com/user-attachments/assets/b0cf86aa-0e5e-4269-9b25-914c6890cbe2">



## **Activity Flow Diagrams**

**Use Case 1**


**Use Case 2**
<img src="/figures/ss-capstone activity.png">

**Use Case 3**


**Use Case 4**



<img width="381" alt="Screen Shot 2024-09-23 at 6 21 13 PM" src="https://github.com/user-attachments/assets/2797966e-eb23-4249-99cb-76bd01cbd88f">


## **Trello Progress Screen Shots**

**Beginning**
<img width="1206" alt="Beginning Trello Board SC" src="https://github.com/user-attachments/assets/dc45b46b-03fb-4a4b-9145-15fa8de11cdb">


**Middle**
<img width="1440" alt="Screen Shot 2024-09-17 at 1 40 08 PM" src="https://github.com/user-attachments/assets/c3dac892-6d6d-413f-985d-e9769549d3fd">


**End**





