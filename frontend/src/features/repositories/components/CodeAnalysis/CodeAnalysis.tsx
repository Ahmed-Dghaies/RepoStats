"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Code, Loader2 } from "lucide-react";
import { RepositoryInfo } from "@/types/repository";

interface SemgrepFinding {
  check_id: string;
  path: string;
  start: { line: number; col: number };
  end: { line: number; col: number };
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
}

interface SemgrepResult {
  results: SemgrepFinding[];
  errors: string[];
  status: "success" | "error" | "running" | "idle";
}

interface CodeAnalysisProps {
  repositoryDetails: RepositoryInfo;
}

const semGrepExample: SemgrepResult = {
  results: [
    {
      check_id: "javascript.express.security.audit.express-open-redirect",
      path: "src/routes/auth.js",
      start: { line: 42, col: 3 },
      end: { line: 42, col: 28 },
      message:
        "Possible open redirect vulnerability detected. User-controlled redirect URLs can lead to phishing attacks.",
      severity: "ERROR",
      metadata: {
        category: "Security",
        technology: ["javascript", "express"],
        confidence: "HIGH",
        likelihood: "MEDIUM",
        impact: "HIGH",
        subcategory: ["open-redirect", "user-controlled"],
      },
    },
    {
      check_id: "javascript.react.security.audit.react-dangerouslysetinnerhtml",
      path: "src/components/Comment.jsx",
      start: { line: 15, col: 7 },
      end: { line: 17, col: 8 },
      message:
        "Detected dangerouslySetInnerHTML which could lead to XSS vulnerabilities. Ensure user input is properly sanitized.",
      severity: "ERROR",
      metadata: {
        category: "Security",
        technology: ["javascript", "react"],
        confidence: "HIGH",
        likelihood: "HIGH",
        impact: "HIGH",
        subcategory: ["xss", "injection"],
      },
    },
    {
      check_id: "javascript.node.security.audit.path-traversal",
      path: "src/utils/fileHandler.js",
      start: { line: 23, col: 12 },
      end: { line: 23, col: 54 },
      message:
        "Path traversal vulnerability detected. User-controlled file paths can lead to unauthorized file access.",
      severity: "ERROR",
      metadata: {
        category: "Security",
        technology: ["javascript", "node"],
        confidence: "HIGH",
        likelihood: "MEDIUM",
        impact: "HIGH",
        subcategory: ["path-traversal", "file-access"],
      },
    },
    {
      check_id: "javascript.node.security.audit.sql-injection",
      path: "src/models/user.js",
      start: { line: 78, col: 22 },
      end: { line: 78, col: 65 },
      message: "Possible SQL injection detected. User input should be parameterized.",
      severity: "ERROR",
      metadata: {
        category: "Security",
        technology: ["javascript", "sql"],
        confidence: "HIGH",
        likelihood: "HIGH",
        impact: "HIGH",
        subcategory: ["sql-injection", "database"],
      },
    },
    {
      check_id: "javascript.react.performance.react-usecallback-missing",
      path: "src/components/UserList.jsx",
      start: { line: 31, col: 19 },
      end: { line: 34, col: 3 },
      message:
        "Function created in component body without useCallback. This may lead to unnecessary re-renders.",
      severity: "WARNING",
      metadata: {
        category: "Performance",
        technology: ["javascript", "react"],
        confidence: "MEDIUM",
        likelihood: "MEDIUM",
        impact: "LOW",
        subcategory: ["hooks", "optimization"],
      },
    },
    {
      check_id: "javascript.react.performance.react-usememo-missing",
      path: "src/components/Dashboard.jsx",
      start: { line: 45, col: 21 },
      end: { line: 52, col: 3 },
      message:
        "Complex computation in component body without useMemo. This may cause unnecessary recalculations.",
      severity: "WARNING",
      metadata: {
        category: "Performance",
        technology: ["javascript", "react"],
        confidence: "MEDIUM",
        likelihood: "MEDIUM",
        impact: "LOW",
        subcategory: ["hooks", "optimization"],
      },
    },
    {
      check_id: "javascript.node.correctness.audit.detect-non-literal-fs-filename",
      path: "src/services/fileService.js",
      start: { line: 12, col: 15 },
      end: { line: 12, col: 42 },
      message:
        "Using a non-literal value in fs module methods can lead to path traversal vulnerabilities.",
      severity: "WARNING",
      metadata: {
        category: "Correctness",
        technology: ["javascript", "node"],
        confidence: "MEDIUM",
        likelihood: "MEDIUM",
        impact: "MEDIUM",
        subcategory: ["filesystem", "path-traversal"],
      },
    },
    {
      check_id: "javascript.node.security.audit.detect-eval-with-expression",
      path: "src/utils/dynamicCode.js",
      start: { line: 8, col: 3 },
      end: { line: 8, col: 25 },
      message:
        "Detected eval() with a variable. This is a security risk as it can lead to code injection.",
      severity: "ERROR",
      metadata: {
        category: "Security",
        technology: ["javascript", "node"],
        confidence: "HIGH",
        likelihood: "HIGH",
        impact: "HIGH",
        subcategory: ["code-injection", "eval"],
      },
    },
    {
      check_id: "javascript.node.security.audit.detect-non-literal-regexp",
      path: "src/utils/validation.js",
      start: { line: 17, col: 19 },
      end: { line: 17, col: 39 },
      message: "Detected RegExp constructor with a variable. This can lead to ReDoS attacks.",
      severity: "WARNING",
      metadata: {
        category: "Security",
        technology: ["javascript", "node"],
        confidence: "MEDIUM",
        likelihood: "LOW",
        impact: "MEDIUM",
        subcategory: ["redos", "regexp"],
      },
    },
    {
      check_id: "javascript.react.best-practice.react-props-spreading",
      path: "src/components/Button.jsx",
      start: { line: 5, col: 10 },
      end: { line: 5, col: 25 },
      message:
        "Detected props spreading in React component. This can lead to unintended props being passed down.",
      severity: "INFO",
      metadata: {
        category: "Best Practices",
        technology: ["javascript", "react"],
        confidence: "MEDIUM",
        likelihood: "LOW",
        impact: "LOW",
        subcategory: ["props", "maintainability"],
      },
    },
    {
      check_id: "javascript.node.security.audit.detect-insecure-randomness",
      path: "src/utils/crypto.js",
      start: { line: 5, col: 19 },
      end: { line: 5, col: 36 },
      message:
        "Using Math.random() for security-sensitive operations. Use crypto.randomBytes() instead.",
      severity: "WARNING",
      metadata: {
        category: "Security",
        technology: ["javascript", "node"],
        confidence: "HIGH",
        likelihood: "MEDIUM",
        impact: "MEDIUM",
        subcategory: ["crypto", "randomness"],
      },
    },
    {
      check_id: "javascript.node.security.audit.detect-nosql-injection",
      path: "src/models/product.js",
      start: { line: 42, col: 25 },
      end: { line: 42, col: 58 },
      message:
        "Possible NoSQL injection detected. User input should be sanitized before using in queries.",
      severity: "ERROR",
      metadata: {
        category: "Security",
        technology: ["javascript", "mongodb"],
        confidence: "HIGH",
        likelihood: "MEDIUM",
        impact: "HIGH",
        subcategory: ["nosql-injection", "database"],
      },
    },
  ],
  errors: [],
  status: "success",
};

const CodeAnalysis = ({ repositoryDetails }: CodeAnalysisProps) => {
  const [analysisState, setAnalysisState] = useState<SemgrepResult>({
    results: [],
    errors: [],
    status: "idle",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    try {
      setIsLoading(true);
      setAnalysisState({ results: [], errors: [], status: "running" });

      const results = semGrepExample;
      console.log(repositoryDetails);
      setAnalysisState({
        ...results,
        status: "success",
      });
    } catch (error) {
      setAnalysisState({
        results: [],
        errors: [error instanceof Error ? error.message : String(error)],
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "ERROR":
        return "bg-red-500";
      case "WARNING":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const groupFindingsByCategory = (findings: SemgrepFinding[]) => {
    const grouped = new Map<string, SemgrepFinding[]>();

    findings.forEach((finding) => {
      const category = finding.metadata?.category || "Other";
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(finding);
    });

    return grouped;
  };

  const groupedFindings = groupFindingsByCategory(analysisState.results);
  const categories = Array.from(groupedFindings.keys());

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Semgrep Security Analysis
          </div>
          <Button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            size="sm"
            className="hover:cursor-pointer"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysisState.status === "idle" && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Run Analysis" to perform a security scan on this repository
          </div>
        )}

        {analysisState.status === "running" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              Cloning repository and running Semgrep analysis...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few minutes depending on the repository size
            </p>
          </div>
        )}

        {analysisState.status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>
              {analysisState.errors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {analysisState.status === "success" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <span className="font-medium">Analysis Complete</span>
              </div>
              <Badge variant={analysisState.results.length > 0 ? "destructive" : "secondary"}>
                {analysisState.results.length} findings
              </Badge>
            </div>

            {analysisState.results.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>No issues found</AlertTitle>
                <AlertDescription>
                  Semgrep didn't detect any security issues in this repository.
                </AlertDescription>
              </Alert>
            ) : (
              <Tabs defaultValue={categories[0] || "all"}>
                <TabsList className="mb-4 overflow-x-auto">
                  <TabsTrigger value="all">All ({analysisState.results.length})</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category} ({groupedFindings.get(category)?.length})
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all">
                  {analysisState.results.map((finding, index) => (
                    <div key={index} className="mb-4 border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(finding.severity)}>
                          {finding.severity}
                        </Badge>
                        <span className="font-medium">{finding.check_id}</span>
                      </div>
                      <p className="mb-2">{finding.message}</p>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">File:</span> {finding.path}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> Line {finding.start.line},
                          Column {finding.start.col}
                        </div>
                        {finding.metadata?.category && (
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            {finding.metadata.category}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="overflow-y-auto">
                    {groupedFindings.get(category)?.map((finding, index) => (
                      <div key={index} className="mb-4 border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                          <span className="font-medium">{finding.check_id}</span>
                        </div>
                        <p className="mb-2">{finding.message}</p>
                        <div className="text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">File:</span> {finding.path}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> Line {finding.start.line}
                            , Column {finding.start.col}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeAnalysis;
