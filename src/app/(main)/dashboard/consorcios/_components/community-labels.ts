const UNIT_STATUS_LABELS: Record<string, string> = { ocupado: "Ocupada", desocupado: "Desocupada" };
const UNIT_TYPE_LABELS: Record<string, string> = { departamento: "Departamento" };
const RELATIONSHIP_LABELS: Record<string, string> = { propietario: "Propietario", inquilino: "Inquilino" };

// Values without a defined label still render readable: "en_obra" → "En obra".
function readable(value: string) {
  const text = value.replaceAll("_", " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function label(labels: Record<string, string>, value: string | null) {
  if (!value) return null;
  return labels[value.toLowerCase()] ?? readable(value);
}

export const unitStatusLabel = (value: string | null) => label(UNIT_STATUS_LABELS, value);
export const unitTypeLabel = (value: string | null) => label(UNIT_TYPE_LABELS, value);
export const relationshipLabel = (value: string | null) => label(RELATIONSHIP_LABELS, value);
