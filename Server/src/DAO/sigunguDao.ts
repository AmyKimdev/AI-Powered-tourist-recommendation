import { db_connection } from '../config';
import { Sigungu } from '../types';
import commonError from '../utils/commonErrors';
import AppError from '../utils/AppError';

// 시군구 DAO는 모달창에 띄울 시군구에 대한 관광및 기본정보를 DB에서 보내줌

class SigunguDao{

    static async getExplanationBySigungu(name: string): Promise< Sigungu[] > {
        try{
        const {rows}=await db_connection.query(
            `SELECT "explanation" FROM "sigungu" WHERE name = $1`,
            [name]
        );
        return rows;
        }catch(error){
            const appError = new AppError(commonError.databaseError, 'Failed to find a sigungu from the DB', 
                { cause: error instanceof Error ? error : new Error(String(error)) }
            );
            throw appError;
        }
    }

}

export default SigunguDao