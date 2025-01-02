const mongoose=require("mongoose");
// async function main(){
//     await mongoose.connect('mongodb://127.0.0.1:27017/bnb');
// }   
// main().then(()=>{
//     console.log("connected");
// }
// ).catch((err)=>{
//     console.log(err);

// })
const Review=require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {

        url:String,
        filename:String
    },
    
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

// Middleware to clean up reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
