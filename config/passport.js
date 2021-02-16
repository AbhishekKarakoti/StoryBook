const GoogleStrategy=require('passport-google-oauth20').Strategy
const mongoose=require('mongoose');
const User=require(`${__dirname}/../src/models/User.js`);

module.exports=function(passport){
    passport.use(new GoogleStrategy( {
        clientID:process.env.GOOGLE_CLIENT_ID,//id for api use
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,//secret for api use
        callbackURL:'/auth/google/callback'//url when to authnticate
    },
    async(accessToken,refreshToken,profile,done)=>{
        // console.log(profile);
        const newUser={
            googleId:profile.id,
            displayName:profile.displayName,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            image:profile.photos[0].value
        }
        try {
            let user=await User.findOne({googleId:profile.id});
            if(user){
                done(null,user)
            }else{
                user=await User.create(newUser);
                done(null,newUser);
            }
    
        } catch (error) {
            console.log(error);
        }
    }))

    passport.serializeUser((user,done)=>{
        // console.log(user.id);
        done(null,user.id);
    });
    
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
               done(err,user);
        })
    });
    

}

