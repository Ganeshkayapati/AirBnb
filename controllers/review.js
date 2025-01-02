const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let comment = req.body.review;
        let rating = req.body.rating;
       let ans={
        comment:comment,
        rating:rating
    }
        let newReview = new Review(ans);
        newReview.author=req.user._id;
        // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save(); 
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${listing._id}`)

}

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);

}