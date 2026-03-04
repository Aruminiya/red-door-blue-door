"use client";

import { useRouter } from "next/navigation";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { GameProvider } from "./contexts/GameContext";
import { BgMusicProvider } from "./contexts/BgMusicContext";
import GlobalSettingsButton from "./components/GlobalSettingsButton";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1f3655" },
    secondary: { main: "#607d8b" },
    background: {
      default: "#f2f4f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BgMusicProvider>
        <GlobalSettingsButton />
        <GameProvider onFinish={() => router.push("/results")}>
          {children}
        </GameProvider>
      </BgMusicProvider>
    </ThemeProvider>
  );
}
