const express = require('express');
const expenseController = require('../controllers/expenseController');
const middleware = require('../middleware/auth'); // Import authentication middleware
const purchaseController = require('../controllers/purchaseController');
// const registerController = require('../controllers/registerController');
const router = express.Router();


router.get ('/purchasepremium', middleware.authenticateToken,purchaseController.purchasePremium )
router.post ('/updateTransactionStatus', middleware.authenticateToken,purchaseController.updateTransactionStatus )
router.get ('/getUserLeaderBoard', middleware.authenticateToken,purchaseController.getUserLeaderBoard )

module.exports = router;
