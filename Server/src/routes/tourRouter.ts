import express, { Request, Response } from 'express';
import {TourDao} from '../DAO'; // 경로를 정확히 확인하세요
import { Tour } from '../types/tourInterface'; // 경로를 정확히 확인하세요

const router = express.Router();

router.get('/tour', async (req: Request, res: Response) => {
    try {
        const sigungu = req.query.sigungu as string;
        if (!sigungu) {
            return res.status(400).json({ error: 'sigungu query parameter is required' });
        }
        const places: Tour[] = await TourDao.getPlacesBySigungu(sigungu);
        res.json(places);
    } catch (error: unknown) {
        console.error('Error occurred:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: 'Server Error', message: error.message });
        } else {
            res.status(500).json({ error: 'Server Error', message: 'An unknown error occurred' });
        }
    }
});

router.get('/tour/:gal_title', async (req: Request, res: Response) => {
    try {
        const { gal_title } = req.params; 
        console.log(gal_title);
        const places: Tour[] = await TourDao.getCoordinatesAndExplanationByPlaces(gal_title);
        res.status(200).json(places);
    } catch (error: unknown) {
        console.error('Error occurred:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: 'Server Error', message: error.message });
        } else {
            res.status(500).json({ error: 'Server Error', message: 'An unknown error occurred' });
        }
    }
});

export default router;
