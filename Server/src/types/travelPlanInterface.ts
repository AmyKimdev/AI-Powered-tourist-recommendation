export interface TravelPlanRequest {
  user_id: string;
  sigungu_id: number;
  planner_id: number;
  place_id: number;
  sequence: number;
  title: string;
  days: number;
  updated_at?: Date;
  cart: {
      days: number;
      place_id: number;
      sequence: number;
  }[];
  plan: {
      days: number;
      place_id: number;
      sequence: number;
  }[];
}
