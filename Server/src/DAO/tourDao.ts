import { db_connection } from '../config';
import { Tour } from '../types/tourInterface';
import commonError from '../utils/commonErrors';
import AppError from '../utils/AppError';

class TourDao {
  static async getPlacesBySigungu(sigungu: string): Promise<Tour[]> {
      try {
          const { rows } = await db_connection.query(
              `SELECT * FROM "tours" WHERE sigungu = $1`,
              [sigungu]
          );
          if (rows.length === 0) {
              throw new Error(`No places found for sigungu: ${sigungu}`);
          }
          return rows;
      } catch (error: unknown) {
          console.error('Database query error:', error);
          if (error instanceof Error) {
              const appError = new AppError(
                  commonError.databaseError,
                  'Failed to find places for the selected sigungu from the DB',
                  { cause: error }
              );
              throw appError;
          } else {
              throw new AppError(
                  commonError.databaseError,
                  'Failed to find places for the selected sigungu from the DB',
                  { cause: new Error('Unknown error') }
              );
          }
      }
  }

  static async getCoordinatesAndExplanationByPlaces(gal_title:string): Promise<Tour[]> {
    try {
        const {rows } = await db_connection.query('SELECT "map_x", "map_y", "category" FROM "tours" WHERE "gal_title" = $1', [
            gal_title
        ]);
        return rows;
    } catch (error) {
        const appError = new AppError(commonError.databaseError, 'Failed to find a place from the DB', 
            { cause: error instanceof Error ? error : new Error(String(error)) }
        );
        throw appError;
    }
}
}

export default TourDao;
