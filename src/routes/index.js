const Express=require('express');
const Router=Express.Router();
const path=require('path');
const Story=require(`${__dirname}/../models/Story.js`)

const {ensureAuth,ensureGuest}=require(path.join(__dirname,'/../../middlewares/auth.js'));

Router.get('/',ensureGuest,(req,res)=>{
    req.app.locals.layout = '/layouts/login'
    res.render('login')
})
Router.get('/dashboard',ensureAuth,async (req,res)=>{
 
    req.app.locals.layout = '/layouts/main'
    //console.log(req.user);
    
    try{
         const stories= await Story.find({user:req.user.id}).lean();

     
         res.render('dashboard',{
            name:req.user.firstName,
            stories
        })
    }catch(err){
        console.log(err);
        res.render('/error/404.hbs')
    }
})

module.exports=Router;