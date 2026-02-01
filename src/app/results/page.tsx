"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import type { GameState } from "@/app/types";
import DoorData from "@/app/components/DoorData";

const STORAGE_KEY = "rdbd:result";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<GameState | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setResult(JSON.parse(raw) as GameState);
    } catch {
      setResult(null);
    }
  }, []);

  const totalRounds = result?.round.length ?? 0;
  const cleared = result ? result.heart > 0 && totalRounds > 0 : false;

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
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            結算成績
          </Typography>

          <Paper elevation={4} sx={{ p: 3 }}>
            {result ? (
              <Stack spacing={1.5}>
                <Typography variant="body1">
                  結果：{cleared ? "通關" : "死亡"}
                </Typography>
                <Typography variant="body1">
                  最終血量：{result.heart}
                </Typography>
                <Typography variant="body1">
                  總回合數：{totalRounds}
                </Typography>
                <Typography variant="body1">
                  選門紀錄：{result.playerChoice.map(choice => choice === "red" ? "🔴" : "🔵").join(" / ") || "無"}
                </Typography>
                <Stack spacing={2} sx={{ pt: 1 }}>
                  {result.round.map((round, index) => {
                    const choice = result.playerChoice[index];
                    if (!choice) return null;
                    const chosenDoor = choice === "red" ? round.redDoor : round.blueDoor;
                    return (
                      <Stack key={`${index + 1}-${round.redDoor.id}-${round.blueDoor.id}`} spacing={1}>
                        <Typography variant="subtitle1">
                          第 {index + 1} 回合：{choice === "red" ? "🔴 紅門" : "🔵 藍門"}
                        </Typography>
                        <DoorData doorData={chosenDoor} doorColor={choice} />
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            ) : (
              <Typography variant="body1">沒有找到成績資料。</Typography>
            )}
          </Paper>
          <Button variant="contained" onClick={() => router.push("/")}> 
            回首頁
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
