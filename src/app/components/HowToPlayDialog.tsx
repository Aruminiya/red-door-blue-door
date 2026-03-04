"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

type HowToPlayDialogProps = {
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
  maxWidth: 480,
  width: "100%",
};

const sectionTitleSx = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  mb: 1,
};

const itemSx = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.9rem",
  lineHeight: 1.8,
  letterSpacing: "0.04em",
};

export default function HowToPlayDialog({ open, onClose }: HowToPlayDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: dialogPaperSx }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.7)" } } }}
    >
      <DialogTitle sx={{ color: "white", letterSpacing: "0.15em", fontSize: "1.1rem", pb: 1 }}>
        遊戲說明
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>

        {/* Basic rules */}
        <Box>
          <Typography sx={sectionTitleSx}>基本規則</Typography>
          <Typography sx={itemSx}>• 每局共 10 回合，初始血量 ❤️ 10</Typography>
          <Typography sx={itemSx}>• 每回合在紅門與藍門中選擇一扇</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Room types */}
        <Box>
          <Typography sx={sectionTitleSx}>房間類型</Typography>
          <Typography sx={itemSx}>🟢 避難所 Shelter — 恢復 HP</Typography>
          <Typography sx={itemSx}>🔴 修羅場 Asura &nbsp; — 消耗 HP</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Win/lose conditions */}
        <Box>
          <Typography sx={sectionTitleSx}>勝敗條件</Typography>
          <Typography sx={itemSx}>通關：完成 10 回合且血量 &gt; 0</Typography>
          <Typography sx={itemSx}>失敗：血量歸零</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Scene collection */}
        <Box>
          <Typography sx={sectionTitleSx}>場景搜集</Typography>
          <Typography sx={itemSx}>每次進入的房間都會解鎖收藏紀錄</Typography>
          <Typography sx={itemSx}>前往「場景搜集」可查看 100 個場景的解鎖進度</Typography>
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
