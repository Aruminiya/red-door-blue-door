"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import SettingsDialog from "./SettingsDialog";

export default function GlobalSettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="button"
        onClick={() => setOpen(true)}
        aria-label="設定"
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 200,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "rgba(255,255,255,0.6)",
          fontSize: "1.1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s, color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.65)",
            color: "white",
          },
        }}
      >
        ⚙
      </Box>
      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
