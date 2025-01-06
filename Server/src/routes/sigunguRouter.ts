import express, { Request, Response } from 'express';
import {sigunguDao} from '../DAO'
const router = express.Router();

router.get('/sigungu/:sigungu' , async (req: Request, res: Response) => {
    try {
        const { sigungu } = req.params; 
        const explanation = await sigunguDao.getExplanationBySigungu(sigungu);
        res.status(200).json({ response: explanation }); 
    }catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Server Error' });
    }
  });

export default router;