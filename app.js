const express=require('express');
const app=express();
const apiRouter= require('./Router/apiRouter');

app.use(express.json()); 
app.listen(3000);

app.use('/api', apiRouter)








