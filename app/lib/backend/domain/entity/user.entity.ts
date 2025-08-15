export interface User {
  id: string;
  email: string;
  name?: string;
  locale?: string; // ex.: "en-US", "pt-BR"
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  is_active: boolean;
}
