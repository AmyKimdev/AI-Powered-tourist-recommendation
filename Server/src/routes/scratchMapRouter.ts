import express from 'express';
import ScratchMapDao from '../DAO/scratchMapDao';
import { ensureAuthenticated } from '../middlewares/authUser';
import AppError from '../utils/AppError';  // AppError 가져오기

// 세션 타입 확장
declare module 'express-session' {
  interface SessionData {
    user_id: string;
  }
}

const router = express.Router();

router.post('/scratch_map', ensureAuthenticated, async (req, res) => {
  const user_id = req.session?.user_id as string;
  const { sigungu_name } = req.body;

  try {
    await ScratchMapDao.toggleScratchMap(user_id, sigungu_name);
    res.status(200).send('성공적으로 저장되었습니다.');
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).send('저장에 실패했습니다.');
    }
  }
});

router.get('/scratch_map', ensureAuthenticated, async (req, res) => {
  const user_id = req.session?.user_id as string;

  try {
    const entries = await ScratchMapDao.getScratchMapByUserId(user_id);
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).send('데이터 조회에 실패했습니다.');
  }
});


export default router;
