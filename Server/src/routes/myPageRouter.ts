import express from 'express';
import {MyPageDao} from '../DAO';
import { ensureAuthenticated } from '../middlewares/authUser';

const router = express.Router();

router.get('/mypage/titles', ensureAuthenticated, async (req, res) => {
  const userId = req.session?.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const titles = await MyPageDao.getTitles(userId);
    res.status(200).json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve titles');
  }
});

router.put('/mypage/titles', ensureAuthenticated, async (req, res) => {
  const userId = req.session?.user_id;
  const { oldTitle, newTitle, plannerId } = req.body;

  if (!userId || !oldTitle || !newTitle || !plannerId) {
    return res.status(400).json({ error: 'User ID, old title, new title, and planner ID are required' });
  }

  try {
    await MyPageDao.updateTitle(userId, plannerId, oldTitle, newTitle);
    res.status(200).json({ message: 'Title updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to update title');
  }
});

router.delete('/mypage/titles', ensureAuthenticated, async (req, res) => {
  const userId = req.session?.user_id;
  const { title, plannerId } = req.body;

  if (!userId || !title || !plannerId) {
    return res.status(400).json({ error: 'User ID, title, and planner ID are required' });
  }

  try {
    await MyPageDao.deleteTitle(userId, plannerId, title);
    res.status(200).json({ message: 'Title deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to delete title');
  }
});


export default router;
