const uuid = require('uuid');
const bcrypt = require('bcrypt');
const apiInstance = require('../util/sendinblue');
const User = require('../models/registerModel');
const Forgotpassword = require('../models/passwordresetModel');
const { Op } = require('sequelize');

// Forgot password request
const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required', success: false });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist', success: false });
        }

        const id = uuid.v4();
        const expiresBy = new Date();
        expiresBy.setHours(expiresBy.getHours() + 1); // Link expires in 1 hour

        await Forgotpassword.create({
            id,
            userId: user.id,
            active: true,
            expiresby: expiresBy
        });

        const emailData = {
            sender: { email: 'ravikant8921@gmail.com', name: 'Your App' },
            to: [{ email }],
            subject: 'Reset Your Password',
            htmlContent: `<p>Click <a href="http://localhost:3000/password/resetpassword/${id}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
        };

        await apiInstance.sendTransacEmail(emailData);
        return res.status(200).json({ message: 'Password reset link sent to your email', success: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

// Reset password page
const resetpassword = async (req, res) => {
    try {
        const id = req.params.id;
        const forgotpasswordrequest = await Forgotpassword.findOne({
            where: {
                id,
                active: true,
                expiresby: { [Op.gt]: new Date() } // Check if link is still valid
            }
        });

        if (!forgotpasswordrequest) {
            return res.status(400).json({ error: 'Reset link is invalid or expired', success: false });
        }

        res.status(200).send(`
            <html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called');
                    }
                </script>
                <form action="/password/updatepassword/${id}" method="post">
                    <label for="newpassword">Enter New Password</label>
                    <input name="newpassword" type="password" required></input>
                    <button type="submit">Reset Password</button>
                </form>
            </html>`);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to reset password', success: false });
    }
};

// Update password
const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.body;
        const { id } = req.params;

        if (!newpassword) {
            return res.status(400).json({ error: 'New password is required', success: false });
        }

        const forgotpasswordrequest = await Forgotpassword.findOne({
            where: {
                id,
                active: true,
                expiresby: { [Op.gt]: new Date() } // Ensure it's still valid
            }
        });

        if (!forgotpasswordrequest) {
            return res.status(400).json({ error: 'Reset request is invalid or expired', success: false });
        }

        const user = await User.findOne({ where: { id: forgotpasswordrequest.userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
        await user.update({ password: hashedPassword });

        // Mark the reset request as used
        await forgotpasswordrequest.update({ active: false });

        return res.status(200).json({ message: 'Password updated successfully', success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update password', success: false });
    }
};

module.exports = {
    forgotpassword,
    resetpassword,
    updatepassword
};
