const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
    owner: {
        type: String, 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    deadline: {
        type: String, 
        required: true
    },
    amountCollected: {
        type: Number,
        default :0
    },
    image: {
        type: String,
        required: true
    },
    donators: [{
        type: String, 
        
    }],
    donations: [{
        type: String,
    }]
});


const CampaignModel = mongoose.model('Campaign', CampaignSchema);

module.exports = CampaignModel;
