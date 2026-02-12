"use client";

import { Box, Typography } from "@mui/material";

type GameInfoPanelProps = {
  heart: number;
  maxHeart?: number;
  currentRound: number;
  maxRounds?: number;
};

export default function GameInfoPanel({
  heart,
  maxHeart = 10,
  currentRound,
  maxRounds = 10,
}: GameInfoPanelProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRadius: 1,
        px: 3,
        py: 2,
        color: "black",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, letterSpacing: "0.1em", mb: 1 }}
      >
        Red Door Blue Door
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        血量：{heart} / {maxHeart} ❤️
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        回合：{currentRound} / {maxRounds}
      </Typography>
    </Box>
  );
}
