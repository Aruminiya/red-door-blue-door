"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const INTRO_TEXT =
  "歡迎來到這場純白迴廊的試煉。我是你的引路人，將見證你在機率與命運之間的抉擇。現在，你站在無止境的白色空間中央，四周寂靜得只能聽見自己的心跳。前方，兩扇門扉靜靜地佇立，等待著你的推開。";

type IntroScreenProps = {
  onStartAction: () => void;
};

export default function IntroScreen({ onStartAction }: IntroScreenProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const introTextRef = useRef<HTMLSpanElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const introButtonRef = useRef<HTMLButtonElement>(null);
  const introContentRef = useRef<HTMLDivElement>(null);

  // Intro animation effect
  useEffect(() => {
    if (!introTextRef.current || !introContainerRef.current) return;

    const tl = gsap.timeline();

    // Fade in container
    tl.fromTo(
      introContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
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

    tl.fromTo(
      introButtonRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    return () => {
      tl.kill();
    };
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
        duration: 0.35,
        opacity: 1,
        ease: "power2.out",
        overwrite: true,
      });
    };

    gsap.set(container, {
      height: content.getBoundingClientRect().height + paddingY,
    });

    const observer = new ResizeObserver(() => {
      syncHeight();
    });

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleStartGame = () => {
    gsap.to(introContainerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
      onComplete: onStartAction,
    });
  };

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
        <Box ref={introContentRef}>
          <Typography
            component="p"
            sx={{
              color: "white",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 2,
              letterSpacing: "0.1em",
            }}
          >
            <Box component="span" ref={introTextRef} />
          </Typography>
          {introComplete && (
            <Button
              variant="outlined"
              onClick={handleStartGame}
              ref={introButtonRef}
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
    </Box>
  );
}
