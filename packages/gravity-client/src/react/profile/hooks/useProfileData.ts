import { useState, useEffect, useCallback } from "react";

// Types
export interface ProfileData {
  userId: string;
  workflowId: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    firstName: string;
    attributes: Record<string, any>;
    tags: string[];
  };
  insights: Record<string, any>;
  rawData: Record<string, any>;
  [key: string]: any;
}

export interface Memory {
  userId: string;
  workflowId: string;
  memoryId: string;
  content: {
    summary: string;
    importance: number;
    tags: string[];
    keyFacts: string[];
    decisions: string[];
    actionItems: string[];
    sentiment: string;
    topics: string[];
  };
  sourceConversationId: string;
  sourceMessageCount: number;
  timestamp: string;
}

export interface Insights {
  needs: {
    immediate: string[];
    upcoming: string[];
    latent: string[];
  };
  needsTags: string[];
  currentState: {
    stage?: string;
    situation?: string;
    challenges?: string[];
    priorities?: string[];
  };
}

export interface UseProfileDataOptions {
  apiUrl: string;
  getAccessToken?: () => Promise<string | null>;
}

export interface UseProfileDataReturn {
  profileData: ProfileData | null;
  memories: Memory[];
  insights: Insights | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch user profile and memories via REST API
 */
export function useProfileData(
  userId: string,
  workflowId: string,
  options: UseProfileDataOptions
): UseProfileDataReturn {
  const { apiUrl, getAccessToken } = options;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId || !workflowId) return;

    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken ? await getAccessToken() : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Fetch profile and memories in parallel
      const [profileRes, memoriesRes] = await Promise.all([
        fetch(`${apiUrl}/api/profiles/${userId}/${workflowId}`, { headers }),
        fetch(`${apiUrl}/api/memories/${userId}/${workflowId}?limit=100`, { headers }),
      ]);

      // Process profile
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile) {
          const transformedData: ProfileData = {
            userId: profile.userId,
            workflowId: profile.workflowId,
            profile: {
              name: profile.profile?.name || "",
              email: profile.profile?.email || "",
              phone: profile.profile?.phone || "",
              firstName: profile.profile?.firstName || "",
              attributes: profile.profile?.attributes || {},
              tags: profile.profile?.tags || [],
            },
            insights: profile.insights || {},
            rawData: profile.rawData || {},
            ...(profile.rawData || {}),
          };
          setProfileData(transformedData);

          if (profile.insights) {
            setInsights({
              needs: profile.insights.needs || { immediate: [], upcoming: [], latent: [] },
              needsTags: profile.insights.needsTags || [],
              currentState: profile.insights.currentState || {},
            });
          }
        }
      }

      // Process memories
      if (memoriesRes.ok) {
        const memoriesData = await memoriesRes.json();
        setMemories(memoriesData || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, workflowId, apiUrl, getAccessToken]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profileData,
    memories,
    insights,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useProfileData;
