"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Door } from "@/app/types";
import DoorDataFullSceneDialog from "./DoorDataFullSceneDialog";

type DoorDataProps = {
  doorData: Door;
  doorColor: "red" | "blue";
  tone?: "light" | "dark";
  isShowDoorColor?: boolean;
};

export default function DoorData({ doorData, doorColor, isShowDoorColor = true }: DoorDataProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const isShelter = doorData.type === "Shelter";
  const accent = isShelter ? "#2ecc71" : "#e74c3c";
  const typeLabel = isShelter ? "避難所 · Shelter" : "修羅場 · Asura";
  const imageSrc = doorData.imageUrl || "/DefaultImage.png";
  const doorChoiceColor = doorColor === "red" ? "#e74c3c" : "#3498db";
  const doorChoiceLabel = doorColor === "red" ? "紅門扉" : "藍門扉";

  return (
    <>
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: `1px solid ${accent}80`,
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        {/* Image */}
        <Box
          component="img"
          src={imageSrc}
          alt={doorData.name}
          onClick={() => setDialogOpen(true)}
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            borderBottom: `2px solid ${accent}55`,
            cursor: "pointer",
            transition: "opacity 0.15s",
            "&:hover": { opacity: 0.85 },
          }}
        />

        {/* Info */}
        <Box sx={{ p: 1.75 }}>
          {/* Top row: type badge + door choice + HP */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25, flexWrap: "wrap", gap: 0.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {/* Type badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  px: 1,
                  py: 0.3,
                  borderRadius: 0.75,
                  backgroundColor: `${accent}18`,
                  border: `1px solid ${accent}44`,
                }}
              >
                <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: accent, boxShadow: `0 0 4px ${accent}` }} />
                <Typography sx={{ color: accent, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  {typeLabel}
                </Typography>
              </Box>

              {/* Door choice badge */}
              {isShowDoorColor && (
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: doorChoiceColor,
                    letterSpacing: "0.08em",
                    px: 0.75,
                    py: 0.3,
                    border: `1px solid ${doorChoiceColor}44`,
                    borderRadius: 0.75,
                    backgroundColor: `${doorChoiceColor}12`,
                  }}
                >
                  {doorChoiceLabel}
                </Typography>
              )}
            </Box>

            {/* HP change */}
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: accent,
                letterSpacing: "0.06em",
              }}
            >
              {doorData.hp_change > 0 ? `+${doorData.hp_change}` : doorData.hp_change} HP
            </Typography>
          </Box>

          {/* Room name */}
          <Typography
            sx={{
              color: "#eef1f7",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.06em",
              lineHeight: 1.3,
              mb: 1.25,
            }}
          >
            {doorData.name}
          </Typography>

          {/* Divider */}
          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.08)", mb: 1.25 }} />

          {/* Detail rows */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {[
              { label: "環境", value: doorData.env_features },
              ...(doorData.resource_desc ? [{ label: "資源", value: doorData.resource_desc }] : []),
              ...(doorData.threat_desc ? [{ label: "威脅", value: doorData.threat_desc }] : []),
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    minWidth: 36,
                    pt: "1px",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "0.8rem",
                    lineHeight: 1.6,
                    letterSpacing: "0.02em",
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <DoorDataFullSceneDialog
        door={doorData}
        open={dialogOpen}
        onCloseAction={() => setDialogOpen(false)}
      />
    </>
  );
}
