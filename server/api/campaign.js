const express = require('express');
const router = express.Router();
const CampaignModel = require('../model/campginModel');
const UserModel = require('../model/userModel');


// Create a new campaign document
router.post('/create', async (req, res) => {
    try {
        
        const { owner, title, description, target, deadline, image } = req.body;

        if (!owner || !title || !description || !target || !deadline || !image) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newCampaign = await CampaignModel.create({
            owner,
            title,
            description,
            target,
            deadline,
            image
        });

        res.status(201).json(newCampaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get all campaign documents
router.get('/getall', async (req, res) => {
    try {
        const campaigns = await CampaignModel.find();
        res.status(200).json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Donate API

router.post('/donate', async (req, res) => {
    const { amount, userId, pid } = req.body;
  
    try {
      const campaign = await CampaignModel.findById(pid);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      campaign.amountCollected = campaign.amountCollected + parseFloat(amount);
      campaign.donators.push(userId);
      campaign.donations.push(amount); 
  
      await campaign.save();
  
      res.json({ success:true, message: 'Donation successful', campaign });
      return
    } catch (error) {
      console.error('Error donating:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/donations/:pId', async (req, res) => {
    try {
        const campaign = await CampaignModel.findById(req.params.pId);
        if (!campaign) return res.status(404).json({ error: 'Project not found' });

        const parsedDonations = await Promise.all(campaign.donations.map(async (donation, index) => {
            const user = await UserModel.findById(campaign.donators[index]);
            return { donator: user ? user.userName : 'Unknown User', donation };
        }));

        return res.json(parsedDonations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
