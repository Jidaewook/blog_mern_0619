const express = require('express');
const userRouter = require('./routers/api/users');
const profileRouter = require('./routers/api/profile');
const postsRouter = require('./routers/api/posts');

const app = express();

app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));