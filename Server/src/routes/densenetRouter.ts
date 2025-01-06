import express, { Request, Response } from 'express';
const router = express.Router();
import axios from 'axios';
import { ensureAuthenticated } from '../middlewares/authUser';
import  {AuthenticatedRequest}  from '../types';

router.post('/densenet',ensureAuthenticated, async (req: Request, res: Response) => {
    try {
    const { image_url} = req.body;
    const { user } = req as AuthenticatedRequest;
      
    if (!user) {
      return res.status(401).json({ error: '인증되지 않음' });
    }
        const response = await axios.post('http://localhost:5000/similarity', {
            image_url
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error calling travel planner API:', error);
        res.status(500).json({ error: 'Failed to call densenet API' });
    }
});

export default router;