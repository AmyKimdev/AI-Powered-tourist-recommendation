import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_CONFIG_HOST)

// DB 접속 설정 객체 생성을 위한 Pool, Connection parameters로 연결 (postgreSQL)
const db_connection: Pool = new Pool({
  host: process.env.DB_CONFIG_HOST,
  user: process.env.DB_CONFIG_USER,
  password: String(process.env.DB_CONFIG_PASSWORD), 
  database: process.env.DB_CONFIG_DATABASE,
  port: parseInt(process.env.DB_CONFIG_PORT ?? '5432', 10),
  ssl: {
    rejectUnauthorized: false,
  },
  options: '-c search_path=public', // Search path 설정
});

// DB 연결
const connectToSupabase = async () => {
  try {
    await db_connection.connect();
    console.log('Supabase PostgreSQL database 연결 성공');
  } catch (err) {
    console.error('Supabase PostgreSQL database 연결 실패', err);
  }
}
connectToSupabase();

const googleClientID = process.env.GOOGLE_ID ?? '';
const googleClientSecret = process.env.GOOGLE_SECRET ?? '';
const googleCallbackURL = process.env.GOOGLE_CALL_BACK_URL ?? '';

const kakaoClientID = process.env.KAKAO_ID ?? '';
const kakaoClientSecret = process.env.KAKAO_SECRET ?? '';
const kakaoCallbackURL = process.env.KAKAO_CALL_BACK_URL ?? '';

const clientURL=process.env.CLIENT_URL ?? '';

export { 
  connectToSupabase, 
  db_connection,
  googleClientID,
  googleClientSecret,
  googleCallbackURL,
  kakaoClientID,
  kakaoClientSecret,
  kakaoCallbackURL,
  clientURL
};
