import { db_connection } from '../config';
import { User } from '../types';
import bcrypt from 'bcrypt';
import commonError from '../utils/commonErrors';
import AppError from '../utils/AppError';

class userDao {
    // 유저 찾기
    static async findUser(email: string, platform: string | null): Promise<User[]> {
        try {
            const { rows } = await db_connection.query('SELECT * FROM "users" WHERE platform_type = $1 AND email = $2 AND deleted_at IS NULL', [
                platform,
                email,
            ]);
            return rows;
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async findUserById(userId: string): Promise<User | null> {
        try{
        const { rows } = await db_connection.query('SELECT platform_type, email, display_name,verified_email FROM "users" WHERE user_id = $1 AND deleted_at IS NULL', [
            userId
        ]);
        return rows.length > 0 ? rows[0] : null;
        } catch(error) {
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async findUserPasswordById(userId: string): Promise<User | null> {
        try{
        const { rows } = await db_connection.query('SELECT password FROM "users" WHERE user_id = $1 AND deleted_at IS NULL', [
            userId
        ]);
        return rows.length > 0 ? rows[0] : null;
        } catch(error) {
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // 유저 생성
    static async createUser(uuid: string, email: string, platform: string | null, displayName: string, nickname: string | null): Promise<void> {
        try{
        await db_connection.query(
            `INSERT INTO "users" (user_id, platform_type, email, "display_name", "nickname", created_at, updated_at, deleted_at)
            VALUES ($1, $2, $3, $4, $5, timezone('Asia/Seoul', CURRENT_TIMESTAMP), NULL, NULL)`,
            [uuid, platform, email, displayName, nickname]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async updateUser(email :string, displayName:string, uuid: string ): Promise<void> {
        try{
        await db_connection.query(
            `UPDATE "users" SET email = $1, display_name = $2 WHERE user_id = $3 AND deleted_at IS NULL`,
            [email, displayName, uuid]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // 유저 soft_delete
    static async deleteUser(userId: string): Promise<void> {
        try{
        await db_connection.query(
            `UPDATE "users" SET deleted_at = timezone('Asia/Seoul', CURRENT_TIMESTAMP) WHERE user_id = $1 AND deleted_at IS NULL`,
            [userId]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // deleted_at을 null로 업데이트
    static async updateDeletedAtToNull(userId: string): Promise<void> {
        try{
        await db_connection.query(
            `UPDATE "users" SET deleted_at = NULL WHERE user_id = $1 AND deleted_at IS NULL`,
            [userId]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // 로컬 회원가입
    static async createLocalUser(uuid: string, email: string, password: string, display_name: string, verified_email:boolean): Promise<void> {
        try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await db_connection.query(
            `INSERT INTO "users" (user_id, platform_type, email, password, display_name, created_at, updated_at, deleted_at, verified_email)
            VALUES ($1, 'local', $2, $3, $4, timezone('Asia/Seoul', CURRENT_TIMESTAMP), NULL, NULL,$5)`,
            [uuid, email, hashedPassword, display_name, verified_email]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to create a user in the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async createResetTokenByEmail(token: string, email: string): Promise<void> {
        try {
            await db_connection.query(
                `UPDATE "users" SET reset_token = $1 WHERE email = $2 AND platform_type = 'local' AND deleted_at IS NULL`,
                [token, email]
            );
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to create a user in the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }
    

    static async updateTrueLocalUser(token:string): Promise<void> {
        try{
        await db_connection.query(
            `UPDATE "users" 
            SET "verified_email" = TRUE 
            WHERE "reset_token" = $1 AND "deleted_at" IS NULL;
            `,
            [token]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to create a user in the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // 로컬 로그인을 위한 사용자 찾기
    static async findLocalUser(email: string): Promise<User | null> {
        try{
        const { rows } = await db_connection.query('SELECT * FROM "users" WHERE platform_type = $1 AND email = $2 AND deleted_at is NULL' , [
            'local',
            email,
        ]);
        return rows.length > 0 ? rows[0] : null;
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a user from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // 비밀번호 일치하는지
    static async verifyPassword(plainPassword: string, hashedPassword: string | null): Promise<boolean> {
        try{
        if (hashedPassword === null) {
            return false;
        }
        return bcrypt.compare(plainPassword, hashedPassword);
    }catch(error){
        const appError = new AppError(commonError.databaseError, 'Failed to verify password', 
            { cause: error instanceof Error ? error : new Error(String(error)) }
        );
        throw appError;
    }
    }
    // 비밀번호 검증
    static async verifyPasswordByUserId(userId: string, password: string): Promise<boolean> {
        try {
            const { rows } = await db_connection.query('SELECT password FROM "users" WHERE user_id = $1', [userId]);
    
            if (rows.length === 0) {
                return false; 
            }
    
            const hashedPassword = rows[0].password;
    
            const isMatch = await bcrypt.compare(password, hashedPassword);
            
            return isMatch;
    
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to verify password', {
                cause: error instanceof Error ? error : new Error(String(error))
            });
            throw appError;
        }
    }

    // 비밀번호 변경
    static async updatePassword(userId: string, newPassword: string): Promise<void> {
        try{
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db_connection.query(
            `UPDATE "users" SET password = $1, updated_at = timezone('Asia/Seoul', CURRENT_TIMESTAMP) WHERE user_id = $2 AND deleted_at is NULL`,
            [hashedPassword, userId]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to update password', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async updatePasswordByEmail(email: string, newPassword: string): Promise<void> {
        try{
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db_connection.query(
            `UPDATE "users" SET password = $1, updated_at = timezone('Asia/Seoul', CURRENT_TIMESTAMP) WHERE email = $2 AND platform_type='local' AND deleted_at is NULL`,
            [hashedPassword, email]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to update password by email', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async updatePasswordByToken(token: string, newPassword: string): Promise<void> {
        try{
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db_connection.query(
            `UPDATE "users" SET password = $1, updated_at = timezone('Asia/Seoul', CURRENT_TIMESTAMP) WHERE reset_token = $2 AND platform_type='local' AND deleted_at is NULL`,
            [hashedPassword, token]
        );
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to update password by token', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    // 비밀번호 재설정을 위한 사용자 찾기
    static async findLocalUserByToken(token: string): Promise<User | null> {
        try {
            const { rows } = await db_connection.query('SELECT * FROM "users" WHERE reset_token = $1', [token]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to find a user by token from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async findEmailAndDisplayNameById(userId: string): Promise<{ email: string, display_name: string } | null> {
        try {
          const { rows } = await db_connection.query(
            'SELECT email, display_name FROM "users" WHERE user_id = $1 AND deleted_at is NULL',
            [userId]
          );
          return rows.length > 0 ? rows[0] : null;
        } catch (error) {
          const appError = new AppError(
            commonError.databaseError,
            "Failed to find email and display name from the DB",
            { cause: error instanceof Error ? error : new Error(String(error)) }
          );
          throw appError;
        }
      }

      static async updateDisplayName(userId: string, newDisplayName: string): Promise<void> {
        try {
            await db_connection.query(
                `
                UPDATE users
                SET display_name = $1, updated_at = timezone('Asia/Seoul', CURRENT_TIMESTAMP)
                WHERE user_id = $2 AND deleted_at is NULL
                `,
                [newDisplayName, userId]
            );
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to update display name in the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

}



export default userDao;
