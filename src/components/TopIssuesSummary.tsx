"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface IssueSummary {
  category: string;
  count: number;
  description: string;
  status: string;
  id: string;
}

interface TopIssuesSummaryProps {
  userId: string;
}

export default function TopIssuesSummary({ userId }: TopIssuesSummaryProps) {
  const [loading, setLoading] = useState(true);
  const [issuesSummary, setIssuesSummary] = useState<IssueSummary[]>([]);

  useEffect(() => {
    if (!userId) return;

    async function fetchIssueSummary() {
      setLoading(true);
      try {
        // Fetch the raw user data first
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        // Call Gemini API to analyze and categorize the issues
        const analyzeResponse = await fetch('/api/analyze-issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            incidents: userData.incidents
          }),
        });
        
        if (!analyzeResponse.ok) {
          throw new Error('Failed to analyze issues');
        }
        
        const { categorizedIssues } = await analyzeResponse.json();
        setIssuesSummary(categorizedIssues);
      } catch (error) {
        console.error('Error in issue analysis:', error);
        setIssuesSummary([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchIssueSummary();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "open":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "billing":
        return "bg-purple-100 text-purple-800";
      case "network":
        return "bg-blue-100 text-blue-800";
      case "plan":
      case "subscription":
        return "bg-green-100 text-green-800";
      case "hardware":
      case "device":
        return "bg-orange-100 text-orange-800";
      case "customer service":
      case "support":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 text-gray-500">TOP ISSUES SUMMARY</h3>
        <Card>
          <CardContent className="p-3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!issuesSummary.length) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 text-gray-500">TOP ISSUES SUMMARY</h3>
        <Card>
          <CardContent className="p-3 text-center py-6">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <AlertCircle className="mb-2" size={20} />
              <p>No issues found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-500">TOP ISSUES SUMMARY</h3>
      <Card>
        <CardContent className="p-3">
          <div className="space-y-2">
            {issuesSummary.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(issue.category)}>
                      {issue.category}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">
                      {issue.count} {issue.count === 1 ? 'issue' : 'issues'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 mt-1 line-clamp-1" title={issue.description}>
                    {issue.description}
                  </span>
                </div>
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}