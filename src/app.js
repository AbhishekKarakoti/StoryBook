const Express=require('express');
const app=Express();
require('dotenv').config({path:`${__dirname}/../config/.env`});
const PORT=process.env.PORT || 3000

//for logging req
// const morgan=require('morgan');
// app.use(morgan('dev'));

const hbs=require('hbs');
const path=require('path');
const passport=require('passport');
const mongoose=require('mongoose');
const session=require('express-session');
const mongoStore=require('connect-mongo')(session);
const methodOverride=require('method-override')

//body parser for stories form
app.use(Express.urlencoded({extended:false}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


//Load config
//passport config for google strategy
require(`${__dirname}/../config/passport.js`)(passport);


//db
const connecDb=require(`${__dirname}/db/connec.js`);
connecDb();

//setting static
const staticPath=path.join(__dirname,'/../public')

//setting helpers hbs
const {formatDate,truncate,stripTags,editIcon}=require(`${__dirname}/../helpers/helpers.js`)

//setting hbs
const partialPath=path.join(__dirname,'/../views/partials');
hbs.registerPartials(partialPath);
app.set('view engine','hbs');
hbs.registerHelper({
  formatDate,
  stripTags,
  truncate,
  editIcon,
});



//setting express session
app.use(session({
    secret: 'keyboard cat',
    resave: false, //false mean we do not want to save session untill somthing is modified
    saveUninitialized: false,//false meaning dont create a session untill something is stored
    store:new mongoStore({mongooseConnection:mongoose.connection})
  }))

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//set global variable
app.use(function(req,res,next){
  res.locals.user=req.user || null;
  next();
})



app.use(Express.static(staticPath));

//Mounting
const index=require(`${__dirname}/routes/index.js`);
const auth=require(`${__dirname}/routes/auth.js`);
const Stories=require(`${__dirname}/routes/stories.js`);

app.use('/',index);
app.use('/auth',auth);
app.use('/Stories',Stories);

app.listen(PORT,()=>{
    console.log(`server has staretd on port ${PORT}`);
})
