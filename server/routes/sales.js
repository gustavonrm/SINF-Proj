import { Router } from 'express';
import { jasminReq } from '../api/jasmin';
const router = Router();

const profit = (req, res) => {
    //TODO: profit value
};

const topProducts = (req, res) => {
    //TODO: topProducts table
};

const totalSales = (req, res) => {
    //TODO: totalSales graph
};

router.get("/profit", profit);
router.get("/topProducts", topProducts);
router.get("/totalSales", totalSales);

export default router;