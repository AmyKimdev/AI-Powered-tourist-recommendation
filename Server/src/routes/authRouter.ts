import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { userDao } from '../DAO';
import crypto from 'crypto';
import { transporter } from '../config/transporter';
import { User } from '../types/userInterface';
import {clientURL} from '../config'

// 세션 타입 확장
declare module 'express-session' {
  interface SessionData {
    user_id: string;
  }
}

const router = express.Router();

// 구글 로그인 라우트
router.get(
  '/login/federated/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 로그인 성공 후 리디렉션 설정
router.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user as User;
    if (req.session) {
      req.session.user_id = user.user_id; // 세션에 사용자 ID 저장
    }

    res.redirect(`${clientURL}`);  // 성공 시 클라이언트에서 전달받은 URL로 리디렉션
  }
);

// 카카오 로그인 라우트
router.get('/login/federated/kakao', passport.authenticate('kakao'));

// 로그인 성공 후 리디렉션 설정
router.get(
  '/oauth2/redirect/kakao',
  passport.authenticate('kakao', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user as User;
    if (req.session) {
      req.session.user_id = user.user_id;
    }
    res.redirect(`${clientURL}`);  // 성공 시 리디렉션
  }
);

// 이메일 형식을 확인하는 함수
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 회원가입 라우트
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, display_name, verified_email } = req.body;

    if (!email || !password || !display_name) {
      return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: '유효한 이메일 형식을 입력해야 합니다.' });
    }

    // 이메일 중복 확인
    const existingUser = await userDao.findLocalUser(email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 회원 생성
    const uuid = crypto.randomUUID();
    await userDao.createLocalUser(uuid, email, password, display_name, verified_email);

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 로그인 라우트
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error | null, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // 로그인 성공 시 세션에 사용자 ID 저장
      if (req.session) {
        req.session.user_id = (user as User).user_id;
      }
      console.log('로그인 데이터 들어옴');
      res.status(200).json({
        message: '로그인 성공',
        display_name: user.display_name, // display_name 반환
        email: user.email // email 반환
      });
    });
  })(req, res, next);
});

//로그아웃
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: '세션 삭제 실패' });
      }
      res.clearCookie('connect.sid'); 
      res.status(200).json({ message: '로그아웃 성공' });
    });
  });
});


// 이메일 인증 메일 요청
router.post('/verify-email', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일은 필수입니다.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const resetLink = `${clientURL}/verify/email/${token}`;

  const mailOptions = {
    from: 'yolijoli343@gmail.com',
    to: email,
    subject: 'picT 이메일 인증',
    text: `링크를 눌러 이메일을 인증하세요 : ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await userDao.createResetTokenByEmail(token, email);
    res.status(200).json({ message: '인증 메일이 성공적으로 보내졌습니다. ' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '메일을 보내는 중 오류가 발생했습니다.' });
  }
});

// 이메일 인증
router.post('/verify-email/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await userDao.findLocalUserByToken(token);

    if (!user) {
      return res.status(400).json({ message: '잘못된 토큰' });
    }
    await userDao.updateTrueLocalUser(token);
    res.status(200).json({ message: '유저 인증이 성공적으로 되었습니다. ' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: '잘못된 토큰입니다. ' });
  }
});

// 비밀번호 재설정 링크 요청
router.post('/reset-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일은 필수입니다.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const resetLink = `${clientURL}/auth/reset-password/${token}`;

  const mailOptions = {
    from: 'yolijoli343@gmail.com',
    to: email,
    subject: 'picT 비밀번호 재설정',
    text: `링크를 눌러 비밀번호 재설정을 하세요: ${resetLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    await userDao.createResetTokenByEmail(token, email);
    res.status(200).json({ message: '재설정 메일이 성공적으로 보내졌습니다.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '잘못된 토큰입니다. ' });
  }
});

// 비밀번호 재설정
router.post('/reset-password/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await userDao.findLocalUserByToken(token);

    if (!user) {
      return res.status(400).json({ message: '잘못된 토큰입니다. ' });
    }

    await userDao.updatePasswordByToken( newPassword, token);
    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다. ' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: '잘못된 토큰입니다.' });
  }
});

export default router;
