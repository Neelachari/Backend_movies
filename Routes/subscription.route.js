const express = require('express');
const {auth} = require('../Middleware/auth.middleware');
const SubscriptionModel = require('../Model/Subscription.model');

const subscriptionRouter = express.Router();

// Subscribe
subscriptionRouter.post('/subscribe', auth, async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.body.userID; // from auth
        let duration;
        if(plan === 'demo_3min') duration = 3 * 60 * 1000; // 3 min in ms
        else if(plan === 'demo_5min') duration = 5 * 60 * 1000;
        else if(plan === 'demo_10min') duration = 10 * 60 * 1000;
        else if(plan === 'full') duration = 365 * 24 * 60 * 60 * 1000; // 1 year
        else return res.status(400).send({error: 'Invalid plan'});

        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + duration);

        const subscription = new SubscriptionModel({ userId, plan, startDate, endDate });
        await subscription.save();
        res.status(200).send({message: 'Subscribed successfully', subscription});
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

// Get user subscription
subscriptionRouter.get('/subscription', auth, async (req, res) => {
    try {
        const userId = req.body.userID;
        const subscription = await SubscriptionModel.findOne({ userId, active: true }).sort({ startDate: -1 });
        if(!subscription) return res.status(200).send({message: 'No active subscription'});
        res.status(200).send(subscription);
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

module.exports = subscriptionRouter;