import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import {
  Strategy as KakaoStrategy,
  Profile as KakaoProfile
} from 'passport-kakao';
import { Strategy as LocalStrategy } from 'passport-local';
import { userDao } from '../DAO';
import {
  googleClientID,
  googleClientSecret,
  googleCallbackURL,
  kakaoClientID,
  kakaoClientSecret,
  kakaoCallbackURL
} from '../config';
import { nanoid } from 'nanoid';
import crypto from 'crypto';
import AppError from '../utils/AppError';
import commonErrors from '../utils/commonErrors';
import dotenv from 'dotenv';

dotenv.config();

// 한 달 이내인지 확인하는 함수
function isWithinLastMonth(date: Date): boolean {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return date > oneMonthAgo;
}

// 유저 로그인 또는 생성 처리하는 헬퍼 함수
async function handleUserLoginOrCreate(
  email: string,
  platform: string | null,
  profile: any,
  cb: any
) {
  try {
    const userRows = await userDao.findUser(email, platform);

    if (userRows.length > 0) {
      const user = userRows[0];

      if (user.deleted_at && isWithinLastMonth(new Date(user.deleted_at))) {
        await userDao.updateDeletedAtToNull(user.user_id);
        return cb(null, user);
      }

      if (user.deleted_at) {
        const uuid = crypto.randomUUID();
        let display_name = null;
        let nickname = null;

        if (platform === null) {
          display_name = profile.display_name;
        } else {
          display_name = profile.displayName
            ? profile.displayName
            : profile.name;
          nickname = nanoid(7);
        }

        await userDao.createUser(uuid, email, platform, display_name, nickname);

        const user = {
          user_id: uuid,
          email,
          displayName: display_name
        };
        return cb(null,user);
      }

      return cb(null, user);
    } else {
      const uuid = crypto.randomUUID();
      let display_name = null;
      let nickname = null;

      if (platform === null) {
        display_name = profile.display_name;
      } else {
        display_name = profile.displayName ? profile.displayName : profile.name;
        nickname = nanoid(7);
      }

      await userDao.createUser(uuid, email, platform, display_name, nickname);

      const user = {
        user_id: uuid,
        email,
        displayName: display_name
      };
      return cb(null, user);
    }
  } catch (err) {
    return cb(err);
  }
}

// 구글 passport
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackURL,
      scope: ['profile', 'email']
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: (err: any, user?: any) => void
    ) => {
      const email = profile.emails?.[0].value;
      if (!email) {
        return cb(
          new AppError(
            commonErrors.resourceNotFoundError,
            '이메일이 존재하지 않습니다.',
            { httpCode: 400 }
          )
        );
      }
      handleUserLoginOrCreate(email, 'google', profile, cb);
    }
  )
);

// 카카오 passport
passport.use(
  new KakaoStrategy(
    {
      clientID: kakaoClientID,
      clientSecret: kakaoClientSecret,
      callbackURL: kakaoCallbackURL
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: KakaoProfile,
      cb: (err: any, user?: any) => void
    ) => {
      const email = profile._json.kakao_account.email;
      if (!email) {
        return cb(
          new AppError(
            commonErrors.resourceNotFoundError,
            '이메일이 존재하지 않습니다.',
            { httpCode: 400 }
          )
        );
      }
      handleUserLoginOrCreate(email, 'kakao', profile, cb);
    }
  )
);

// 로컬 passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await userDao.findLocalUser(email);

        if (!user) {
          return done(null, false, { message: '이메일이 존재하지 않습니다.' });
        }

        const isPasswordValid = await userDao.verifyPassword(
          password,
          user.password ?? ''
        );

        if (!isPasswordValid) {
          return done(null, false, {
            message: '비밀번호가 일치하지 않습니다.'
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, cb: (err: any, id?: any) => void) => {
  if (!user || !user.user_id) {
    return cb(
      new AppError(
        commonErrors.resourceNotFoundError,
        '사용자를 찾을 수 없습니다.'
      )
    );
  }
  cb(null, { user_id: user.user_id });
});

passport.deserializeUser((user: any, cb: (err: any, user?: any) => void) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

export default passport;
