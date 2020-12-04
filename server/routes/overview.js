import { Router } from 'express';
import { jasminReq } from '../api/jasmin';
const router = Router();

const salesExpenses = (req, res) => {
    //TODO: salesExpenses graph
};

const assetsDebts = (req, res) => {
    //TODO: assetsDebts graph
};

const totalAssets = (req, res) => {
    //TODO: totalAssets value
};

const totalDebts = (req, res) => {
    //TODO: totalDebts value
};

router.get("/salesExpenses", salesExpenses);
router.get("/assetsDebts", assetsDebts);
router.get("/totalAssets", totalAssets);
router.get("/totalDebts", totalDebts);

export default router;