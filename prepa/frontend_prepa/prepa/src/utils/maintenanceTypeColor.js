const normalizeTypeCode = (value) => String(value ?? "").trim().toUpperCase();

const getTypeCode = (entry) =>
  entry?.enum_CODE ?? entry?.ENUM_CODE ?? entry?.enum_code ?? entry;

//                    Assurance.     PONCTUELLE.    PREVENTIVE.     VISITE_TEC
const TYPE_COLORS = ["#079030ff", "#845b02ff", "#004fe2ff", "#890790ff"];


export const getMaintenanceTypeColor = (type, availableTypes = []) => {
  const requestedType = normalizeTypeCode(type);
  if (!requestedType) return "#64748b";

  const typeCodes = [...new Set((Array.isArray(availableTypes) ? availableTypes : [])
    .map(getTypeCode)
    .map(normalizeTypeCode)
    .filter(Boolean))]
    .sort((first, second) => first.localeCompare(second));
  const typeIndex = typeCodes.indexOf(requestedType);

  if (typeIndex >= 0 && typeIndex < TYPE_COLORS.length) {
    return TYPE_COLORS[typeIndex];
  }

  const normalized = requestedType;

  let hash = 0;
  for (let index = 0; index < normalized.length; index++) {
    hash = (hash * 31 + normalized.charCodeAt(index)) % 360;
  }

  return `hsl(${hash || 175}, 68%, 38%)`;
};
