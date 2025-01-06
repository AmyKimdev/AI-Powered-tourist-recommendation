import express, { Request, Response } from 'express';
import TravelPlanDao from '../DAO/travelPlanDao';
import { TravelPlanRequest } from '../types/travelPlanInterface';
import { ensureAuthenticated } from '../middlewares/authUser';
import { db_connection } from '../config'; // db_connection 가져오기

const router = express.Router();
const travelPlanDao = new TravelPlanDao();

// 여행 계획을 생성하거나 업데이트하는 엔드포인트
router.post('/travel-plan', ensureAuthenticated, async (req: Request, res: Response) => {
    const userId = req.session?.user_id; // 세션에서 user_id를 가져옴
    const data: TravelPlanRequest = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const client = await db_connection.connect();
        const sigunguQuery = 'SELECT name FROM sigungu WHERE id = $1';
        const sigunguResult = await client.query(sigunguQuery, [data.sigungu_id]);
        const sigunguName = sigunguResult.rows[0]?.name || '';

        data.title = sigunguName;
        client.release();

        await travelPlanDao.createOrUpdateTravelPlan({ ...data, user_id: userId });
        res.status(200).send('Travel plan updated successfully');
    } catch (error) {
        res.status(500).send('An error occurred while updating the travel plan');
    }
});

// 특정 사용자와 플래너 ID에 대한 여행 계획을 가져오는 엔드포인트
router.get('/travel-plan', ensureAuthenticated, async (req: Request, res: Response) => {
    const userId = req.session?.user_id; // 세션에서 user_id를 가져옴
    const planner_id = parseInt(req.query.planner_id as string, 10);

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const plans = await travelPlanDao.getTravelPlans(userId, planner_id);
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).send('An error occurred while fetching the travel plans');
    }
});

export default router;
