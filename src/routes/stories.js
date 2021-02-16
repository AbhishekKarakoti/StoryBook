const Express=require('express');
const Router=Express.Router();
const path=require('path');
const Story = require('../models/Story');

const {ensureAuth}=require(path.join(__dirname,'/../../middlewares/auth.js'));


Router.get('/add',ensureAuth,(req,res)=>{
    req.app.locals.layout = '/layouts/main'
    res.render(path.join(__dirname,'../../views/stories/addStory.hbs'));
})

//single Story

Router.get('/:id',ensureAuth,async(req,res)=>{
    req.app.locals.layout='/layouts/main';
    try{
        const story=await Story.findById({_id:req.params.id}).populate('user').lean();
        
        if(!story){
            res.render('/error/404')
        }
        const showPath=path.join(__dirname,'/../../views/stories/show.hbs');
        
        console.log(story);
        
        res.render(showPath,{
            story
        })
    }catch(err){
        res.render('/error/404')
    }
})
///all from single user
Router.get('/user/:userid',ensureAuth,async(req,res)=>{
    req.app.locals.layout='/layouts/main'
   try{
       const stories=await Story.find({user:req.params.userid,status:'public'}).populate('user').lean();
       if(!stories){
        res.render('/error/404.hbs');
           }
           const indexPath=path.join(__dirname,'/../../views/stories/index.hbs');
           res.render(indexPath,{stories})
   }catch(err){
       console.log(err);
       res.render('/error/404.hbs');
   }
})

Router.post('/add',ensureAuth,async(req,res)=>{
    req.app.locals.layout = '/layouts/main'
    try{
     req.body.user=req.user.id
    //  console.log(req.body);

     await Story.create(req.body);
     res.redirect('/dashboard');
    }catch(err){
        console.log(err);
    }
})

Router.get('/',ensureAuth,async(req,res)=>{
    req.app.locals.layout='/layouts/main'
    try{
        const stories=await Story.find({status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean();
        // console.log(stories);
         const indexPath=path.join(__dirname,'/../../views/stories/index.hbs');
        res.render(indexPath,{
            stories
        });
    }catch(err){
        console.log(err)
    }
})

Router.get('/edit/:id',ensureAuth,async (req,res)=>{
  
    try {
        const story= await Story.findOne({_id:req.params.id});
        //if story id is not present in db
        if(!story){
            res.render('/error/404.hbs')
        }
        //if person who owns the story is not the one logged in
       
        if(story.user!=req.user.id){
            res.redirect('/Stories')
        }else{
            req.app.locals.layout = '/layouts/main'
            const editStroy=path.join(__dirname,'/../../views/stories/editStory.hbs');
            res.render(editStroy,{
                story
            })
        }
    } catch (error) {
        console.log(err);
    }

})





//update 
Router.put('/:id',ensureAuth,async (req,res)=>{
  
    try {
        let story= await Story.findOne({_id:req.params.id}).lean();
        //if story id is not present in db
        if(!story){
            res.render('/error/404.hbs')
        }
        //if person who owns the story is not the one logged in
       
        if(story.user!=req.user.id){
            res.redirect('/Stories')
        }else{
            story= await Story.findOneAndUpdate({_id:req.params.id},req.body,{
                new:true,
                runValidators:true
            })
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.log(err);
    }

})
//delete
Router.delete('/:id',ensureAuth,async(req,res)=>{
    try{
         const story= await Story.remove({_id:req.params.id});
         res.redirect('/dashboard');
    }catch(err){
        console.log(err);
        res.render('error/404.hbs');
        
    }
})

module.exports=Router;