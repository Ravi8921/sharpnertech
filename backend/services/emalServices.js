const apiInstance = require('../util/sendinblue');

const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const emailData = {
        sender: { email: 'ravikant892123@gmail.com', name: 'Your App' },
        to: [{ email }],
        subject: 'Reset Your Password',
        htmlContent: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    return await apiInstance.sendTransacEmail(emailData);
};

module.exports = { sendResetPasswordEmail };
