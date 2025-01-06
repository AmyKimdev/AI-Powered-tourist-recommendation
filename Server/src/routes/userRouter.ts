import express from 'express';
import {userDao} from '../DAO';
import { ensureAuthenticated } from '../middlewares/authUser';
import  {AuthenticatedRequest}  from '../types';

const router = express.Router();

//개인정보 불러오는 라우터
router.get('/user', ensureAuthenticated, async (req, res) => {

    const { user } = req as AuthenticatedRequest;
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: '인증되지 않음' });
    }
  
    try {
      const result = await userDao.findUserById(user.user_id);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to retrieve data');
    }
  });

router.put('/user/display-name', ensureAuthenticated, async (req, res) => {
    const userId = req.session?.user_id;
    const { newDisplayName } = req.body;
  
    if (!userId || !newDisplayName) {
      return res.status(400).json({ error: 'User ID and new display name are required' });
    }
  
    try {
      await userDao.updateDisplayName(userId, newDisplayName);
      res.status(200).json({ message: 'Display name updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to update display name');
    }
  });
  

router.delete('/user', ensureAuthenticated, async (req, res, next) => {
    const { user } = req as AuthenticatedRequest;
  
    if (!user) {
      return res.status(401).json({ error: '인증되지 않음' });
    }  
    try {
      await userDao.deleteUser(user.user_id);
      res.json({ message: '계정이 성공적으로 삭제되었습니다' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '내부 서버 오류' });
    }
  });

router.put( "/user/password", ensureAuthenticated, async (req, res, next) => {
      try {
          const { user } = req as AuthenticatedRequest;
  
          if (!user) {
            return res.status(401).json({ error: '인증되지 않음' });
          }  
          const { currentPassword, newPassword } = req.body;
          // 필요한 필드가 있는지 확인
          if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "currentPassword and newPassword are required" });
          }
  
          // 원래 비밀번호 확인
          const userByEmail = await userDao.findUserPasswordById(user.user_id);
        if (!userByEmail ) {
          return res.status(401).json({error: '사용자를 찾을 수 없습니다. '})
        }

        const isPasswordValid = await userDao.verifyPassword(
          currentPassword,
          userByEmail.password ?? ''
        );
        if (isPasswordValid) {
          await userDao.updatePassword(user.user_id, newPassword)

          return res.status(200).json({ message: "비밀번호가 성공적으로 업데이트 되었습니다. " });
        }
        else  
         { return res.status(400).json({ message: "오류가 발생했습니다. " });}
        } 
        catch (err) {
        res.status(500).json({ error: '내부 서버 오류' });
      }
    }
  );
  
  
export default router;
