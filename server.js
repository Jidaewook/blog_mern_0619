const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routers/api/users');
const profileRouter = require('./routers/api/profile');
const postsRouter = require('./routers/api/posts');

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
    .connect(db, {
      useNewUrlParser: true, 
      useCreateIndex: true  
    }) 
    //Adding new mongo url parser
    .then(() => console.log('MongoDB connected..'))
    .catch(err => console.log(err));



const app = express();

app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));