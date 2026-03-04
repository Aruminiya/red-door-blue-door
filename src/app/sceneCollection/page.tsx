"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import DoorDataFullSceneDialog from "@/app/components/DoorDataFullSceneDialog";
import allRooms from "@/room.json";
import type { Door } from "@/app/types";

const UNLOCKED_ROOMS_KEY = "rdbd:unlocked_rooms";

const shelterRooms = (allRooms as Door[]).filter((r) => r.type === "Shelter");
const asuraRooms = (allRooms as Door[]).filter((r) => r.type === "Asura");
const TOTAL_ROOMS = allRooms.length;

const RoomTile = memo(function RoomTile({
  room,
  unlocked,
  onClick,
}: {
  room: Door;
  unlocked: boolean;
  onClick: () => void;
}) {
  const isShelter = room.type === "Shelter";
  const accentColor = isShelter ? "#2ecc71" : "#e74c3c";

  return (
    <Tooltip
      title={unlocked ? room.name : "???"}
      placement="top"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0,0,0,0.85)",
            color: unlocked ? "white" : "rgba(255,255,255,0.4)",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          },
        },
      }}
    >
      <Box
        onClick={unlocked ? onClick : undefined}
        sx={{
          position: "relative",
          aspectRatio: "1",
          borderRadius: 1,
          overflow: "hidden",
          border: unlocked
            ? `1.5px solid ${accentColor}`
            : "1.5px solid rgba(255,255,255,0.08)",
          cursor: unlocked ? "pointer" : "default",
          backgroundColor: "rgba(255,255,255,0.03)",
          transition: "transform 0.15s, box-shadow 0.15s",
          "&:hover": unlocked
            ? {
                transform: "scale(1.06)",
                boxShadow: `0 0 10px ${accentColor}66`,
              }
            : {},
        }}
      >
        {unlocked && room.imageUrl ? (
          <Box
            component="img"
            src={room.imageUrl}
            alt={room.name}
            loading="lazy"
            decoding="async"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          /* Locked tile */
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.12)",
              fontSize: { xs: "0.7rem", md: "1rem" },
              userSelect: "none",
            }}
          >
            ?
          </Box>
        )}

        {/* Unlocked indicator dot */}
        {unlocked && (
          <Box
            sx={{
              position: "absolute",
              bottom: 3,
              right: 3,
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: accentColor,
              boxShadow: `0 0 4px ${accentColor}`,
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
});

function SectionGrid({
  rooms,
  unlockedIds,
  onSelect,
  sectionRef,
  label,
  labelColor,
  unlockedCount,
}: {
  rooms: Door[];
  unlockedIds: Set<number>;
  onSelect: (room: Door) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
  label: string;
  labelColor: string;
  unlockedCount: number;
}) {
  return (
    <Box ref={sectionRef} sx={{ opacity: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Typography
          sx={{
            color: labelColor,
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem" }}>
          {unlockedCount} / {rooms.length}
        </Typography>
        {/* Progress bar */}
        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(255,255,255,0.08)", position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${(unlockedCount / rooms.length) * 100}%`,
              bgcolor: labelColor,
              opacity: 0.6,
              transition: "width 0.5s ease",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(8, 1fr)", md: "repeat(10, 1fr)" },
          gap: { xs: 0.75, md: 0.75 },
        }}
      >
        {rooms.map((room) => (
          <RoomTile
            key={room.id}
            room={room}
            unlocked={unlockedIds.has(room.id)}
            onClick={() => onSelect(room)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function SceneCollectionPage() {
  const router = useRouter();
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const [selectedRoom, setSelectedRoom] = useState<Door | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const shelterRef = useRef<HTMLDivElement>(null);
  const asuraRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(UNLOCKED_ROOMS_KEY) ?? "[]") as number[];
    setUnlockedIds(new Set(ids));
  }, []);

  useEffect(() => {
    const els = [
      heroRef.current,
      shelterRef.current,
      asuraRef.current,
      btnRef.current,
    ].filter(Boolean);
    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out" }
    );
  }, [unlockedIds]);

  const handleSelect = useCallback((room: Door) => setSelectedRoom(room), []);

  const unlockedCount = unlockedIds.size;
  const unlockedShelterCount = shelterRooms.filter((r) => unlockedIds.has(r.id)).length;
  const unlockedAsuraCount = asuraRooms.filter((r) => unlockedIds.has(r.id)).length;

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
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          zIndex: 1,
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, py: { xs: 5, md: 8 } }}>
        <Stack spacing={5}>

          {/* Hero */}
          <Box ref={heroRef} sx={{ textAlign: "center", opacity: 0 }}>
            <Typography
              sx={{
                color: "#e8c96a",
                fontWeight: 700,
                fontSize: { xs: "1.6rem", md: "2rem" },
                letterSpacing: "0.2em",
                lineHeight: 1.5,
                mb: 1.5,
              }}
            >
              場景搜集進度
            </Typography>
            <Box sx={{ width: 56, height: "1px", bgcolor: "#e8c96a", mx: "auto", mb: 1.5, opacity: 0.5 }} />
            <Typography sx={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", fontSize: "0.875rem" }}>
              已解鎖{" "}
              <Box component="span" sx={{ color: "#e8c96a", fontWeight: 700 }}>
                {unlockedCount}
              </Box>
              {" "}/ {TOTAL_ROOMS} 個場景
            </Typography>
          </Box>

          {/* Shelter grid */}
          <SectionGrid
            rooms={shelterRooms}
            unlockedIds={unlockedIds}
            onSelect={handleSelect}
            sectionRef={shelterRef as React.RefObject<HTMLDivElement>}
            label="避難所 Shelter"
            labelColor="#2ecc71"
            unlockedCount={unlockedShelterCount}
          />

          {/* Asura grid */}
          <SectionGrid
            rooms={asuraRooms}
            unlockedIds={unlockedIds}
            onSelect={handleSelect}
            sectionRef={asuraRef as React.RefObject<HTMLDivElement>}
            label="修羅場 Asura"
            labelColor="#e74c3c"
            unlockedCount={unlockedAsuraCount}
          />

          {/* Back button */}
          <Button
            ref={btnRef}
            variant="outlined"
            fullWidth
            onClick={() => router.push("/")}
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
            返回首頁
          </Button>

        </Stack>
      </Container>

      {/* Room detail dialog */}
      <DoorDataFullSceneDialog
        door={selectedRoom}
        open={selectedRoom !== null}
        onCloseAction={() => setSelectedRoom(null)}
      />
    </Box>
  );
}
