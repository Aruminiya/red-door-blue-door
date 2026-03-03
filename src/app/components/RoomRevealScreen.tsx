"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";

export type RoomRevealHandle = {
  show: (imageUrl: string | null, roomName?: string, roomType?: "Shelter" | "Asura") => void;
  clear: () => void;
};

type RoomRevealScreenProps = {
  onCompleteAction: () => void;
};

const RoomRevealScreen = forwardRef<RoomRevealHandle, RoomRevealScreenProps>(
  function RoomRevealScreen({ onCompleteAction }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const whiteRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const exitWhiteRef = useRef<HTMLDivElement>(null);
    const shelterAudioRef = useRef<HTMLAudioElement | null>(null);
    const asuraAudioRef = useRef<HTMLAudioElement | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
    const [overlayRoomName, setOverlayRoomName] = useState<string>("");
    const [overlayRoomType, setOverlayRoomType] = useState<"Shelter" | "Asura" | null>(null);
    const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
    const [exitVisible, setExitVisible] = useState(false);

    // Pre-load audio elements once
    useEffect(() => {
      shelterAudioRef.current = new Audio("/Shelter_ElementalGoodHighShimmering.mp3");
      shelterAudioRef.current.volume = 0.3;
      asuraAudioRef.current = new Audio("/Asura_SmallDroneHorror.mp3");
      asuraAudioRef.current.volume = 0.3;
    }, []);

    // Stable refs for GSAP callbacks to avoid stale closures
    const onCompleteRef = useRef(onCompleteAction);
    onCompleteRef.current = onCompleteAction;
    const overlayRoomTypeRef = useRef(overlayRoomType);
    overlayRoomTypeRef.current = overlayRoomType;
    const currentImageUrlRef = useRef<string | null>(null);
    const bgImageUrlRef = useRef<string | null>(null);

    const updateBgImageUrl = (url: string | null) => {
      bgImageUrlRef.current = url;
      setBgImageUrl(url);
    };

    useImperativeHandle(ref, () => ({
      show(imageUrl: string | null, roomName = "", roomType?: "Shelter" | "Asura") {
        currentImageUrlRef.current = imageUrl;
        setOverlayImageUrl(imageUrl);
        setOverlayRoomName(roomName);
        setOverlayRoomType(roomType ?? null);
        setOverlayVisible(true);
      },
      clear() {
        if (!bgImageUrlRef.current) return;
        setExitVisible(true);
      },
    }));

    useEffect(() => {
      if (!overlayVisible) return;
      if (!containerRef.current || !imageRef.current || !whiteRef.current || !titleRef.current) return;

      const container = containerRef.current;
      const image = imageRef.current;
      const white = whiteRef.current;
      const title = titleRef.current;

      // Initial state: container hidden, white overlay on top, title invisible
      gsap.set(container, { opacity: 0 });
      gsap.set(white, { opacity: 1 });
      gsap.set(image, { filter: "blur(0px)", scale: 1.2 });
      gsap.set(title, { opacity: 0, y: 12 });

      // tl1: white flash — container fade in, then white fade out
      const tl1 = gsap.timeline();
      tl1.to(container, { opacity: 1, duration: 1.5, ease: "power2.out" });
      tl1.to(white, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => {
          const audio = overlayRoomTypeRef.current === "Shelter"
            ? shelterAudioRef.current
            : asuraAudioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          }
        },
      });

      // tl2: image life — starts when container is fully visible (delay: 1.5s),
      // so scale begins while white is still fading, creating a fluid overlap
      const tl2 = gsap.timeline({ delay: 1.5 });

      // Scale down + title fade in simultaneously
      tl2.to(image, { scale: 1, duration: 5, ease: "power1.out" }, 0);
      tl2.to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0);

      // Title fade out 0.8s before blur starts
      tl2.to(title, { opacity: 0, y: -8, duration: 0.8, ease: "power2.in" }, 4.2);

      // Blur
      tl2.to(image, {
        filter: "blur(20px)",
        scale: 1.03,
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => updateBgImageUrl(currentImageUrlRef.current),
      }, 5);

      // Fade out overlay
      tl2.to(container, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          setOverlayVisible(false);
          onCompleteRef.current();
        },
      }, 5.5);

      return () => {
        tl1.kill();
        tl2.kill();
      };
    }, [overlayVisible]);

    // Exit animation: white flash covers blurred background → clear → reveal corridor
    useEffect(() => {
      if (!exitVisible) return;
      if (!exitWhiteRef.current) return;

      const white = exitWhiteRef.current;
      gsap.set(white, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(white, { opacity: 1, duration: 0.4, ease: "power2.out" });
      tl.add(() => updateBgImageUrl(null));
      tl.to(white, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setExitVisible(false),
      });

      return () => {
        tl.kill();
      };
    }, [exitVisible]);

    return (
      <>
        {/* Blurred room background — persists behind StoryDialog after reveal */}
        {bgImageUrl && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: "-30px",
                backgroundImage: `url(${bgImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(20px)",
              }}
            />
          </Box>
        )}

        {/* Exit white flash — covers blurred background when transitioning to next round */}
        {exitVisible && (
          <Box
            ref={exitWhiteRef}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              backgroundColor: "#fff",
              opacity: 0,
            }}
          />
        )}

        {/* Full-screen reveal overlay */}
        {overlayVisible && (
          <Box
            ref={containerRef}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              overflow: "hidden",
              opacity: 0,
            }}
          >
            {/* Room image */}
            <Box
              ref={imageRef}
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: overlayImageUrl ? `url(${overlayImageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: overlayImageUrl ? "transparent" : "#000",
              }}
            />
            {/* White flash — fades out to reveal the image */}
            <Box
              ref={whiteRef}
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#fff",
              }}
            />
            {/* Room name — bottom-left, appears during scale hold */}
            {overlayRoomName && (
              <Box
                ref={titleRef}
                sx={{
                  position: "absolute",
                  bottom: 48,
                  left: 48,
                  opacity: 0,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textShadow: "0 2px 16px rgba(0,0,0,0.6)",
                  }}
                >
                  {overlayRoomName}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </>
    );
  }
);

export default RoomRevealScreen;
