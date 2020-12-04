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

const capacity = (req, res) => {
    // Returns the list of all the entity records available.
    jasminReq('get', '/materialsCore/materialsItems').then((data) => {
        const response = [];

        const getKey = (item) => (
            item.itemKey
        );

        const getName = (item) => (
            item.description
        );

        const getQuantity = (item) => (
            item.materialsItemWarehouses.reduce((accumulator, currValue) => (accumulator + currValue.stockBalance))
        );

        const getUnitCost = (item) => (
            item.materialsItemWarehouses.reduce((accumulator, currValue) => (accumulator + currValue.calculatedUnitCost)) / item.materialsItemWarehouses.length
        );

        const getInvPeriod = (item) => (
            0   //TODO: use SAFT to get invPeriod 
        );

        const getTurnover = (item) => (
            0   //TODO: use SAFT
        );

        data.forEach((item) => {
            const key = getKey(item);
            const name = getName(item);
            const quantity = getQuantity(item);
            const unitCost = getUnitCost(item);
            const invPeriod = getInvPeriod(item);
            const turnover = getTurnover(item);

            response.push({key: key, name: name, quantity: quantity, unitCost: unitCost, invPeriod: invPeriod, turnover: turnover});
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

const period = () => {
    //TODO: period value
};

const turnover = () => {
    //TODO: turnover value
};

router.get("/stock", stock);
router.get("/capacity", capacity);
router.get("/period", period);
router.get("/turnover", turnover);

export default router;