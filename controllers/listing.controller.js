const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const isSignedIn = require('../middleware/is-signed-in');
const { render } = require('ejs');
// VIEW NEW LISTING FORM
router.get("/new", (req,res) => {
  res.render('listings/new.ejs');
});

router.post("/",isSignedIn, async(req,res) => {
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
  const foundList = await Listing.findById(req.params.listingId).populate('seller');
  if(foundList.seller._id.equals(req.session.user._id)){
    // await Listing.findByIdAndDelete(req.params.listingId);
    await foundList.deleteOne();
    res.redirect('/')
  };
  
});

// RENDER THE EDIT FORM VIEW
router.get('/:listingId/edit', async (req,res) => {
  const foundList = await Listing.findById(req.params.listingId).populate('seller'); 
  if(foundList.seller._id.equals(req.session.user._id)){
    res.render('listings/edit.ejs', {foundList})
  }
  
});

router.put('/:listingId', async (req,res) => {
  const foundList = await Listing.findById(req.params.listingId).populate('seller');

  if(foundList.seller._id.equals(req.session.user._id)){
    await Listing.findByIdAndUpdate(req.params.listingId, req.body, {new: true});
    res.redirect('/listings');
  };
})

module.exports = router;