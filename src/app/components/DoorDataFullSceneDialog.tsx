"use client";

import { useEffect } from "react";
import { Dialog, Box, Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import type { Door } from "@/app/types";

type DoorDataFullSceneDialogProps = {
  door: Door | null;
  open: boolean;
  onCloseAction: () => void;
};

export default function DoorDataFullSceneDialog({
  door,
  open,
  onCloseAction,
}: DoorDataFullSceneDialogProps) {
  useEffect(() => {
    if (open) {
      new Audio("/Paper.mp3").play().catch(() => {});
    }
  }, [open]);

  if (!door) return null;

  const isShelter = door.type === "Shelter";
  const accentColor = isShelter ? "#2ecc71" : "#e74c3c";
  const typeLabel = isShelter ? "避難所 · Shelter" : "修羅場 · Asura";
  const imageSrc = door.imageUrl ?? "/DefaultImage.png";

  const handleDownload = async () => {
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${door.name}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageSrc, "_blank");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      fullScreen
      slotProps={{
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <Box onClick={onCloseAction} sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", cursor: "pointer" }}>

        {/* Background image */}
        <Box
          component="img"
          src={imageSrc}
          alt={door.name}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Gradient overlay — heavy at bottom, light at top */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.72) 65%, rgba(0,0,0,0.94) 100%)",
          }}
        />

        {/* Top buttons */}
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 10, display: "flex", gap: 1 }}
        >
          <IconButton
            onClick={handleDownload}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.65)",
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              "&:hover": { color: "white", backgroundColor: "rgba(0,0,0,0.65)" },
            }}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={onCloseAction}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.65)",
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              "&:hover": { color: "white", backgroundColor: "rgba(0,0,0,0.65)" },
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>

        {/* Info panel — bottom */}
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: { xs: 0, md: "auto" },
            px: { xs: 3, md: 8 },
            pb: { xs: 5, md: 7 },
            pt: 3,
            maxWidth: { xs: "100%", md: 560 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          {/* Type badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              mb: 1.5,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: `${accentColor}1a`,
              border: `1px solid ${accentColor}55`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: accentColor,
                boxShadow: `0 0 5px ${accentColor}`,
              }}
            />
            <Typography
              sx={{
                color: accentColor,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {typeLabel}
            </Typography>
          </Box>

          {/* Room name */}
          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "0.1em",
              lineHeight: 1.25,
              mb: 0.75,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {door.name}
          </Typography>

          {/* HP change */}
          <Typography
            sx={{
              color: door.hp_change > 0 ? "#2ecc71" : "#e74c3c",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              mb: 2.5,
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            {door.hp_change > 0 ? `+${door.hp_change}` : door.hp_change} HP
          </Typography>

          {/* Divider */}
          <Box sx={{ width: 36, height: "1px", bgcolor: "rgba(255,255,255,0.25)", mb: 2.5 }} />

          {/* Detail rows */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, width: "100%" }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", justifyContent: { xs: "center", md: "flex-start" } }}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  minWidth: 44,
                  pt: "1px",
                }}
              >
                環境
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  fontSize: "0.88rem",
                  letterSpacing: "0.04em",
                  lineHeight: 1.6,
                }}
              >
                {door.env_features}
              </Typography>
            </Box>

            {door.resource_desc && (
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", justifyContent: { xs: "center", md: "flex-start" } }}>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    minWidth: 44,
                    pt: "1px",
                  }}
                >
                  資源
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.88)",
                    fontSize: "0.88rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1.6,
                  }}
                >
                  {door.resource_desc}
                </Typography>
              </Box>
            )}

            {door.threat_desc && (
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", justifyContent: { xs: "center", md: "flex-start" } }}>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    minWidth: 44,
                    pt: "1px",
                  }}
                >
                  威脅
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.88)",
                    fontSize: "0.88rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1.6,
                  }}
                >
                  {door.threat_desc}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
