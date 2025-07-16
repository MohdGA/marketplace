const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// VIEW NEW LISTING FORM
router.get("/new", (req,res) => {
  res.render('listings/new.ejs');
});

router.post("/", async(req,res) => {
  console.log(req.body);
  const Lists = await Listing.create(req.body);
  res.render('/listings/index.ejs',{Lists});
});

module.exports = router;