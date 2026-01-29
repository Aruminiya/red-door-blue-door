"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOutput("");

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("請輸入一句話或問題。");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
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
  }

  return (
    <Box
      sx={{
        minHeight: "100svh",
        bgcolor: "#eef1f8",
        backgroundImage:
          "radial-gradient(circle at top, #f8f4f0, #eef1f8 45%, #e7eef4)",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="overline"
              color="primary"
              sx={{ letterSpacing: "0.25em", fontWeight: 700 }}
            >
              Red Door Blue Door
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
              Gemini API 測試台
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              這個頁面會呼叫伺服器端的 <strong>/api/gemini</strong>，
              讓你直接測試 Gemini API 並保護金鑰。
            </Typography>
          </Box>

          <Paper elevation={6} sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2} component="form" onSubmit={onSubmit}>
              <TextField
                label="Prompt"
                placeholder="請輸入你要送給 Gemini 的問題或指令..."
                multiline
                minRows={5}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "送出中..." : "送出"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setPrompt("");
                    setOutput("");
                    setError(null);
                  }}
                >
                  清空
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {output ?
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                回應
              </Typography>
              <Box
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "var(--font-geist-mono)",
                  backgroundColor: "#f6f7fb",
                  p: 2,
                  borderRadius: 2,
                  m: 0,
                }}
              >
                {output}
              </Box>
            </Paper>
          : null}
        </Stack>
      </Container>
    </Box>
  );
}
