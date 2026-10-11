export type LeadInput = {
  contactName: string;
  jobTitle: string;
  industry: string | null;
  email: string;
  country: string;
};

export type LeadMappingError = {
  field: string;
  reason: "required" | "invalid_type" | "invalid_format";
};

export type LeadMappingResult =
  | { ok: true; lead: LeadInput }
  | { ok: false; errors: LeadMappingError[] };

function requiredText(
  row: Record<string, unknown>,
  field: string,
  errors: LeadMappingError[],
): string | undefined {
  const value = row[field];
  if (value === undefined || value === null || value === "") {
    errors.push({ field, reason: "required" });
    return undefined;
  }
  if (typeof value !== "string") {
    errors.push({ field, reason: "invalid_type" });
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push({ field, reason: "required" });
    return undefined;
  }
  return trimmed;
}

export function mapLeadRow(row: Record<string, unknown>): LeadMappingResult {
  const errors: LeadMappingError[] = [];
  const contactName = requiredText(row, "Decision Maker Name", errors);
  const jobTitle = requiredText(row, "Decision Maker Title", errors);
  const email = requiredText(row, "Email Address", errors);
  const country = requiredText(row, "Country", errors);

  const rawIndustry = row.Industry;
  let industry: string | null = null;
  if (rawIndustry !== undefined && rawIndustry !== null) {
    if (typeof rawIndustry !== "string") {
      errors.push({ field: "Industry", reason: "invalid_type" });
    } else {
      industry = rawIndustry.trim() || null;
    }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "Email Address", reason: "invalid_format" });
  }

  if (errors.length || !contactName || !jobTitle || !email || !country) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    lead: {
      contactName,
      jobTitle,
      industry,
      email: email.toLowerCase(),
      country,
    },
  };
}
