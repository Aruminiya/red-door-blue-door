"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import HowToPlayDialog from "./HowToPlayDialog";

const INTRO_LINES = [
  "歡迎來到這場純白迴廊的試煉。我是你的引路人",
  "現在，你站在無止境的白色空間中央",
  "四周寂靜得只能聽見自己的心跳",
  "兩扇門扉靜靜地佇立，等待著你的推開",
];

type IntroScreenProps = {
  onStartAction: () => void;
};

export default function IntroScreen({ onStartAction }: IntroScreenProps) {
  const router = useRouter();
  const [introComplete, setIntroComplete] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const introButtonRef = useRef<HTMLDivElement>(null);
  const introContentRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!introContainerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      introContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    linesRef.current.forEach((line, index) => {
      if (!line) return;
      tl.fromTo(
        line,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        index === 0 ? "+=0.3" : "-=0.3"
      );
    });

    tl.add(() => setIntroComplete(true));

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!introContainerRef.current || !introContentRef.current) return;

    const container = introContainerRef.current;
    const content = introContentRef.current;
    const computed = window.getComputedStyle(container);
    const paddingY =
      parseFloat(computed.paddingTop || "0") +
      parseFloat(computed.paddingBottom || "0");

    const syncHeight = () => {
      const contentHeight = content.getBoundingClientRect().height;
      gsap.to(container, {
        height: contentHeight + paddingY,
        duration: 1,
        opacity: 1,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    gsap.set(container, {
      height: content.getBoundingClientRect().height + paddingY,
    });

    const observer = new ResizeObserver(() => { syncHeight(); });
    observer.observe(content);

    return () => { observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    requestAnimationFrame(() => {
      if (introButtonRef.current) {
        gsap.fromTo(
          introButtonRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }
        );
      }
    });
  }, [introComplete]);

  const handleStartGame = () => {
    gsap.to(introContainerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
      onComplete: onStartAction,
    });
  };

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
          backgroundRepeat: "no-repeat",
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
          backgroundColor: "rgba(0,0,0,0.78)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, md: 4 },
        }}
      >
        <Box
          ref={introContainerRef}
          sx={{
            width: "100%",
            maxWidth: 520,
            opacity: 0,
          }}
        >
          <Box ref={introContentRef}>
            {/* Top label */}
            <Typography
              sx={{
                color: "rgba(255,255,255,0.18)",
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                textAlign: "center",
                mb: 3,
              }}
            >
              Pure White Corridor
            </Typography>

            {/* Top decorative divider */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                mb: 4.5,
              }}
            >
              <Box sx={{ width: 48, height: "1px", bgcolor: "rgba(232,201,106,0.25)" }} />
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: "#e8c96a",
                  opacity: 0.5,
                  boxShadow: "0 0 6px rgba(232,201,106,0.6)",
                }}
              />
              <Box sx={{ width: 48, height: "1px", bgcolor: "rgba(232,201,106,0.25)" }} />
            </Box>

            {/* Intro lines */}
            {INTRO_LINES.map((line, index) => (
              <Typography
                key={index}
                ref={(el) => { linesRef.current[index] = el; }}
                component="p"
                sx={{
                  color: index === INTRO_LINES.length - 1
                    ? "rgba(232,201,106,0.9)"
                    : "rgba(238,241,247,0.78)",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 2,
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  opacity: 0,
                  mb: index < INTRO_LINES.length - 1 ? 1.25 : 0,
                }}
              >
                {line}
              </Typography>
            ))}

            {/* Button area */}
            {introComplete && (
              <>
                {/* Divider */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    mt: 5,
                    mb: 4,
                  }}
                >
                  <Box sx={{ width: 40, height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />
                  <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.12)" }} />
                  <Box sx={{ width: 40, height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />
                </Box>

                <Box ref={introButtonRef} sx={{ opacity: 0 }}>
                  {/* Primary — 進入試煉 */}
                  <Button
                    fullWidth
                    onClick={handleStartGame}
                    sx={{
                      py: 1.6,
                      mb: 1.5,
                      fontSize: "0.92rem",
                      letterSpacing: "0.22em",
                      borderRadius: 1.5,
                      color: "#e8c96a",
                      border: "1px solid rgba(232,201,106,0.4)",
                      backgroundColor: "rgba(232,201,106,0.07)",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#e8c96a",
                        backgroundColor: "rgba(232,201,106,0.14)",
                      },
                    }}
                  >
                    進入試煉
                  </Button>

                  {/* Secondary buttons */}
                  <Box sx={{ display: "flex", gap: 1.25 }}>
                    <Button
                      fullWidth
                      onClick={() => router.push("/sceneCollection")}
                      sx={{
                        py: 1.2,
                        fontSize: "0.8rem",
                        letterSpacing: "0.15em",
                        borderRadius: 1.5,
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "rgba(255,255,255,0.35)",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.75)",
                        },
                      }}
                    >
                      場景搜集
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => setHowToPlayOpen(true)}
                      sx={{
                        py: 1.2,
                        fontSize: "0.8rem",
                        letterSpacing: "0.15em",
                        borderRadius: 1.5,
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "rgba(255,255,255,0.35)",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.75)",
                        },
                      }}
                    >
                      遊戲說明
                    </Button>
                  </Box>
                </Box>

                <HowToPlayDialog open={howToPlayOpen} onCloseAction={() => setHowToPlayOpen(false)} />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
