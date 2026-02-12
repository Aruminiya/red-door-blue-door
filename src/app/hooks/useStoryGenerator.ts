import { useEffect } from "react";
import type { Round } from "@/app/types";
import { useGemini } from "./useGemini";

type UseStoryGeneratorOptions = {
  currentRound: Round | undefined;
  currentChoice: "red" | "blue" | undefined;
  playerChoiceCount: number;
  roundCount: number;
  heart: number;
  maxRounds: number;
};

type UseStoryGeneratorReturn = {
  loading: boolean;
  error: string | null;
  output: string;
  clearOutput: () => void;
};

export function useStoryGenerator({
  currentRound,
  currentChoice,
  playerChoiceCount,
  roundCount,
  heart,
  maxRounds,
}: UseStoryGeneratorOptions): UseStoryGeneratorReturn {
  const { loading, error, output, submit, clearOutput } = useGemini();

  // 監控玩家選擇門的情況，自動生成故事
  useEffect(() => {
    if (!currentRound || !currentChoice) return;
    if (playerChoiceCount !== roundCount) return;

    const chosenDoor = currentChoice === "red" ? currentRound.redDoor : currentRound.blueDoor;
    const roundNum = playerChoiceCount;

    const prompt = `
      我進入了第 ${roundNum} 間房間 幫我說故事
      【房間屬性】：${chosenDoor.type === "Shelter" ? "庇護所" : "修羅場"}
      【場景名稱】：${chosenDoor.name}
      【環境特徵】：${chosenDoor.env_features}
      【資源物資】：${chosenDoor.resource_desc ?? "無"}
      【潛在威脅】：${chosenDoor.threat_desc ?? "無"}
      【血量變化】：${chosenDoor.hp_change}
      【玩家變化後的血量】：${heart}
      - 請用中文以第二人稱幫我說一個 500 字以內的故事
      - 除非玩家死亡 或 成功通關 否則 故事的結尾都要接回 純白迴廊 眼前有兩道紅藍門 並且不要反問我問題
      - 不能額外描述門的詳細外觀
      - 【玩家變化後的血量】如果為 0 代表玩家已在房間的遭遇中死亡
      - 如果玩家進入到 第 ${maxRounds} 房間 並且 沒有死亡 代表玩家成功通關
      `;
    submit(prompt);
  }, [playerChoiceCount, roundCount, currentRound, currentChoice, heart, maxRounds, submit]);

  return {
    loading,
    error,
    output,
    clearOutput,
  };
}
