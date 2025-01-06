import { db_connection } from '../config';
import { ScratchMap } from '../types';
import commonError from '../utils/commonErrors';
import AppError from '../utils/AppError';

class ScratchMapDao {
    static async addScratchMap(entry: ScratchMap): Promise<void> {
        const { user_id, sigungu_id } = entry;
        try {
            await db_connection.query(
                'INSERT INTO scratch_map (user_id, sigungu_id) VALUES ($1, $2)',
                [user_id, sigungu_id]
            );
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to add a scratch map entry to the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async getSigunguIdByName(sigungu_name: string): Promise<number | null> {
        try {
            const { rows } = await db_connection.query(
                'SELECT id FROM sigungu WHERE name = $1',
                [sigungu_name]
            );
            return rows.length > 0 ? rows[0].id : null;
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to get sigungu id from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async getScratchMapByUserId(user_id: string): Promise<{ name: string }[]> { 
        try {
            const { rows } = await db_connection.query(
                `
                SELECT s.name as sigungu  
                FROM scratch_map sm
                JOIN sigungu s ON sm.sigungu_id = s.id
                WHERE sm.user_id = $1 AND sm.deleted IS NOT TRUE
                `,
                [user_id]
            );
            return rows;
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to get scratch map entries from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

    static async toggleScratchMap(user_id: string, sigungu_name: string): Promise<void> {
        try {
            const sigungu_id = await this.getSigunguIdByName(sigungu_name);
            if (sigungu_id === null) {
                throw new AppError(commonError.databaseError, `Sigungu name ${sigungu_name} not found`);
            }

            const { rows } = await db_connection.query(
                'SELECT deleted FROM scratch_map WHERE user_id = $1 AND sigungu_id = $2',
                [user_id, sigungu_id]
            );

            if (rows.length === 0) {
                // 없으면 생성
                await this.addScratchMap({ user_id, sigungu_id });
            } else {
                // delete update
                const currentStatus = rows[0].deleted;
                await db_connection.query(
                    'UPDATE scratch_map SET deleted = $1 WHERE user_id = $2 AND sigungu_id = $3',
                    [!currentStatus, user_id, sigungu_id]
                );
            }
        } catch (error) {
            const appError = new AppError(commonError.databaseError, 'Failed to toggle a scratch map entry in the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }
}

export default ScratchMapDao;
