import { db_connection } from '../config';
import AppError from '../utils/AppError';
import commonError from '../utils/commonErrors';
import { PlannerMarket } from '../types';

class PlannerMarketDao {
  static async getCategoriesBySigunguId(sigungu_id: number): Promise<string[]> {
      try {
          const { rows } = await db_connection.query(
              'SELECT DISTINCT category FROM planner_market WHERE sigungu_id = $1',
              [sigungu_id]
          );
          return rows.map(row => row.category);
      } catch (error) {
          const appError = new AppError(commonError.databaseError, 'Failed to retrieve categories from the DB', {
              cause: error instanceof Error ? error : new Error(String(error))
          });
          throw appError;
      }
  }

  static async getItemsByCategoryAndSigunguId(sigungu_id: number, category: string): Promise<PlannerMarket[]> {
      try {
          const { rows } = await db_connection.query(
              'SELECT * FROM planner_market WHERE sigungu_id = $1 AND category = $2',
              [sigungu_id, category]
          );
          return rows;
      } catch (error) {
          const appError = new AppError(commonError.databaseError, 'Failed to retrieve items from the DB', {
              cause: error instanceof Error ? error : new Error(String(error))
          });
          throw appError;
      }
  }
}

export default PlannerMarketDao;