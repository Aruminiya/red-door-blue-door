"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  Slider,
  Stack,
  Divider,
} from "@mui/material";
import { useBgMusic } from "@/app/contexts/BgMusicContext";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

const dialogPaperSx = {
  backgroundColor: "rgba(10, 10, 20, 0.88)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 3,
  color: "white",
  maxWidth: 400,
  width: "100%",
};

const rowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const labelSx = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.9rem",
  letterSpacing: "0.06em",
};

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { bgMusicVolume, bgMusicEnabled, sfxEnabled, setBgMusicVolume, toggleBgMusic, toggleSfx } =
    useBgMusic();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: dialogPaperSx }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.7)" } } }}
    >
      <DialogTitle sx={{ color: "white", letterSpacing: "0.15em", fontSize: "1.1rem", pb: 1 }}>
        設定
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>

        {/* Background music */}
        <Box>
          <Box sx={rowSx}>
            <Typography sx={labelSx}>背景音樂</Typography>
            <Switch
              checked={bgMusicEnabled}
              onChange={toggleBgMusic}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "rgba(255,255,255,0.9)" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(255,255,255,0.4)",
                },
                "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            />
          </Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.5 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", minWidth: 24 }}>
              0%
            </Typography>
            <Slider
              disabled={!bgMusicEnabled}
              value={Math.round(bgMusicVolume * 100)}
              onChange={(_, v) => setBgMusicVolume((v as number) / 100)}
              min={0}
              max={100}
              sx={{
                color: bgMusicEnabled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                "& .MuiSlider-thumb": { width: 14, height: 14 },
              }}
            />
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", minWidth: 32, textAlign: "right" }}>
              {Math.round(bgMusicVolume * 100)}%
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* SFX */}
        <Box sx={rowSx}>
          <Typography sx={labelSx}>音效</Typography>
          <Switch
            checked={sfxEnabled}
            onChange={toggleSfx}
            size="small"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "rgba(255,255,255,0.9)" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "rgba(255,255,255,0.4)",
              },
              "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
          />
        </Box>

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.12em",
            "&:hover": { color: "white" },
          }}
        >
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
}
