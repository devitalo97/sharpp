/**
 * Formata timestamp de expiração em string legível
 */
export function formatExpiry(expiresAt?: number): string {
  if (!expiresAt) {
    return "Sem expiração informada";
  }

  const now = Date.now() / 1000;
  const diff = expiresAt - now;

  if (diff <= 0) {
    const expired = Math.abs(diff);
    if (expired < 60) return "Expirado há poucos segundos";
    if (expired < 3600) return `Expirado há ${Math.floor(expired / 60)} min`;
    if (expired < 86400) return `Expirado há ${Math.floor(expired / 3600)} h`;
    return `Expirado há ${Math.floor(expired / 86400)} dias`;
  }

  if (diff < 60) return "Expira em poucos segundos";
  if (diff < 3600) return `Expira em ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Expira em ${Math.floor(diff / 3600)} h`;
  return `Expira em ${Math.floor(diff / 86400)} dias`;
}
