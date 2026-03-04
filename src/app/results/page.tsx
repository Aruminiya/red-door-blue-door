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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Box sx={{ width: 3, height: 14, bgcolor: "rgba(255,255,255,0.18)", borderRadius: "2px" }} />
      <Typography
        sx={{
          color: "rgba(255,255,255,0.28)",
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { heart, playerChoice, round, initGame } = useGame();

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const sceneBtnRef = useRef<HTMLButtonElement>(null);

  const totalRounds = round.length;
  const cleared = heart > 0 && totalRounds > 0;
  const redCount = playerChoice.filter((c) => c === "red").length;
  const blueCount = playerChoice.filter((c) => c === "blue").length;

  useEffect(() => {
    const els = [
      heroRef.current,
      statsRef.current,
      timelineRef.current,
      detailsRef.current,
      btnRef.current,
      sceneBtnRef.current,
    ].filter(Boolean);
    gsap.fromTo(
      els,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.16, ease: "power2.out" }
    );
  }, []);

  const heroTitle = cleared ? "你從試煉中存活下來" : "你倒下於純白迴廊之中";
  const heroSubtitle = cleared
    ? `第 ${totalRounds} 回合結束，你是少數走出迴廊的人`
    : `第 ${totalRounds} 回合，迴廊將你吞噬`;
  const heroColor = cleared ? "#e8c96a" : "#c0392b";

  const hpStatColor = heart > 5 ? "#2ecc71" : heart > 2 ? "#e8c96a" : "#e74c3c";

  return (
    <Box sx={{ minHeight: "100svh", position: "relative" }}>
      {/* Blurred background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/PureWhiteCorridor.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.84)",
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2, py: { xs: 6, md: 9 } }}>
        <Stack spacing={5}>

          {/* ── Hero ── */}
          <Box ref={heroRef} sx={{ textAlign: "center", opacity: 0 }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                mb: 2.5,
              }}
            >
              Pure White Corridor — Result
            </Typography>

            <Typography
              sx={{
                color: heroColor,
                fontWeight: 700,
                fontSize: { xs: "1.55rem", md: "1.95rem" },
                letterSpacing: "0.18em",
                lineHeight: 1.45,
                mb: 2.5,
                textShadow: `0 0 48px ${heroColor}55`,
              }}
            >
              {heroTitle}
            </Typography>

            {/* Decorative divider */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 2.5 }}>
              <Box sx={{ width: 48, height: "1px", bgcolor: heroColor, opacity: 0.3 }} />
              <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: heroColor, opacity: 0.55 }} />
              <Box sx={{ width: 48, height: "1px", bgcolor: heroColor, opacity: 0.3 }} />
            </Box>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.1em",
                fontSize: "0.92rem",
                lineHeight: 1.8,
              }}
            >
              {heroSubtitle}
            </Typography>
          </Box>

          {totalRounds > 0 && (
            <>
              {/* ── Stats ── */}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                    pt: 2.5,
                    pb: 2,
                    px: 1,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: `2px solid ${hpStatColor}`,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ color: hpStatColor, fontSize: "2rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
                    {heart}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.22)", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    最終血量
                  </Typography>
                </Box>

                {/* Rounds */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                    pt: 2.5,
                    pb: 2,
                    px: 1,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: "2px solid rgba(255,255,255,0.25)",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.25 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "2rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
                      {totalRounds}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
                      /10
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.22)", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    總回合數
                  </Typography>
                </Box>

                {/* Door ratio */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                    pt: 2.5,
                    pb: 2,
                    px: 1,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: "2px solid rgba(255,255,255,0.25)",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.25 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#e74c3c", flexShrink: 0 }} />
                      <Typography sx={{ color: "#e74c3c", fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>{redCount}</Typography>
                    </Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.15)", fontSize: "0.9rem" }}>·</Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.25 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#3498db", flexShrink: 0 }} />
                      <Typography sx={{ color: "#3498db", fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>{blueCount}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.22)", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    門扉選擇
                  </Typography>
                </Box>
              </Box>

              {/* ── Timeline ── */}
              <Box ref={timelineRef} sx={{ opacity: 0 }}>
                <SectionLabel>選門軌跡</SectionLabel>
                <Box sx={{ display: "flex", alignItems: "flex-start", overflowX: "auto", pb: 1, gap: 0 }}>
                  {round.map((r, index) => {
                    const choice = playerChoice[index];
                    if (!choice) return null;
                    const chosenDoor = choice === "red" ? r.redDoor : r.blueDoor;
                    const isShelter = chosenDoor.type === "Shelter";
                    const hpColor = isShelter ? "#2ecc71" : "#e74c3c";
                    const isRed = choice === "red";
                    const dotColor = isRed ? "#e74c3c" : "#3498db";
                    const isLast = index === round.length - 1;
                    return (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.6, minWidth: 36 }}>
                          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>
                            R{index + 1}
                          </Typography>
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: `${dotColor}15`,
                              border: `1.5px solid ${dotColor}`,
                              boxShadow: `0 0 8px ${dotColor}33`,
                            }}
                          >
                            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: dotColor }} />
                          </Box>
                          <Typography sx={{ fontSize: "0.75rem", color: hpColor, fontWeight: 700 }}>
                            {chosenDoor.hp_change > 0 ? "+" : ""}{chosenDoor.hp_change}
                          </Typography>
                        </Box>
                        {!isLast && (
                          <Box sx={{ width: 10, height: "1px", bgcolor: "rgba(255,255,255,0.08)", flexShrink: 0, mb: 2 }} />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* ── Round Details ── */}
              <Box ref={detailsRef} sx={{ opacity: 0 }}>
                <SectionLabel>回合詳情</SectionLabel>
                <Stack spacing={1}>
                  {round.map((r, index) => {
                    const choice = playerChoice[index];
                    if (!choice) return null;
                    const chosenDoor = choice === "red" ? r.redDoor : r.blueDoor;
                    const isRed = choice === "red";
                    const isShelter = chosenDoor.type === "Shelter";
                    const hpColor = isShelter ? "#2ecc71" : "#e74c3c";
                    const doorColor = isRed ? "#e74c3c" : "#3498db";
                    return (
                      <Accordion
                        key={`${index}-${r.redDoor.id}-${r.blueDoor.id}`}
                        disableGutters
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "8px !important",
                          "&:before": { display: "none" },
                          "&.Mui-expanded": {
                            borderColor: `${doorColor}44`,
                            backgroundColor: "rgba(255,255,255,0.04)",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>▾</Typography>
                          }
                          sx={{ minHeight: 48, "& .MuiAccordionSummary-content": { my: 0 } }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%", pr: 1 }}>
                            {/* Round number badge */}
                            <Box
                              sx={{
                                minWidth: 28,
                                height: 28,
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: `${doorColor}18`,
                                border: `1px solid ${doorColor}44`,
                              }}
                            >
                              <Typography sx={{ color: doorColor, fontSize: "0.8rem", fontWeight: 700 }}>
                                {index + 1}
                              </Typography>
                            </Box>
                            {/* Door */}
                            <Typography sx={{ color: doorColor, fontSize: "0.9rem", fontWeight: 600 }}>
                              {isRed ? "紅門" : "藍門"}
                            </Typography>
                            {/* Room name */}
                            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {chosenDoor.name}
                            </Typography>
                            {/* HP delta */}
                            <Typography sx={{ color: hpColor, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.04em", flexShrink: 0 }}>
                              {chosenDoor.hp_change > 0 ? "+" : ""}{chosenDoor.hp_change}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
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
            <Typography sx={{ color: "rgba(255,255,255,0.3)", textAlign: "center", letterSpacing: "0.12em", fontSize: "0.85rem" }}>
              沒有找到成績資料。
            </Typography>
          )}

          {/* ── Buttons ── */}
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
              color: "#e8c96a",
              borderColor: "rgba(232,201,106,0.35)",
              letterSpacing: "0.2em",
              py: 1.6,
              fontSize: "0.88rem",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#e8c96a",
                backgroundColor: "rgba(232,201,106,0.07)",
              },
            }}
          >
            再次踏入純白迴廊
          </Button>

          <Button
            ref={sceneBtnRef}
            variant="text"
            fullWidth
            onClick={() => router.push("/sceneCollection")}
            sx={{
              opacity: 0,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.15em",
              fontSize: "0.8rem",
              mt: -2,
              "&:hover": { color: "rgba(255,255,255,0.65)" },
            }}
          >
            前往場景搜集
          </Button>

        </Stack>
      </Container>
    </Box>
  );
}
