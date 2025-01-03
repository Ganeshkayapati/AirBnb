const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const id = req.params.id;
  const listings = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listings) {
    req.flash("error", "Listing you requested does not exsist");
    res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listings });
};

module.exports.createListing = async (req, res, next) => {

const { title, description, price, country, location } = req.body;

if (!req.file) {
  req.flash("error", "Image upload is required!");
  return res.redirect("/listings/new");
}

const url = req.file.path;
const filename = req.file.filename;

const listing = new Listing({
  title,
  description,
  price,
  country,
  location,
  image: { url, filename },
  owner: req.user._id,
});

  const listingg = new Listing(listing);

  await listingg.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exsist");
    res.redirect("/listings");
  }
  let originalUrl= listing.image.url;
  originalUrl=originalUrl.replace("/upload","/upload/w_250");
  res.render("./listings/edit.ejs", { listing,originalUrl });
};

module.exports.updateListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  let ur=listing.image.url;
  let fn=listing.image.filename;
  console.log(listing);
  listing.title = req.body.title;
  listing.description = req.body.description;
  if(typeof req.file!='undefined'){
    let url=req.file.path;
   let filename=req.file.filename;
   listing.image = {url,filename};
  }
  
  listing.price = req.body.price;
  listing.country = req.body.country;
  listing.location = req.body.location;

  await listing.save();
  req.flash("success", " Listing Edited!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};
