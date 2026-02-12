import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { Door } from "@/app/types";

type DoorDataProps = {
  doorData: Door;
  doorColor: "red" | "blue";
  tone?: "light" | "dark";
  isShowDoorColor?: boolean;
};

export default function DoorData({ doorData, doorColor, tone = "light", isShowDoorColor = true }: DoorDataProps) {
  const isDark = tone === "dark";
  const secondaryText = isDark ? "rgba(255, 255, 255, 0.7)" : "text.secondary";
  const imageSrc = doorData.imageUrl || "/DefaultImage.png";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        backgroundColor: isDark ? "#151c26" : "#ffffff",
        borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.12)",
        color: isDark ? "#f5f7fb" : "inherit",
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={doorData.name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 1,
          mb: 1.5,
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.12)"}`,
        }}
      />
      {isShowDoorColor && (
        <Typography variant="subtitle2" color={ doorColor === "red" ? "red" : "blue" } sx={{ fontWeight: 700 }}>
          {doorColor === "red" ? "紅門扉" : "藍門扉"}
        </Typography>
      )}
      <Typography variant="body1">{doorData.name}</Typography>
      <Typography variant="body2" sx={{ color: secondaryText }}>
        類型：{doorData.type === "Shelter" ? "避難所" : "修羅"}
      </Typography>
      <Typography variant="body2" sx={{ color: secondaryText }}>
        環境：{doorData.env_features}
      </Typography>
      <Typography variant="body2" sx={{ color: secondaryText }}>
        HP 變化：{doorData.hp_change}
      </Typography>
      {doorData.resource_desc && (
        <Typography variant="body2" sx={{ color: secondaryText }}>
          資源：{doorData.resource_desc}
        </Typography>
      )}
      {doorData.threat_desc && (
        <Typography variant="body2" sx={{ color: secondaryText }}>
          威脅：{doorData.threat_desc}
        </Typography>
      )}
    </Paper>
  )
}
