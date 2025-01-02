const Listing=require("./models/listing");
const Review = require('./models/review.js'); 
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpreeError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    console.log(req.body);
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    const id=req.params.id;
    const listing=await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of this listing");
            res.redirect(`/listings/${id}`);
        }
        next();

}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errmsg);
    }
    next();
};


module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const errmsg=error.details.map((el) =>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }
    else{
       next();
    }

}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let  {id,reviewId}=req.params;
    
    
   let review1=await Review.findById(reviewId);
    if(!review1.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next(); 

} 



