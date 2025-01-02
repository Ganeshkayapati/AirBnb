const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpreeError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor} =require("../middleware.js");
const reviewController=require("../controllers/review.js");




router.post("/",isLoggedIn,validateReview, wrapasync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewController.destroyReview));

module.exports=router;