export interface SemgrepFinding {
  check_id: string;
  path: string;
  start: { line: number; col: number };
  end: { line: number; col: number };
  extra: {
    message: string;
    severity: "ERROR" | "WARNING" | "INFO";
    metadata: {
      category: string;
      technology: string[];
      confidence: string;
      likelihood: string;
      impact: string;
      subcategory: string[];
    };
  };
}

export interface SemgrepResult {
  results: SemgrepFinding[];
  errors: string[];
  status: "success" | "error" | "running" | "idle";
}
