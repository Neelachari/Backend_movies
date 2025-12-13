const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movies_signup', required: true },
    plan: { type: String, required: true }, // 'demo_3min', 'demo_5min', 'demo_10min', 'full'
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true }
});

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

module.exports = SubscriptionModel;