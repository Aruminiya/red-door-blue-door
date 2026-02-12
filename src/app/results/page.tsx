"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";
import DoorData from "@/app/components/DoorData";

export default function ResultsPage() {
  const router = useRouter();
  const { heart, playerChoice, round, initGame } = useGame();

  const totalRounds = round.length;
  const cleared = heart > 0 && totalRounds > 0;

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
            {totalRounds > 0 ? (
              <Stack spacing={1.5}>
                <Typography variant="body1">
                  結果：{cleared ? "通關" : "死亡"}
                </Typography>
                <Typography variant="body1">
                  最終血量：{heart}
                </Typography>
                <Typography variant="body1">
                  總回合數：{totalRounds}
                </Typography>
                <Typography variant="body1">
                  選門紀錄：{playerChoice.map(choice => choice === "red" ? "🔴" : "🔵").join(" / ") || "無"}
                </Typography>
                <Stack spacing={2} sx={{ pt: 1 }}>
                  {round.map((r, index) => {
                    const choice = playerChoice[index];
                    if (!choice) return null;
                    const chosenDoor = choice === "red" ? r.redDoor : r.blueDoor;
                    return (
                      <Stack key={`${index + 1}-${r.redDoor.id}-${r.blueDoor.id}`} spacing={1}>
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
          <Button
            variant="contained"
            onClick={() => {
              initGame();
              router.push("/");
            }}
          >
            再來一局
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
