const express = require('express');
const router = express.Router();
const CampaignModel = require('../model/campginModel');
const Razorpay = require('razorpay');


router.post("/create-checkout-session", async (req, res) => {
  const { amount, userId, pid } = req.body;
  try {
    const campaign = await CampaignModel.findById(pid);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const truncatedUserId = userId.substring(0, 10);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `Purchased with user_id ${truncatedUserId}`,
    }

    instance.orders.create(options, (error, order)=>{
      if(error){
        console.log(error);
        return res.status(500).json({meessage:"Something went wrong!"});
      }

      res.status(200).json({data:order});

    });
  } catch (error) {
    console.error('Error donating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router