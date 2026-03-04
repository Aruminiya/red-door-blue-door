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
  const hpLow = heart <= 3;
  const hpColor = hpLow ? "#e74c3c" : "#e8c96a";

  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "rgba(8, 10, 16, 0.68)",
        border: "1px solid rgba(232, 201, 106, 0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 1,
        px: 2.5,
        py: 2,
        color: "white",
        minWidth: 164,
      }}
    >
      {/* Label */}
      <Typography
        sx={{
          fontSize: "1rem",
          letterSpacing: "0.22em",
          color: "rgba(232, 201, 106, 0.55)",
          textTransform: "uppercase",
          mb: 1.75,
        }}
      >
        Pure White Corridor
      </Typography>

      {/* HP */}
      <Box sx={{ mb: 1.75 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
          <Typography
            sx={{
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            HP
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: hpColor,
              transition: "color 0.3s",
            }}
          >
            {heart}
            <Box component="span" sx={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>
              {" "}/ {maxHeart}
            </Box>
          </Typography>
        </Box>

        {/* HP pips */}
        <Box sx={{ display: "flex", gap: "3px" }}>
          {Array.from({ length: maxHeart }).map((_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: "2px",
                backgroundColor: i < heart
                  ? hpLow ? "#e74c3c" : "#c0392b"
                  : "rgba(255,255,255,0.1)",
                boxShadow: i < heart && hpLow ? "0 0 4px rgba(231,76,60,0.7)" : "none",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Round */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
          <Typography
            sx={{
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            Round
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {currentRound}
            <Box component="span" sx={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>
              {" "}/ {maxRounds}
            </Box>
          </Typography>
        </Box>

        {/* Round progress bar */}
        <Box sx={{ height: 4, bgcolor: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
          <Box
            sx={{
              height: "100%",
              width: `${(currentRound / maxRounds) * 100}%`,
              bgcolor: "#e8c96a",
              borderRadius: "2px",
              transition: "width 0.4s ease",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
