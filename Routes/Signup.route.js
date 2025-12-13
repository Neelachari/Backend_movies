const express = require("express");
const bcrypt = require("bcrypt");
const RegisterModel = require('../Model/Signup.model');
const SubscriptionModel = require('../Model/Subscription.model');
const signupRouter = express.Router();

// User Registration Route
signupRouter.post('/register', async (req, res) => {
    try {
        let { Name, mobile_Number, age, email, password } = req.body;
        const existuser = await RegisterModel.findOne({ email });
        
        if (existuser) {
            return res.status(400).send({ error: "User already exists" });
        }

        if (checkPass(password)) {
            const hash = bcrypt.hashSync(password, 8);
            const User = new RegisterModel({ ...req.body, password: hash });
            await User.save();
            res.status(200).send("The new user has been registered");
        } else {
            res.status(400).send({ error: "Password must include at least one uppercase letter, one number, and one special character" });
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Password Validation Function
const checkPass = (password) => {
    if (password.length < 8) return false;

    const alpha = "QWERTYUIOPASDFGHJKLZXCVBNM";
    const number = "0123456789";
    const char = "~!@#$%^&*(){}[]_`=+";

    let hasUpper = false, hasNumber = false, hasSpecial = false;

    for (let i = 0; i < password.length; i++) {
        if (alpha.includes(password[i])) hasUpper = true;
        if (number.includes(password[i])) hasNumber = true;
        if (char.includes(password[i])) hasSpecial = true;
    }

    return hasUpper && hasNumber && hasSpecial;
};

// Get all users with subscription details
signupRouter.get('/users', async (req, res) => {
    try {
        const users = await RegisterModel.find({}, '-password'); // Exclude password field
        
        // Get subscription details for each user
        const usersWithSubscriptions = await Promise.all(
            users.map(async (user) => {
                const subscription = await SubscriptionModel.findOne({ 
                    userId: user._id, 
                    active: true,
                    endDate: { $gt: new Date() } // Only active subscriptions that haven't expired
                }).sort({ endDate: -1 }); // Get the latest subscription
                
                return {
                    _id: user._id,
                    name: user.Name,
                    email: user.email,
                    mobile_Number: user.mobile_Number,
                    age: user.age,
                    status: user.status,
                    subscription: subscription ? subscription.plan : null,
                    subscriptionEndDate: subscription ? subscription.endDate : null,
                    createdAt: user.createdAt,
                    favoritesCount: user.Account_info ? user.Account_info.length : 0
                };
            })
        );
        
        res.status(200).json(usersWithSubscriptions);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Block/Unblock user
signupRouter.patch('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' or 'blocked'
        
        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "active" or "blocked"' });
        }
        
        const updatedUser = await RegisterModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ 
            message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
            user: {
                _id: updatedUser._id,
                name: updatedUser.Name,
                email: updatedUser.email,
                status: updatedUser.status
            }
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Get user statistics
signupRouter.get('/users/stats', async (req, res) => {
    try {
        const totalUsers = await RegisterModel.countDocuments();
        const activeUsers = await RegisterModel.countDocuments({ status: 'active' });
        const blockedUsers = await RegisterModel.countDocuments({ status: 'blocked' });
        
        // Get subscribed users (users with active subscriptions)
        const subscribedUsers = await SubscriptionModel.distinct('userId', {
            active: true,
            endDate: { $gt: new Date() }
        });
        const subscribedCount = subscribedUsers.length;
        
        // Get subscription plan distribution
        const subscriptionStats = await SubscriptionModel.aggregate([
            { $match: { active: true, endDate: { $gt: new Date() } } },
            { $group: { _id: '$plan', count: { $sum: 1 } } }
        ]);
        
        res.status(200).json({
            totalUsers,
            activeUsers,
            blockedUsers,
            subscribedUsers: subscribedCount,
            subscriptionPlans: subscriptionStats
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
});

signupRouter.post('/movie/:id/add-to-my-space', async (req, res) => {
    try {
        const { id } = req.params;  
        const { accountId } = req.body; 

        console.log("id", id, "accountId", accountId);

        const updatedUser = await RegisterModel.findByIdAndUpdate(
            accountId,
            { $push: { Account_info: id } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send({ message: "Account ID added to My Space", updatedUser });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


signupRouter.delete('/movie/:id/remove-from-my-space', async (req, res) => {
    try {
        const { id } = req.params;  
        const { accountId } = req.body;  

        const deleteUser = await RegisterModel.findByIdAndUpdate(
            accountId,
            { $pull: { Account_info: id } },
            { new: true }
        );

        if (!deleteUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).send({ message: "Account ID removed from My Space", deleteUser });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = signupRouter;
