import {
  Paper,
  Typography,
} from "@mui/material";
import { Door } from "@/app/types";

type DoorDataProps = {
  doorData: Door;
  doorColor: "red" | "blue";
};

export default function DoorData({ doorData, doorColor }: DoorDataProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="primary">
        {doorColor === "red" ? "紅門扉" : "藍門扉"}
      </Typography>
      <Typography variant="body1">{doorData.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        類型：{doorData.type === "Shelter" ? "避難所" : "修羅"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        環境：{doorData.env_features}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        HP 變化：{doorData.hp_change}
      </Typography>
      {doorData.resource_desc && (
        <Typography variant="body2" color="text.secondary">
          資源：{doorData.resource_desc}
        </Typography>
      )}
      {doorData.threat_desc && (
        <Typography variant="body2" color="text.secondary">
          威脅：{doorData.threat_desc}
        </Typography>
      )}
    </Paper>
  )
}