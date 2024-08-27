const express = require("express");
const bcrypt = require("bcrypt");
const RegisterModel = require('../Model/Signup.model');
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
