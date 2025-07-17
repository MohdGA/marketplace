const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const isSignedIn = require('../middleware/is-signed-in');
// VIEW NEW LISTING FORM
router.get("/new", (req,res) => {
  res.render('listings/new.ejs');
});

router.post("/",isSignedIn, async(req,res) => {
  console.log(req.body);
  try{
    console.log(req.session.user)
    req.body.seller = req.session.user._id;
    await Listing.create(req.body);
    res.redirect('/listings');
  }catch(error){
    console.log(error);
  }
  
});

router.get("/", async(req,res) => {
  const lists = await Listing.find();
  res.render('listings/index.ejs',{lists});
});

router.get('/:listingId', async (req,res) => {
  const foundList = await Listing.findById(req.params.listingId).populate('seller');
  console.log(foundList);
  res.render('listings/show.ejs',{foundList});
});

router.delete('/:listingId', async (req,res) => {
  await Listing.findByIdAndDelete(req.params.listingId);
  res.redirect('/')
})

module.exports = router;