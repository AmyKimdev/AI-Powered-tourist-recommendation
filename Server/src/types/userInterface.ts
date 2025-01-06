export interface User {
    user_id: string;
    platform_type: string | null;
    email: string;
    password: string | null;
    display_name: string;
    nickname: string | null;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}
