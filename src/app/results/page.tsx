"use client";

import { useEffect, useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGame } from "@/app/contexts/GameContext";
import DoorData from "@/app/components/DoorData";

const glassCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 0.5,
  p: 2,
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 2,
  textAlign: "center",
} as const;

export default function ResultsPage() {
  const router = useRouter();
  const { heart, playerChoice, round, initGame } = useGame();

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const totalRounds = round.length;
  const cleared = heart > 0 && totalRounds > 0;
  const redCount = playerChoice.filter((c) => c === "red").length;
  const blueCount = playerChoice.filter((c) => c === "blue").length;

  useEffect(() => {
    const els = [heroRef.current, statsRef.current, timelineRef.current, detailsRef.current, btnRef.current].filter(Boolean);
    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out" }
    );
  }, []);

  const heroTitle = cleared ? "你從試煉中存活下來" : "你倒下於純白迴廊之中";
  const heroSubtitle = cleared
    ? `第 ${totalRounds} 回合結束，你是少數走出迴廊的人`
    : `第 ${totalRounds} 回合，迴廊將你吞噬`;
  const heroColor = cleared ? "#e8c96a" : "#c0392b";

  return (
    <Box sx={{ minHeight: "100svh", position: "relative" }}>
      {/* Blurred background image layer */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/PureWhiteCorridor.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(6px)",
          transform: "scale(1.05)", // 補償 blur 邊緣透明
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.82)",
          zIndex: 1,
        }}
      />
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2, py: { xs: 5, md: 8 } }}>
        <Stack spacing={4}>

          {/* ── Hero Banner ── */}
          <Box ref={heroRef} sx={{ textAlign: "center", opacity: 0 }}>
            <Typography
              sx={{
                color: heroColor,
                fontWeight: 700,
                fontSize: { xs: "1.6rem", md: "2rem" },
                letterSpacing: "0.2em",
                lineHeight: 1.5,
                mb: 1.5,
              }}
            >
              {heroTitle}
            </Typography>
            <Box
              sx={{ width: 56, height: "1px", bgcolor: heroColor, mx: "auto", mb: 1.5, opacity: 0.5 }}
            />
            <Typography
              sx={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", fontSize: "0.875rem" }}
            >
              {heroSubtitle}
            </Typography>
          </Box>

          {totalRounds > 0 && (
            <>
              {/* ── Stats Cards ── */}
              <Box
                ref={statsRef}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1.5,
                  opacity: 0,
                }}
              >
                {/* HP */}
                <Box sx={glassCard}>
                  <Typography sx={{ fontSize: "1.6rem", lineHeight: 1 }}>❤️</Typography>
                  <Typography sx={{ color: "white", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
                    {heart}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                    最終血量
                  </Typography>
                </Box>

                {/* Rounds */}
                <Box sx={glassCard}>
                  <Typography sx={{ fontSize: "1.6rem", lineHeight: 1 }}>⚔️</Typography>
                  <Typography sx={{ color: "white", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
                    {totalRounds}
                    <Typography component="span" sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                      /10
                    </Typography>
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                    總回合數
                  </Typography>
                </Box>

                {/* Door ratio */}
                <Box sx={glassCard}>
                  <Typography sx={{ fontSize: "1.6rem", lineHeight: 1 }}>🚪</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Typography sx={{ fontSize: "1rem" }}>🔴</Typography>
                    <Typography sx={{ color: "#e74c3c", fontWeight: 700, fontSize: "1.1rem" }}>{redCount}</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.25)" }}>|</Typography>
                    <Typography sx={{ color: "#3498db", fontWeight: 700, fontSize: "1.1rem" }}>{blueCount}</Typography>
                    <Typography sx={{ fontSize: "1rem" }}>🔵</Typography>
                  </Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", letterSpacing: "0.08em", mt: 0.5 }}>
                    門扉選擇
                  </Typography>
                </Box>
              </Box>

              {/* ── Timeline ── */}
              <Box ref={timelineRef} sx={{ opacity: 0 }}>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", letterSpacing: "0.18em", mb: 1.5, textTransform: "uppercase" }}
                >
                  選門軌跡
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {round.map((r, index) => {
                    const choice = playerChoice[index];
                    if (!choice) return null;
                    const chosenDoor = choice === "red" ? r.redDoor : r.blueDoor;
                    const isShelter = chosenDoor.type === "Shelter";
                    const hpColor = isShelter ? "#2ecc71" : "#e74c3c";
                    const isRed = choice === "red";
                    return (
                      <Box
                        key={index}
                        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, minWidth: 38 }}
                      >
                        <Typography
                          sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}
                        >
                          R{index + 1}
                        </Typography>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isRed ? "rgba(231, 76, 60, 0.2)" : "rgba(52, 152, 219, 0.2)",
                            border: `1.5px solid ${isRed ? "#e74c3c" : "#3498db"}`,
                            fontSize: "0.65rem",
                          }}
                        >
                          {isRed ? "🔴" : "🔵"}
                        </Box>
                        <Typography sx={{ fontSize: "0.68rem", color: hpColor, fontWeight: 600 }}>
                          {chosenDoor.hp_change > 0 ? "+" : ""}
                          {chosenDoor.hp_change}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* ── Round Details (Accordion) ── */}
              <Box ref={detailsRef} sx={{ opacity: 0 }}>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", letterSpacing: "0.18em", mb: 1.5, textTransform: "uppercase" }}
                >
                  回合詳情
                </Typography>
                <Stack spacing={1}>
                  {round.map((r, index) => {
                    const choice = playerChoice[index];
                    if (!choice) return null;
                    const chosenDoor = choice === "red" ? r.redDoor : r.blueDoor;
                    const isRed = choice === "red";
                    return (
                      <Accordion
                        key={`${index}-${r.redDoor.id}-${r.blueDoor.id}`}
                        disableGutters
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: "8px !important",
                          "&:before": { display: "none" },
                          "&.Mui-expanded": {
                            borderColor: isRed ? "rgba(231,76,60,0.45)" : "rgba(52,152,219,0.45)",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem" }}>▾</Typography>
                          }
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
                              第 {index + 1} 回合
                            </Typography>
                            <Typography
                              sx={{ color: isRed ? "#e74c3c" : "#3498db", fontSize: "0.85rem", fontWeight: 600 }}
                            >
                              {isRed ? "🔴 紅門" : "🔵 藍門"}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
                              {chosenDoor.type === "Shelter" ? "避難所" : "修羅場"}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <DoorData doorData={chosenDoor} doorColor={choice} tone="dark" isShowDoorColor={false} />
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Stack>
              </Box>
            </>
          )}

          {/* No data */}
          {totalRounds === 0 && (
            <Typography sx={{ color: "rgba(255,255,255,0.4)", textAlign: "center", letterSpacing: "0.1em" }}>
              沒有找到成績資料。
            </Typography>
          )}

          {/* ── Restart Button ── */}
          <Button
            ref={btnRef}
            variant="outlined"
            fullWidth
            onClick={() => {
              initGame();
              router.push("/");
            }}
            sx={{
              opacity: 0,
              color: "rgba(255,255,255,0.8)",
              borderColor: "rgba(255,255,255,0.25)",
              letterSpacing: "0.2em",
              py: 1.5,
              fontSize: "0.9rem",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "white",
              },
            }}
          >
            再次踏入純白迴廊
          </Button>

        </Stack>
      </Container>
    </Box>
  );
}
