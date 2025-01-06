import { db_connection } from '../config';
import { Images } from '../types';
import commonError from '../utils/commonErrors';
import AppError from '../utils/AppError';

class ImagesDao{

    static async createUserImages(imgUrl: string): Promise< Images[] > {
        try{
        const {rows}=await db_connection.query(
            `INSERT INTO "imgs" ( img_url)
            VALUES ($1)`,
            [imgUrl]
        );
        return rows;
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a image from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }
}

export default ImagesDao