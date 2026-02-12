"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const INTRO_TEXT =
  "歡迎來到這場純白迴廊的試煉。我是你的引路人，將見證你在機率與命運之間的抉擇。現在，你站在無止境的白色空間中央，四周寂靜得只能聽見自己的心跳。前方，兩扇門扉靜靜地佇立，等待著你的推開。";

type IntroScreenProps = {
  onStart: () => void;
};

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const introTextRef = useRef<HTMLSpanElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);

  // Intro animation effect
  useEffect(() => {
    if (!introTextRef.current || !introContainerRef.current) return;

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
  }, []);

  const handleStartGame = () => {
    gsap.to(introContainerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
      onComplete: onStart,
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
