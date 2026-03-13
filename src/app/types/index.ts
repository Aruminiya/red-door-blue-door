export type Door = { 
  id: number, 
  type: "Shelter" | "Asura", 
  imageUrl: string | null,
  theme: string,
  name: string, 
  door_visual: string, 
  env_features: string, 
  hp_change: number, 
  resource_desc: string | null,
  threat_desc: string | null,
  story_desc: string | null
};

export type Round = {
  redDoor: Door;
  blueDoor: Door;
};

export type GameState = {
  heart: number;
  playerChoice: ("red" | "blue")[];
  round: Round[];
};

export type GameAction =
  | { type: "ASSIGN_ROUND"; payload: Round }
  | { type: "PLAYER_CHOICE"; payload: { choice: "red" | "blue"; hpDelta: number } }
  | { type: "RESET" };
