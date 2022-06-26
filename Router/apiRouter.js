const express=require('express');
const apiRouter=express.Router();
const {ping,posts}=require('../controller/apicontroller');

apiRouter
.route('/ping')
.get(ping)
    
apiRouter
.route('/posts')
.get(posts)



module.exports=apiRouter;





