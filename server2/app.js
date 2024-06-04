const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle registration form submission
app.post('/form', async (req, res) => {
  try {
    
    const firebase = await import('../firebase.js');
    const { username, email, password } = req.body;

    if(!email){
      try{
        let result = await firebase.readUserData(username, password);
        if(result){
          res.redirect(`./createRoom.html?username=${username}`);
        } else{
          console.error("Error in user registration:", error);
          res.status(500).send('Your Username or Password is incorrect.');
        }
        
      } catch{
        
        res.status(500).send('Your Username or Password is incorrect.');
      }
      
    }
    if(email){
    await firebase.writeUserData(username, username, email, password);
    // Send a success response
    res.redirect(`./createRoom.html?username=${username}`);
    }
  } catch  {
    
    res.status(500).send('There was an error with the registration. Please try again later.');
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
