export interface ServedCountry {
  id: string;
  code: string;
  name: string;
}

// PLACEHOLDER list: confirm real served markets with the client.
export const servedCountries: ServedCountry[] = [
  { id: "ae", code: "AE", name: "United Arab Emirates" },
  { id: "qa", code: "QA", name: "Qatar" },
  { id: "sa", code: "SA", name: "Saudi Arabia" },
  { id: "om", code: "OM", name: "Oman" },
  { id: "kw", code: "KW", name: "Kuwait" },
  { id: "bh", code: "BH", name: "Bahrain" },
];
