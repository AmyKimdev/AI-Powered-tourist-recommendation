import { db_connection } from '../config';
import commonError from '../utils/commonErrors';
import AppError from '../utils/AppError';

class MyPageDao {
    static async getTitles(userId: string) {
        try {
            const { rows } = await db_connection.query(
                `
                SELECT title, planner_id, MAX(days) as max_days, MAX(updated_at) as latest_update
                FROM travel_plan
                WHERE user_id = $1
                GROUP BY title, planner_id
                `,
                [userId]
            );
            return rows;
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to retrieve data from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async updateTitle(userId: string, plannerId: number, oldTitle: string, newTitle: string): Promise<void> {
        try {
            await db_connection.query(
                `
                UPDATE travel_plan
                SET title = $1, updated_at = timezone('Asia/Seoul', CURRENT_TIMESTAMP)
                WHERE user_id = $2 AND planner_id = $3 AND title = $4
                `,
                [newTitle, userId, plannerId, oldTitle]
            );
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to update title in the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async deleteTitle(userId: string, plannerId: number, title: string): Promise<void> {
        try {
            await db_connection.query(
                `
                DELETE FROM travel_plan
                WHERE user_id = $1 AND planner_id = $2 AND title = $3
                `,
                [userId, plannerId, title]
            );
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to delete title from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

}

export default MyPageDao;
