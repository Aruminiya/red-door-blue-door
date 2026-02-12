"use client";

import { Box } from "@mui/material";
import { useImageMapDoors, DEFAULT_DOOR_COORDS } from "@/app/hooks/useImageMapDoors";

type DoorSelectorProps = {
  showDoorSelection: boolean;
  onSelect: (choice: "red" | "blue") => void;
};

export default function DoorSelector({ showDoorSelection, onSelect }: DoorSelectorProps) {
  const { imageRef, mapCoords, debugBoxes, updateCoords } = useImageMapDoors({
    doorCoords: DEFAULT_DOOR_COORDS,
    enabled: true,
  });

  return (
    <>
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

      {/* Door Click Areas */}
      {showDoorSelection && (
        <>
          {/* Red Door */}
          <Box
            onClick={() => onSelect("red")}
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
          />
          {/* Blue Door */}
          <Box
            onClick={() => onSelect("blue")}
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
    </>
  );
}
