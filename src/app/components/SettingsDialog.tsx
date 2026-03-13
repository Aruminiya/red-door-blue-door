"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  Slider,
} from "@mui/material";
import { useAppSettings } from "@/app/contexts/AppSettingsContext";

type SettingsDialogProps = {
  open: boolean;
  onCloseAction: () => void;
};

const palette = {
  bg: "rgba(11,15,22,0.97)",
  border: "rgba(255,255,255,0.1)",
  text: "#eef1f7",
  muted: "rgba(238,241,247,0.4)",
  divider: "rgba(255,255,255,0.07)",
};

const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#e8c96a" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "rgba(232,201,106,0.35)",
  },
  "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.15)" },
};

export default function SettingsDialog({ open, onCloseAction }: SettingsDialogProps) {
  const { bgMusicVolume, bgMusicEnabled, sfxEnabled, sfxVolume, aiStoryEnabled, setBgMusicVolume, setSfxVolume, toggleBgMusic, toggleSfx, toggleAiStory } =
    useAppSettings();

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: palette.bg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 2,
            border: `1px solid ${palette.border}`,
            borderTop: "3px solid rgba(232,201,106,0.6)",
            color: palette.text,
            overflow: "hidden",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.6)" } },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.25,
          pb: 2,
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.62rem",
            color: palette.muted,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          Preferences
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.15rem",
            letterSpacing: "0.1em",
            color: "#e8c96a",
          }}
        >
          設定
        </Typography>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>

        {/* BGM row */}
        <Box sx={{ px: 2.5, pt: 2.25, pb: 2.25, borderBottom: `1px solid ${palette.divider}` }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box>
              <Typography sx={{ color: palette.text, fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 500 }}>
                背景音樂
              </Typography>
              <Typography sx={{ color: palette.muted, fontSize: "0.72rem", letterSpacing: "0.08em", mt: 0.25 }}>
                Background Music
              </Typography>
            </Box>
            <Switch checked={bgMusicEnabled} onChange={toggleBgMusic} size="small" sx={switchSx} />
          </Box>

          {/* Volume slider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                color: bgMusicEnabled ? palette.muted : "rgba(255,255,255,0.18)",
                fontSize: "0.7rem",
                minWidth: 28,
                transition: "color 0.2s",
              }}
            >
              音量
            </Typography>
            <Slider
              disabled={!bgMusicEnabled}
              value={Math.round(bgMusicVolume * 100)}
              onChange={(_, v) => setBgMusicVolume((v as number) / 100)}
              min={0}
              max={100}
              sx={{
                color: bgMusicEnabled ? "#e8c96a" : "rgba(255,255,255,0.15)",
                transition: "color 0.2s",
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  boxShadow: bgMusicEnabled ? "0 0 6px rgba(232,201,106,0.5)" : "none",
                },
                "& .MuiSlider-rail": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            />
            <Typography
              sx={{
                color: bgMusicEnabled ? "rgba(232,201,106,0.8)" : "rgba(255,255,255,0.18)",
                fontSize: "0.75rem",
                fontWeight: 600,
                minWidth: 36,
                textAlign: "right",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
            >
              {Math.round(bgMusicVolume * 100)}%
            </Typography>
          </Box>
        </Box>

        {/* SFX row */}
        <Box sx={{ px: 2.5, pt: 2.25, pb: 2.25, borderBottom: `1px solid ${palette.divider}` }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box>
              <Typography sx={{ color: palette.text, fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 500 }}>
                音效
              </Typography>
              <Typography sx={{ color: palette.muted, fontSize: "0.72rem", letterSpacing: "0.08em", mt: 0.25 }}>
                Sound Effects
              </Typography>
            </Box>
            <Switch checked={sfxEnabled} onChange={toggleSfx} size="small" sx={switchSx} />
          </Box>

          {/* SFX Volume slider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                color: sfxEnabled ? palette.muted : "rgba(255,255,255,0.18)",
                fontSize: "0.7rem",
                minWidth: 28,
                transition: "color 0.2s",
              }}
            >
              音量
            </Typography>
            <Slider
              disabled={!sfxEnabled}
              value={Math.round(sfxVolume * 100)}
              onChange={(_, v) => setSfxVolume((v as number) / 100)}
              min={0}
              max={100}
              sx={{
                color: sfxEnabled ? "#e8c96a" : "rgba(255,255,255,0.15)",
                transition: "color 0.2s",
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  boxShadow: sfxEnabled ? "0 0 6px rgba(232,201,106,0.5)" : "none",
                },
                "& .MuiSlider-rail": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            />
            <Typography
              sx={{
                color: sfxEnabled ? "rgba(232,201,106,0.8)" : "rgba(255,255,255,0.18)",
                fontSize: "0.75rem",
                fontWeight: 600,
                minWidth: 36,
                textAlign: "right",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
            >
              {Math.round(sfxVolume * 100)}%
            </Typography>
          </Box>
        </Box>

        {/* AI Story row */}
        <Box sx={{ px: 2.5, pt: 2.25, pb: 2.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ color: palette.text, fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 500 }}>
                AI 故事敘述
              </Typography>
              <Typography sx={{ color: palette.muted, fontSize: "0.72rem", letterSpacing: "0.08em", mt: 0.25 }}>
                AI Story Narration
              </Typography>
              <Typography sx={{ color: palette.muted, fontSize: "0.65rem", letterSpacing: "0.04em", mt: 0.5, maxWidth: 200, lineHeight: 1.4 }}>
                {aiStoryEnabled ? "由 Gemini 即時生成故事" : "使用預設故事描述"}
              </Typography>
            </Box>
            <Switch checked={aiStoryEnabled} onChange={toggleAiStory} size="small" sx={switchSx} />
          </Box>
        </Box>

      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        <Button
          fullWidth
          onClick={onCloseAction}
          sx={{
            py: 1.2,
            fontSize: "0.85rem",
            letterSpacing: "0.18em",
            borderRadius: 1.5,
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.12)",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.85)",
            },
          }}
        >
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
}
