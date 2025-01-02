const mongoose=require("mongoose");
async function main(){
    await mongoose.connect('mongodb://localhost:27017');
}   
main().then(()=>{
    console.log("connected");
}
).catch((err)=>{
    console.log(err);
})

const dataa=require("../init/data.js");
const listing = require("../models/listing");


const connect=async()=>{
    // for(d of dataa.data){
    //     data=new listing(d);
    //     await data.save();
    // }
    await listing.deleteMany({});
    dataa.data=dataa.data.map((obj)=>({...obj,owner:"6775165651dfbc7f7218585c"}))
    await listing.insertMany(dataa.data);
    console.log("data is initialized");

}

connect();