export type LinkStatus = "Ativo" | "Pausado" | "Expirado";
export interface Promo {
  id: string;
  community_id: string;
  user_id?: string;
  name: string;

  /** URL base da campanha antes de UTMs */
  base_url: string;
  /** URL final com UTMs aplicadas (derivada; pode ser armazenada para performance) */
  final_url: string;

  referral_code?: string; // código de indicação (ex.: REF-ABCD)
  status: LinkStatus;
  labels?: string[];
}
