import { Router } from 'express';
import { getExample } from '../api/requests';
const router = Router();

const example = (req, res) => {
    getExample().then((data) => {

    })
}

router.get("/", example)

export default router;