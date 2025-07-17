const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const isSignedIn = require('../middleware/is-signed-in');
const { render } = require('ejs');
const upload = require('../config/multer');

// VIEW NEW LISTING FORM
router.get("/new", (req,res) => {
  res.render('listings/new.ejs');
});

router.post("/",isSignedIn, upload.single('image'), async(req,res) => {
  try{
    req.body.seller = req.session.user._id;
    req.body.image = {
      url: req.file.path,
      cloudinary_id: req.file.fieldname
    }
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
  const foundList = await Listing.findById(req.params.listingId).populate('seller').populate('comments.author');
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
router.get('/:listingId/edit', isSignedIn,async (req,res) => {
  const foundList = await Listing.findById(req.params.listingId).populate('seller'); 
  if(foundList.seller._id.equals(req.session.user._id)){
    res.render('listings/edit.ejs', {foundList})
  }
  
});

router.put('/:listingId', isSignedIn ,async (req,res) => {
  const foundList = await Listing.findById(req.params.listingId).populate('seller');

  if(foundList.seller._id.equals(req.session.user._id)){
    await Listing.findByIdAndUpdate(req.params.listingId, req.body, {new: true});
    res.redirect('/listings');
  };
});

// ADD COMMENTS TO THE DATABASE
router.post('/:listingId/comments', isSignedIn ,async (req,res) => {
  const foundList = await Listing.findById(req.params.listingId).populate('comments.author');
 
  req.body.author = req.session.user._id 
 console.log(req.body)
  foundList.comments.push(req.body);
  await foundList.save(); 
  console.log('foundlist: ', foundList)
  res.redirect('/listings/' + req.params.listingId);
})

module.exports = router;