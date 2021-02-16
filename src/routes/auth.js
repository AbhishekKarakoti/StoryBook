const Express=require('express');
const passport=require('passport');
const Router=Express.Router();

//GET /auth/google
Router.get('/google',passport.authenticate('google',{scope:['profile']}))

//GET /auth/google/callback
Router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
  res.redirect('/dashboard');
})

//GET /auth/logout
Router.get('/logout',(req,res)=>{
   req.logOut();
   res.redirect('/');
})

module.exports=Router;