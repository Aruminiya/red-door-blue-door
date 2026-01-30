"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  LinearProgress,
  Typography,
} from "@mui/material";
import room from "@/room.json";
import { draw0or1, drawRoom } from "./util/draw";

type Door = { 
  id: number, 
  type: "Shelter" | "Asura", 
  theme: string,
  name: string, 
  door_visual: string, 
  env_features: string, 
  hp_change: number, 
  resource_desc: string | null,
  threat_desc: string | null
};

type Round = {
  redDoor: Door;
  blueDoor: Door;
};

type GameState = {
  heart: number;
  playerChoice: ("red" | "blue")[];
  round: Round[];
};

type GameAction =
  | { type: "ASSIGN_ROUND"; payload: Round }
  | { type: "PLAYER_CHOICE"; payload: { choice: "red" | "blue"; hpDelta: number } };

const initialGameState: GameState = {
  heart: 10,
  playerChoice: [],
  round: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ASSIGN_ROUND":
      return {
        ...state,
        round: [...state.round, action.payload],
      };
    case "PLAYER_CHOICE":
      return {
        ...state,
        playerChoice: [...state.playerChoice, action.payload.choice],
        heart: Math.min(10, Math.max(0, state.heart + action.payload.hpDelta)),
      };
    default:
      return state;
  }
}

const MAX_ROUNDS = 10;

export default function Home() {
  const roomData = room as Door[];
  const { shelters, asuras } = useMemo(() => roomData.reduce(
    (acc, item) => {
      if (item.type === "Shelter") acc.shelters.push(item);
      else if (item.type === "Asura") acc.asuras.push(item);
      return acc;
    },
    { shelters: [] as Door[], asuras: [] as Door[] }
  ), [roomData]);

  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  console.log("Game State:", gameState);
  const { heart, playerChoice, round } = gameState;

  const { currentRound, currentChoice, chosenDoor, unchosenDoor } = useMemo(() => {
    return { 
      currentRound: round[round.length - 1],
      currentChoice: playerChoice[playerChoice.length - 1],
      chosenDoor: playerChoice[playerChoice.length - 1] === "red" ? round[round.length - 1]?.redDoor : round[round.length - 1]?.blueDoor,
      unchosenDoor: playerChoice[playerChoice.length - 1] === "red" ? round[round.length - 1]?.blueDoor : round[round.length - 1]?.redDoor,
    };
  }, [round, playerChoice]);
  
  const handleAssignDoor = () => {
    if ( round.length >= MAX_ROUNDS ) {
      console.warn("已達最大回合數，無法再分配門扉");
      return;
    }
    if ( round.length > playerChoice.length ) {
      console.warn("本回合門扉已分配，等待玩家選擇後再分配下一回合門扉");
      return;
    };

    const num = draw0or1();
    if (num === 0) {
      const redDoor = drawRoom(shelters);
      const blueDoor = drawRoom(asuras);
      if (!redDoor || !blueDoor) return;
      dispatch({
        type: "ASSIGN_ROUND",
        payload: {
          redDoor,
          blueDoor,
        },
      });
    } else {
      const redDoor = drawRoom(asuras);
      const blueDoor = drawRoom(shelters);
      if (!redDoor || !blueDoor) return;
      dispatch({
        type: "ASSIGN_ROUND",
        payload: {
          redDoor,
          blueDoor,
        },
      });
    }
  };

  const handlePlayerChoice = (choice: "red" | "blue") => {
    if ( round.length === 0 ) {
      console.warn("尚未分配門扉，無法選擇");
      return;
    }
    if ( round.length <= playerChoice.length ) {
      console.warn("本回合門扉已選擇，無法重複選擇");
      return;
    }

    if (!currentRound) return;
    const hpDelta =
      choice === "red"
        ? currentRound.redDoor.hp_change || 0
        : currentRound.blueDoor.hp_change || 0;
    dispatch({ type: "PLAYER_CHOICE", payload: { choice, hpDelta } });
    
  }

  // 監控玩家選擇門的情況
  useEffect(() => {
    if (playerChoice.length === round.length && currentChoice) {
      console.log(`玩家選擇了 ${currentChoice} 門`);
      const roundNum = playerChoice.length;
      const doorKey = currentChoice === "red" ? "redDoor" : "blueDoor";
      const currentRoundChose = round[roundNum - 1][doorKey];

      const prompt = `
        我進入了第 ${roundNum} 間房間 幫我說故事
        【房間屬性】：${currentRoundChose.type === "Shelter" ? "庇護所" : "修羅場"}
        【場景名稱】：${currentRoundChose.name}
        【環境特徵】：${currentRoundChose.env_features}
        【資源物資】：${currentRoundChose.resource_desc ?? "無"}
        【潛在威脅】：${currentRoundChose.threat_desc ?? "無"}
        【血量變化】：${currentRoundChose.hp_change}
        【玩家變化後的血量】：${heart}
        - 請用中文以第二人稱幫我說一個 500 字以內的故事
        - 除非玩家死亡 否則 故事的結尾都要接回 純白迴廊 眼前有兩道門 並且不要反問我問題
        - 【玩家變化後的血量】如果為 0 代表玩家已在房間的遭遇中死亡
        - 如果玩家進入到 第 ${MAX_ROUNDS} 房間 並且 沒有死亡 代表玩家成功通關
        `
      console.log(prompt);
      submitGemini(prompt);
    }
  }, [playerChoice, round, currentChoice, heart]);

  // Gemini API interaction states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");

  async function submitGemini(prompt: string) {
    try {
      setLoading(true);
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "API 發生錯誤。");
        return;
      }

      setOutput(data?.text ?? JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法連線到 API。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100svh",
        bgcolor: "#eef1f8",
        backgroundImage:
          "radial-gradient(circle at top, #f8f4f0, #eef1f8 45%, #e7eef4)",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h5"
              color="primary"
              sx={{ letterSpacing: "0.25em", fontWeight: 700 }}
            >
              Red Door Blue Door
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{ letterSpacing: "0.25em", fontWeight: 700 }}
            >
              當前血量：{heart} ❤
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{ letterSpacing: "0.25em", fontWeight: 700 }}
            >
              回合數：{round.length}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              歡迎來到這場純白迴廊的試煉。我是你的引路人，將見證你在機率與命運之間的抉擇。
              現在，你站在無止境的白色空間中央，四周寂靜得只能聽見自己的心跳。前方，兩扇門扉靜靜地佇立，等待著你的推開。
            </Typography>
            <Button
              type="button"
              variant="contained"
              onClick={handleAssignDoor}
            >
              開始遊戲
            </Button>
            {playerChoice.length !== 0 && (
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  你已選擇了 {currentChoice === "red" ? "紅色" : "藍色"} 門扉。
                </Typography>
                {chosenDoor && (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary">
                      你選擇的門 {currentChoice === "red" ? "紅色" : "藍色"}
                    </Typography>
                    <Typography variant="body1">{chosenDoor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      主題：{chosenDoor.theme}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      環境：{chosenDoor.env_features}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      HP 變化：{chosenDoor.hp_change}
                    </Typography>
                    {chosenDoor.resource_desc && (
                      <Typography variant="body2" color="text.secondary">
                        資源：{chosenDoor.resource_desc}
                      </Typography>
                    )}
                    {chosenDoor.threat_desc && (
                      <Typography variant="body2" color="text.secondary">
                        威脅：{chosenDoor.threat_desc}
                      </Typography>
                    )}
                  </Paper>
                )}
                {unchosenDoor && (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary">
                      未選擇的門 {currentChoice === "red" ? "藍色" : "紅色"}
                    </Typography>
                    <Typography variant="body1">{unchosenDoor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      主題：{unchosenDoor.theme}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      環境：{unchosenDoor.env_features}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      HP 變化：{unchosenDoor.hp_change}
                    </Typography>
                    {unchosenDoor.resource_desc && (
                      <Typography variant="body2" color="text.secondary">
                        資源：{unchosenDoor.resource_desc}
                      </Typography>
                    )}
                    {unchosenDoor.threat_desc && (
                      <Typography variant="body2" color="text.secondary">
                        威脅：{unchosenDoor.threat_desc}
                      </Typography>
                    )}
                  </Paper>
                )}
              </Stack>
            )}
            {round.length > 0 && (
              <>
              <Button
                type="button"
                variant="contained"
                onClick={() => handlePlayerChoice("red")}
              >
                紅色門
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => handlePlayerChoice("blue")}
              >
                藍色門
              </Button>
              </>
            )}
          </Box>

          {loading && <LinearProgress />}

          {error ? <Alert severity="error">{error}</Alert> : null}

          {output ?
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                回應
              </Typography>
              <Box
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "var(--font-geist-mono)",
                  backgroundColor: "#f6f7fb",
                  p: 2,
                  borderRadius: 2,
                  m: 0,
                }}
              >
                {output}
              </Box>
            </Paper>
          : null}
        </Stack>
      </Container>
    </Box>
  );
}
