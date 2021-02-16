const mongoose=require('mongoose');
const connectDb=async ()=>{
 try{
        const conn =await mongoose.connect(process.env.MONGO_URL,{
            useCreateIndex:true,
            useFindAndModify:true,
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log(`connected to -${conn.connection.host}`)
 }catch(err){
       console.log('error occured connecting to db');
       process.exit(1);
 }
}
module.exports=connectDb