import express from 'express';
import passport from 'passport';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import crypto from 'crypto';
import { connectToSupabase, db_connection } from './src/config';
import {
  authRouter,
  imageRouter,
  weatherRouter,
  sigunguRouter,
  tourRouter,
  densenetRouter,
  scratchMapRouter,
  plannerMarketRouter,
  combinedRouter,
  myPageRouter,
  userRouter,
  travelPlanRouter
} from './src/routes';
import { generateResponse } from './src/geminiAPI';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import './src/middlewares/passport';
import cookieParser from 'cookie-parser';

dotenv.config();

console.log('Supabase URL:', process.env.SUPABASE_PROJECT_URL);
console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY);
console.log('Gemini API URL:', process.env.GEMINI_API_URL);
console.log('Gemini API Key:', process.env.GEMINI_API_KEY);

const app = express();
const port = 3000;

app.use(cookieParser());
connectToSupabase();


app.use(bodyParser.json());
app.use(express.json());

// 세션 설정
const pgSessionStore = pgSession(session);
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(
  cors({
    origin: 'http://localhost:3001', // 요청을 허용할 출처
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: 'http://localhost:3001' // 요청을 허용할 출처
//   })
// );

app.use(
  session({
    store: new pgSessionStore({
      pool: db_connection,
      tableName: 'sessions',
      schemaName: 'public',
      createTableIfMissing: true
    }),
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30분
      secure: false,
      httpOnly: true
    }
  })
);

// passport 연결
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRouter);
app.use('/api', imageRouter);
app.use('/api', weatherRouter);
app.use('/api', sigunguRouter);
app.use('/api', tourRouter);
app.use('/api', densenetRouter);
app.use('/api', scratchMapRouter);
app.use('/api', plannerMarketRouter);
app.use('/api', combinedRouter);
app.use('/api', myPageRouter);
app.use('/api', userRouter);

app.use('/api', travelPlanRouter);

app.get('/api/generate', generateResponse);

// 기본 경로 설정
// app.get('/', (req, res) => {
//   res.send('pict 서버 작동~');
// });

app.listen(port, () => {
  console.log(`
    #############################################
        🛡️ Server listening on port: ${port} 🛡️
    #############################################
  `);
});
