if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpreeError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStartegy=require("passport-local");
const User=require("./models/user.js");
// const multer=require("multer");
// const upload=multer({dest:"uploads/"});

const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");





app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);  
app.use(express.static(path.join(__dirname,"/public")));
const db_url=process.env.DB_URL;
const port=3000;
async function main() {
    try {
        await mongoose.connect(db_url);
        console.log("Connected to Db");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
main();


const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.secret
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("error in mongo store",err);
});

const sessionOptions={
    store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}



// app.get("/",(req,res)=>{
//     res.send("root");
// })


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
app.use((req,res,next)=>{
    res.locals.currUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    
    next();
})


    

// app.get("/demoUser" ,async (req,res)=>{
//     let fakeUser=new User({
//         email:"ganesh@gmail.com",
//         username:"delta"
//     })
//     const reguser = await User.register(fakeUser,"hello");
//     res.send(reguser);

    
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    const {status=500,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{err})
    // res.status(status).send(message)
})



app.listen(port,(req,res)=>{
    console.log('ported started');
})