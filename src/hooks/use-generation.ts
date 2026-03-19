"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type GenerationStatus = "idle" | "pending" | "processing" | "done" | "failed";

interface GenerateParams {
  imageUrl: string;
  prompt: string;
  category: string;
  style: string;
}

export function useGeneration() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  const pollStatus = useCallback(async (generationId: string) => {
    try {
      const response = await fetch(`/api/generate/${generationId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch generation status");
      }

      const data = await response.json();
      
      setStatus(data.status);
      
      if (data.status === "done") {
        setOutputUrl(data.outputUrl);
        setIsLoading(false);
        clearPolling();
      } else if (data.status === "failed") {
        setError("Generation failed. Please try again.");
        setIsLoading(false);
        clearPolling();
      }
      
    } catch (err) {
      console.error("Polling error:", err);
      setError(err instanceof Error ? err.message : "An error occurred while polling");
      setIsLoading(false);
      clearPolling();
    }
  }, [clearPolling]);

  const generate = useCallback(async (params: GenerateParams) => {
    setIsLoading(true);
    setError(null);
    setOutputUrl(null);
    setStatus("pending");
    clearPolling();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to start generation");
      }

      const { generationId } = await response.json();
      
      // Start polling
      pollingIntervalRef.current = setInterval(() => {
        pollStatus(generationId);
      }, 2000); // Poll every 2 seconds

    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
      setStatus("failed");
    }
  }, [pollStatus, clearPolling]);

  const reset = useCallback(() => {
    setStatus("idle");
    setOutputUrl(null);
    setError(null);
    setIsLoading(false);
    clearPolling();
  }, [clearPolling]);

  return {
    generate,
    reset,
    status,
    outputUrl,
    isLoading,
    error,
  };
}
