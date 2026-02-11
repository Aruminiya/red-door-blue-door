"use client";

import { useEffect, useMemo, useReducer, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import room from "@/room.json";
import { draw0or1, drawRoom } from "./util/draw";
import DoorData from "./components/DoorData";
import { Round, Door, GameState, GameAction } from "@/app/types";
import { useImageMapDoors, DEFAULT_DOOR_COORDS } from "./hooks/useImageMapDoors";

gsap.registerPlugin(TextPlugin);

const INTRO_TEXT = "歡迎來到這場純白迴廊的試煉。我是你的引路人，將見證你在機率與命運之間的抉擇。現在，你站在無止境的白色空間中央，四周寂靜得只能聽見自己的心跳。前方，兩扇門扉靜靜地佇立，等待著你的推開。";

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
        round: [...state.round, action.payload] as Round[],
      };
    case "PLAYER_CHOICE":
      return {
        ...state,
        playerChoice: [...state.playerChoice, action.payload.choice] as ("red" | "blue")[],
        heart: Math.min(10, Math.max(0, state.heart + action.payload.hpDelta)),
      };
    default:
      return state;
  }
}

const MAX_ROUNDS = 10;

export default function Home() {
  const router = useRouter();
  const roomData = room as Door[];
  const { shelters, asuras } = useMemo(() => roomData.reduce(
    (acc, item) => {
      if (item.type === "Shelter") acc.shelters.push(item);
      else if (item.type === "Asura") acc.asuras.push(item);
      return acc;
    },
    { shelters: [] as Door[], asuras: [] as Door[] }
  ), [roomData]);

  // Intro animation states
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const introTextRef = useRef<HTMLSpanElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);

  // Image Map 門位置 hook
  const { imageRef, mapCoords, debugBoxes, updateCoords } = useImageMapDoors({
    doorCoords: DEFAULT_DOOR_COORDS,
    enabled: !showIntro,
  });

  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const { heart, playerChoice, round } = gameState;
  const [isDoorResultShow, setIsDoorResultShow] = useState(false);

  // Gemini API interaction states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const { currentRound, currentChoice, currentRedDoor, currentBlueDoor } = useMemo(() => {
    return { 
      currentRound: round[round.length - 1],
      currentChoice: playerChoice[playerChoice.length - 1],
      currentRedDoor: round[round.length - 1]?.redDoor,
      currentBlueDoor: round[round.length - 1]?.blueDoor
    };
  }, [round, playerChoice]);
  const isGameOver = heart <= 0 || (round.length === MAX_ROUNDS && playerChoice.length === round.length);

  const handleFinishGame = () => {
    sessionStorage.setItem("rdbd:result", JSON.stringify(gameState));
    router.push("/results");
  };

  const handleAssignDoor = () => {
    if (isGameOver) {
      handleFinishGame();
      return;
    }
    if ( round.length >= MAX_ROUNDS ) {
      console.warn("已達最大回合數，無法再分配門扉");
      return;
    }
    if ( round.length > playerChoice.length ) {
      console.warn("本回合門扉已分配，等待玩家選擇後再分配下一回合門扉");
      return;
    };
    setIsDoorResultShow(false);
    setOutput("");
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
    setIsDoorResultShow(true);
  }
  
  const submitGemini = useCallback(async (prompt: string) => {
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
      // 檢查有無回傳 之後要刪除
      setTimeout(() => {
        console.log("output", output);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法連線到 API。");
    } finally {
      setLoading(false);
    }
  }, []);

  // Intro animation effect
  useEffect(() => {
    if (!showIntro || !introTextRef.current || !introContainerRef.current) return;

    const tl = gsap.timeline();

    // Fade in container
    tl.fromTo(
      introContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out" }
    );

    // Typewriter effect
    tl.to(introTextRef.current, {
      duration: 6,
      text: {
        value: INTRO_TEXT,
        delimiter: "",
      },
      ease: "none",
      onComplete: () => {
        setIntroComplete(true);
      },
    });

    return () => {
      tl.kill();
    };
  }, [showIntro]);

  const handleStartGame = () => {
    gsap.to(introContainerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => {
        setShowIntro(false);
      },
    });
  };

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
        - 除非玩家死亡 或 成功通關 否則 故事的結尾都要接回 純白迴廊 眼前有兩道紅藍門 並且不要反問我問題
        - 不能額外描述門的詳細外觀
        - 【玩家變化後的血量】如果為 0 代表玩家已在房間的遭遇中死亡
        - 如果玩家進入到 第 ${MAX_ROUNDS} 房間 並且 沒有死亡 代表玩家成功通關
        `
      submitGemini(prompt);
    }
  }, [playerChoice, round, currentChoice, heart, submitGemini]);

  // Intro screen
  if (showIntro) {
    return (
      <Box
        sx={{
          minHeight: "100svh",
          backgroundImage: "url('/PureWhiteCorridor.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          ref={introContainerRef}
          sx={{
            maxWidth: "800px",
            mx: "auto",
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 2,
            textAlign: "center",
            opacity: 0,
          }}
        >
          <Typography
            component="p"
            sx={{
              color: "white",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 2,
              letterSpacing: "0.1em",
              minHeight: { xs: "200px", md: "180px" },
            }}
          >
            <Box component="span" ref={introTextRef} />
          </Typography>
          {introComplete && (
            <Button
              variant="outlined"
              onClick={handleStartGame}
              sx={{
                mt: 4,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              進入試煉
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  const showDoorSelection = round.length > 0 && playerChoice.length !== round.length;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
      }}
    >
      {/* Background Image with Image Map */}
      <Box
        component="img"
        ref={imageRef}
        src="/PureWhiteCorridor.png"
        alt="Pure White Corridor"
        useMap={showDoorSelection ? "#doorMap" : undefined}
        onLoad={updateCoords}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Image Map for door selection */}
      {showDoorSelection && (
        <map name="doorMap">
          <area
            shape="rect"
            coords={mapCoords.red}
            alt="紅色門"
            title="紅色門"
          />
          <area
            shape="rect"
            coords={mapCoords.blue}
            alt="藍色門"
            title="藍色門"
          />
        </map>
      )}

      {/* DEV: 開發用視覺框框 - 上線前刪除 */}
      {showDoorSelection && (
        <>
          {/* Red Door Debug Box */}
          <Box
            onClick={() => handlePlayerChoice("red")}
            sx={{
              position: "absolute",
              left: debugBoxes.red.left,
              top: debugBoxes.red.top,
              width: debugBoxes.red.width,
              height: debugBoxes.red.height,
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0px 0px 20px 8px rgba(255, 85, 85, 0.7)",
              },
            }}
          >
          </Box>
          {/* Blue Door Debug Box */}
          <Box
            onClick={() => handlePlayerChoice("blue")}
            sx={{
              position: "absolute",
              left: debugBoxes.blue.left,
              top: debugBoxes.blue.top,
              width: debugBoxes.blue.width,
              height: debugBoxes.blue.height,
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0px 0px 20px 8px rgba(85, 131, 255, 0.7)",
              },
            }}
          />
        </>
      )}

      {/* UI Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 3, md: 5 },
          pointerEvents: "none",
        }}
      >
        <Container maxWidth="md" sx={{ pointerEvents: "auto" }}>
          <Stack spacing={3}>
            {/* Game Info Panel */}
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 2,
                p: { xs: 2, md: 3 },
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{ letterSpacing: "0.25em", fontWeight: 700 }}
              >
                Red Door Blue Door
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                <Typography variant="body1" color="primary" sx={{ fontWeight: 700 }}>
                  當前血量：{heart} ❤
                </Typography>
                <Typography variant="body1" color="primary" sx={{ fontWeight: 700 }}>
                  回合數：{round.length}
                </Typography>
              </Stack>
            </Box>

            {/* Door Selection Hint */}
            {showDoorSelection && (
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                  請點擊畫面中的門扉進行選擇
                </Typography>
              </Box>
            )}

            {/* Door Result */}
            {playerChoice.length !== 0 && isDoorResultShow && (
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 2,
                  p: { xs: 2, md: 3 },
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  你已選擇了 {currentChoice === "red" ? "紅色" : "藍色"} 門扉。
                </Typography>
                <Stack spacing={1.5}>
                  <DoorData doorData={currentRedDoor!} doorColor="red" />
                  <DoorData doorData={currentBlueDoor!} doorColor="blue" />
                </Stack>
              </Box>
            )}

            {loading && <LinearProgress />}

            {error ? <Alert severity="error">{error}</Alert> : null}

            {/* Story Output */}
            {output && (
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, md: 3 },
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(8px)",
                }}
              >
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
            )}

            {/* Action Button */}
            {(round.length === 0 || playerChoice.length === round.length) && (
              <Button
                type="button"
                variant="contained"
                onClick={isGameOver ? handleFinishGame : handleAssignDoor}
                sx={{
                  alignSelf: "center",
                  px: 4,
                  py: 1.5,
                }}
              >
                {isGameOver
                  ? "結算成績"
                  : round.length === 0
                    ? "開始遊戲"
                    : "下一回合"}
              </Button>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
