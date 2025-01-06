import express from 'express';
import PlannerMarketDao from '../DAO/plannerMarketDao';
import { ensureAuthenticated } from '../middlewares/authUser';

const router = express.Router();

router.get('/planner_market', ensureAuthenticated, async (req, res) => {
  const sigungu_id = parseInt(req.query.sigungu_id as string, 10);
  const category = req.query.category as string;

  if (isNaN(sigungu_id)) {
    return res.status(400).json({ error: 'Invalid sigungu_id' });
  }

  try {
    if (category) {
      const items = await PlannerMarketDao.getItemsByCategoryAndSigunguId(sigungu_id, category);
      res.status(200).json(items);
    } else {
      const categories = await PlannerMarketDao.getCategoriesBySigunguId(sigungu_id);
      res.status(200).json(categories);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve data');
  }
});

export default router;
