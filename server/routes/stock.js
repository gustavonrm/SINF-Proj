import { Router } from 'express';
import { jasminReq } from '../api/jasmin';
const router = Router();

const stock = (req, res) => {
    // Returns the list of all the entity records available.
    jasminReq('get', '/materialsCore/materialsItems').then((data) => {
        const response = {
            value: 0,
        };

        const getQuantity = (item) => (
            item.materialsItemWarehouses.reduce((accumulator, currValue) => (accumulator + currValue.stockBalance))
        );

        const getUnitCost = (item) => (
            item.materialsItemWarehouses.reduce((accumulator, currValue) => (accumulator + currValue.calculatedUnitCost)) / item.materialsItemWarehouses.length
        );

        data.forEach((item) => {
            const quantity = getQuantity(item);
            const unitCost = getUnitCost(item);
            response.value += quantity * unitCost;
        });

        res.json(response);
    }).catch(() => {
        const err = new Error("Failed");
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
};



router.get("/", stock);

export default router;