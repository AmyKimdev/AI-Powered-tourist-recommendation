import { Pool } from 'pg';
import { TravelPlanRequest } from '../types/travelPlanInterface';
import { db_connection } from '../config';

export class TravelPlanDao {
    async createOrUpdateTravelPlan(data: TravelPlanRequest): Promise<void> {
        const client = await db_connection.connect();
        try {
            await client.query('BEGIN');

            const deleteQuery = 'DELETE FROM travel_plan WHERE planner_id = $1 AND user_id = $2';
            await client.query(deleteQuery, [data.planner_id, data.user_id]);

            const insertQuery = `
                INSERT INTO travel_plan (user_id, sigungu_id, planner_id, place_id, sequence, title, days, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            `;

            for (const item of data.cart) {
                await client.query(insertQuery, [
                    data.user_id,
                    data.sigungu_id,
                    data.planner_id,
                    item.place_id,
                    item.sequence,
                    data.title,
                    item.days
                ]);
            }

            for (const item of data.plan) {
                await client.query(insertQuery, [
                    data.user_id,
                    data.sigungu_id,
                    data.planner_id,
                    item.place_id,
                    item.sequence,
                    data.title,
                    item.days
                ]);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getTravelPlans(user_id: string, planner_id: number): Promise<any> {
        const client = await db_connection.connect();
        try {
            const query = `
                SELECT tp.*, pm.title as place_name 
                FROM travel_plan tp
                JOIN planner_market pm ON tp.place_id = pm.id
                WHERE tp.user_id = $1 AND tp.planner_id = $2
                ORDER BY tp.sequence
            `;
            const result = await client.query(query, [user_id, planner_id]);

            // 데이터를 프론트엔드에서 기대하는 형식으로 변환
            const plans = result.rows.reduce((acc: any, plan: any) => {
                if (!acc.cart) acc.cart = [];
                if (!acc.plan) acc.plan = [];

                if (plan.days === 0) {
                    acc.cart.push({
                        days: plan.days,
                        place_id: plan.place_id,
                        sequence: plan.sequence,
                        place_name: plan.place_name
                    });
                } else {
                    acc.plan.push({
                        days: plan.days,
                        place_id: plan.place_id,
                        sequence: plan.sequence,
                        place_name: plan.place_name
                    });
                }

                return acc;
            }, {});

            return {
                user_id: user_id,
                sigungu_id: result.rows[0]?.sigungu_id || 0,
                planner_id: planner_id,
                title: result.rows[0]?.title || '',
                cart: plans.cart || [],
                plan: plans.plan || []
            };
        } finally {
            client.release();
        }
    }
}

export default TravelPlanDao;
