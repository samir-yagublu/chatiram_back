const express = require('express');

const {getOrders,makeOrder,deleteOrder, getNotification,setAccepted, declineOrder,getVerified} = require('../controllers/order');


const router = express.Router();
router.get('/orders/accepted',getVerified);
router.get('/orders', getOrders);
router.put('/orders', setAccepted);
router.post('/orders', makeOrder);
router.delete('/orders',deleteOrder);
router.delete('/orders/delete',declineOrder);
router.get('/notification',getNotification);
module.exports = router;