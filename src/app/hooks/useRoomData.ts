import { useMemo } from "react";
import room from "@/room.json";
import type { Door } from "@/app/types";

type RoomSplit = {
  roomData: Door[];
  shelters: Door[];
  asuras: Door[];
};

export function useRoomData(): RoomSplit {
  return useMemo(() => {
    const roomData = room as Door[];
    const result: RoomSplit = {
      roomData,
      shelters: [],
      asuras: [],
    };

    for (const item of roomData) {
      if (item.type === "Shelter") result.shelters.push(item);
      else if (item.type === "Asura") result.asuras.push(item);
    }

    return result;
  }, []);
}
