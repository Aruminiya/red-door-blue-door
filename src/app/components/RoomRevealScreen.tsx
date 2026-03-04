"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import gsap from "gsap";
import allRooms from "@/room.json";

const UNLOCKED_ROOMS_KEY = "rdbd:unlocked_rooms";
const TOTAL_ROOMS = allRooms.length;

export type RoomRevealHandle = {
  show: (imageUrl: string | null, roomName?: string, roomType?: "Shelter" | "Asura", isNewRoom?: boolean) => void;
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
    const fadeDurationAudioRef = useRef<HTMLAudioElement | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
    const [overlayRoomName, setOverlayRoomName] = useState<string>("");
    const [overlayRoomType, setOverlayRoomType] = useState<"Shelter" | "Asura" | null>(null);
    const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
    const [exitVisible, setExitVisible] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarInfo, setSnackbarInfo] = useState<{ name: string; count: number; type: "Shelter" | "Asura" } | null>(null);
    const snackbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clean up snackbar timer on unmount
    useEffect(() => {
      return () => {
        if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
      };
    }, []);

    // Pre-load audio elements once
    useEffect(() => {
      shelterAudioRef.current = new Audio("/Shelter_ElementalGoodHighShimmering.mp3");
      shelterAudioRef.current.volume = 0.2;
      asuraAudioRef.current = new Audio("/Asura_SmallDroneHorror.mp3");
      asuraAudioRef.current.volume = 0.3;
      fadeDurationAudioRef.current = new Audio("/Zoom.mp3");
      fadeDurationAudioRef.current.volume = 0.2;
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
      show(imageUrl: string | null, roomName = "", roomType?: "Shelter" | "Asura", isNewRoom = false) {
        currentImageUrlRef.current = imageUrl;
        setOverlayImageUrl(imageUrl);
        setOverlayRoomName(roomName);
        setOverlayRoomType(roomType ?? null);
        setOverlayVisible(true);

        if (isNewRoom) {
          const ids = JSON.parse(localStorage.getItem(UNLOCKED_ROOMS_KEY) ?? "[]") as number[];
          if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
          snackbarTimerRef.current = setTimeout(() => {
            setSnackbarInfo({ name: roomName, count: ids.length, type: roomType ?? "Shelter" });
            setSnackbarOpen(true);
          }, 1500);
        }
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
      tl1.to(container, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        onStart: () => {
          const fadeAudio = fadeDurationAudioRef.current;
          if (fadeAudio) {
            fadeAudio.currentTime = 0;
            fadeAudio.play().catch(() => {});
          }
        }
      });
      tl1.to(white, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => {
          const roomAudio = overlayRoomTypeRef.current === "Shelter"
            ? shelterAudioRef.current
            : asuraAudioRef.current;
          if (roomAudio) {
            roomAudio.currentTime = 0;
            roomAudio.play().catch(() => {});
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

    const accentColor = snackbarInfo?.type === "Shelter" ? "#2ecc71" : "#e74c3c";
    const revealAccentColor = overlayRoomType === "Shelter" ? "#2ecc71" : "#e74c3c";
    const revealTypeLabel = overlayRoomType === "Shelter" ? "避難所 · Shelter" : "修羅場 · Asura";

    return (
      <>
        {/* New room unlock Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ zIndex: 10001 }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(10, 12, 18, 0.92)",
              border: `1px solid ${accentColor}`,
              borderRadius: 1.5,
              px: 2,
              py: 1.25,
              backdropFilter: "blur(8px)",
              minWidth: 220,
            }}
          >
            <Typography sx={{ color: accentColor, fontSize: "0.7rem", letterSpacing: "0.14em", mb: 0.25 }}>
              ✦ 新場景解鎖
            </Typography>
            <Typography sx={{ color: "white", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em", mb: 0.5 }}>
              {snackbarInfo?.name}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
              已收集 {snackbarInfo?.count} / {TOTAL_ROOMS} 個場景
            </Typography>
          </Box>
        </Snackbar>

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
            {/* Gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.92) 100%)",
                pointerEvents: "none",
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
            {/* Room info — bottom-left, appears during scale hold */}
            {overlayRoomName && (
              <Box
                ref={titleRef}
                sx={{
                  position: "absolute",
                  bottom: { xs: 32, md: 48 },
                  left: { xs: 24, md: 48 },
                  opacity: 0,
                }}
              >
                {/* Type badge */}
                {overlayRoomType && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      mb: 1.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: `${revealAccentColor}1a`,
                      border: `1px solid ${revealAccentColor}55`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: revealAccentColor,
                        boxShadow: `0 0 5px ${revealAccentColor}`,
                      }}
                    />
                    <Typography
                      sx={{
                        color: revealAccentColor,
                        fontSize: "0.7rem",
                        letterSpacing: "0.18em",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {revealTypeLabel}
                    </Typography>
                  </Box>
                )}
                {/* Room name */}
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { xs: "2rem", md: "3rem" },
                    letterSpacing: "0.08em",
                    lineHeight: 1.2,
                    textShadow: "0 2px 20px rgba(0,0,0,0.7)",
                  }}
                >
                  {overlayRoomName}
                </Typography>
                {/* Divider */}
                <Box sx={{ width: 40, height: "1px", bgcolor: "rgba(255,255,255,0.3)", mt: 1.5 }} />
              </Box>
            )}
          </Box>
        )}
      </>
    );
  }
);

export default RoomRevealScreen;
