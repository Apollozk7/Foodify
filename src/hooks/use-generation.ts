"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type GenerationStatus = "idle" | "pending" | "processing" | "done" | "failed";

export interface Message {
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
  generatedImageUrl?: string;
  status?: GenerationStatus;
  timestamp: Date;
}

interface GenerateParams {
  imageUrl: string;
  prompt: string;
}

export function useGeneration() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  const pollStatus = useCallback(async (generationId: string, currentDelay: number = 2000) => {
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

        // Update the last AI message with the result
        setMessages(prev => {
          const lastAi = [...prev].reverse().find(m => m.role === "ai");
          if (lastAi) {
            return prev.map(m => m === lastAi ? { ...m, status: "done", generatedImageUrl: data.outputUrl } : m);
          }
          return prev;
        });
      } else if (data.status === "failed") {
        setError("Generation failed. Please try again.");
        setIsLoading(false);
        clearPolling();

        setMessages(prev => {
          const lastAi = [...prev].reverse().find(m => m.role === "ai");
          if (lastAi) {
            return prev.map(m => m === lastAi ? { ...m, status: "failed" } : m);
          }
          return prev;
        });
      } else if (data.status === "processing" || data.status === "pending") {
        if (data.status === "processing") {
          setMessages(prev => {
            const lastAi = [...prev].reverse().find(m => m.role === "ai");
            if (lastAi) {
              return prev.map(m => m === lastAi ? { ...m, status: "processing" } : m);
            }
            return prev;
          });
        }

        // Schedule next poll with exponential backoff (max 10s)
        const nextDelay = Math.min(currentDelay * 2, 10000);
        pollingTimeoutRef.current = setTimeout(() => {
          pollStatus(generationId, nextDelay);
        }, currentDelay);
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

    // Add user message to history
    const userMessage: Message = {
      role: "user",
      content: params.prompt,
      imageUrl: params.imageUrl,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

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

      const { generationId, aiMessage } = await response.json();

      // Add AI response to history
      const aiResponse: Message = {
        role: "ai",
        content: aiMessage,
        status: "pending",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Start polling
      pollingTimeoutRef.current = setTimeout(() => {
        pollStatus(generationId, 2000);
      }, 2000);

    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setIsLoading(false);
      setStatus("failed");

      // Add error message from AI if possible
      setMessages(prev => [...prev, {
        role: "ai",
        content: `Desculpe, ocorreu um erro: ${errorMessage}`,
        status: "failed",
        timestamp: new Date()
      }]);
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
    messages,
    error,
  };
}
