import { useState, useCallback } from "react";

type UseGeminiReturn = {
  loading: boolean;
  error: string | null;
  output: string;
  submit: (prompt: string) => Promise<void>;
  clearOutput: () => void;
  clearError: () => void;
};

export function useGemini(): UseGeminiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");

  const submit = useCallback(async (prompt: string) => {

    // TODO 開發為了省錢 暫時註解掉 useGemini API 呼叫
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setOutput(`開發為了省錢 暫時註解掉 API 呼叫 這是模擬的回應，收到的提示詞是：\n${prompt}`);
      setLoading(false);
    }, 300);
    return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "API 發生錯誤。");
        return;
      }

      setOutput(data?.text ?? JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法連線到 API。");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput("");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    output,
    submit,
    clearOutput,
    clearError,
  };
}
