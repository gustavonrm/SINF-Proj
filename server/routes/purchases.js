import { Router } from 'express';
import { jasminReq } from '../api/jasmin';
const router = Router();

const purchases = (req, res) => {
    //TODO: purchases table
};

const totalPurchases = (req, res) => {
    //TODO: totalPurchases value
};

const debts = (req, res) => {
    //TODO: debts table
};

const totalDebts = (req, res) => {
    //TODO: totalDebts value
};

router.get("/purchases", purchases);
router.get("/totalPurchases", totalPurchases);
router.get("/debts", debts);
router.get("/totalDebts", totalDebts);

export default router;