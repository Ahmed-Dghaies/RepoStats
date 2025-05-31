import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Code, Loader2 } from "lucide-react";
import { RepositoryInfo } from "@/types/repository";
import { runStaticAnalysis } from "../../services/repositories";
import { SemgrepFinding, SemgrepResult } from "./types";

interface CodeAnalysisProps {
  repositoryDetails: RepositoryInfo;
}

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

      const results = await runStaticAnalysis({
        owner: repositoryDetails.owner.login,
        repository: repositoryDetails.name,
      });

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
      const category = finding.extra?.metadata?.category || "Other";
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
                        <Badge className={getSeverityColor(finding.extra.severity)}>
                          {finding.extra.severity}
                        </Badge>
                        <span className="font-medium">{finding.check_id}</span>
                      </div>
                      <p className="mb-2">{finding.extra.message}</p>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">File:</span> {finding.path}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> Line {finding.start.line},
                          Column {finding.start.col}
                        </div>
                        {finding.extra?.metadata?.category && (
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            {finding.extra.metadata.category}
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
                          <Badge className={getSeverityColor(finding.extra.severity)}>
                            {finding.extra.severity}
                          </Badge>
                          <span className="font-medium">{finding.check_id}</span>
                        </div>
                        <p className="mb-2">{finding.extra.message}</p>
                        <div className="text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">File:</span>{" "}
                            <span className="break-all">{finding.path}</span>
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
