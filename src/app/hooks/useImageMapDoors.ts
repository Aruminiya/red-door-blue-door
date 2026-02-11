"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================
// 型別定義
// ============================================

/**
 * 門的座標類型
 * 使用矩形的左上角 (x1, y1) 和右下角 (x2, y2) 來定義區域
 *
 * 座標系統：
 *   (0,0) ─────────────► X軸
 *     │
 *     │    (x1,y1) ┌─────────┐
 *     │            │  門區域  │
 *     │            └─────────┘ (x2,y2)
 *     ▼
 *    Y軸
 */
interface DoorCoords {
  x1: number;  // 左上角 X 座標 (像素)
  y1: number;  // 左上角 Y 座標 (像素)
  x2: number;  // 右下角 X 座標 (像素)
  y2: number;  // 右下角 Y 座標 (像素)
}

/**
 * 紅藍門的座標配置
 */
interface DoorCoordsConfig {
  red: DoorCoords;
  blue: DoorCoords;
}

/**
 * Debug 框框的位置類型 (用於視覺化顯示)
 * 使用 CSS 的 left, top, width, height
 */
interface BoxPosition {
  left: number;   // 距離容器左邊的距離 (像素)
  top: number;    // 距離容器上邊的距離 (像素)
  width: number;  // 框框寬度 (像素)
  height: number; // 框框高度 (像素)
}

/**
 * Hook 的輸入參數
 */
interface UseImageMapDoorsOptions {
  /** 門在「原始圖片」中的像素座標 (從 image-map.net 取得) */
  doorCoords: DoorCoordsConfig;
  /** 是否啟用計算 (例如：只在選門階段才啟用) */
  enabled?: boolean;
}

/**
 * Hook 的回傳值
 */
interface UseImageMapDoorsReturn {
  /** 圖片的 ref，需要綁定到 <img> 元素上 */
  imageRef: React.RefObject<HTMLImageElement | null>;
  /**
   * Image Map 的座標字串
   * 格式: "x1,y1,x2,y2" (HTML <area> 標籤需要的格式)
   */
  mapCoords: {
    red: string;
    blue: string;
  };
  /** Debug 用的框框位置 (開發時視覺化用) */
  debugBoxes: {
    red: BoxPosition;
    blue: BoxPosition;
  };
  /** 手動觸發重新計算座標的函數 (通常用於 onLoad) */
  updateCoords: () => void;
}

// ============================================
// Hook 主體
// ============================================

/**
 * useImageMapDoors - 處理 Image Map 門位置的自訂 Hook
 *
 * 【問題】
 * 當圖片使用 object-fit: cover 時，圖片會被縮放並裁切
 * 我們不能直接使用原始圖片的座標，需要根據實際顯示情況轉換
 *
 * 【解決方案】
 * 1. 計算圖片的縮放比例 (scale)
 * 2. 計算被裁切掉的偏移量 (offsetX, offsetY)
 * 3. 用公式轉換座標: 顯示座標 = 原始座標 × scale - offset
 *
 * 【使用方式】
 * ```tsx
 * const { imageRef, mapCoords, debugBoxes, updateCoords } = useImageMapDoors({
 *   doorCoords: DEFAULT_DOOR_COORDS,
 *   enabled: true,
 * });
 *
 * <img ref={imageRef} onLoad={updateCoords} useMap="#doorMap" />
 * <map name="doorMap">
 *   <area coords={mapCoords.red} onClick={...} />
 * </map>
 * ```
 */
export function useImageMapDoors({
  doorCoords,
  enabled = true,
}: UseImageMapDoorsOptions): UseImageMapDoorsReturn {

  // ========== State 定義 ==========

  // 圖片元素的參照，用來取得圖片尺寸資訊
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Image Map 座標 (字串格式，給 <area> 標籤用)
  const [mapCoords, setMapCoords] = useState({
    red: "0,0,0,0",
    blue: "0,0,0,0",
  });

  // Debug 框框位置 (像素格式，給視覺化框框用)
  const [debugBoxes, setDebugBoxes] = useState<{
    red: BoxPosition;
    blue: BoxPosition;
  }>({
    red: { left: 0, top: 0, width: 0, height: 0 },
    blue: { left: 0, top: 0, width: 0, height: 0 },
  });

  // ========== 核心計算函數 ==========

  /**
   * 計算並更新門的座標
   * 這是整個 Hook 的核心邏輯
   */
  const updateCoords = useCallback(() => {
    const img = imageRef.current;

    // 確保圖片已載入且有尺寸資訊
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    // ---------- Step 1: 取得尺寸資訊 ----------

    const displayWidth = img.clientWidth;    // 容器實際顯示的寬度
    const displayHeight = img.clientHeight;  // 容器實際顯示的高度
    const naturalWidth = img.naturalWidth;   // 圖片原始寬度 (例如: 1456px)
    const naturalHeight = img.naturalHeight; // 圖片原始高度 (例如: 816px)

    // ---------- Step 2: 計算長寬比 ----------

    const displayRatio = displayWidth / displayHeight;  // 容器的長寬比
    const naturalRatio = naturalWidth / naturalHeight;  // 圖片的長寬比

    // ---------- Step 3: 計算縮放比例和裁切偏移 ----------

    /**
     * object-fit: cover 的行為：
     * - 圖片會等比例縮放，填滿整個容器
     * - 超出容器的部分會被裁切
     * - 裁切是置中的（左右或上下各裁一半）
     *
     * 判斷方式：比較容器和圖片的長寬比
     */

    let scale: number;   // 縮放比例
    let offsetX = 0;     // X 方向的裁切偏移
    let offsetY = 0;     // Y 方向的裁切偏移

    if (displayRatio > naturalRatio) {
      /**
       * 情況 A: 容器比較「寬扁」
       *
       * 圖片會以寬度為基準縮放，高度會超出並被裁切
       *
       *   ┌─────────────────────────────┐
       *   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 上方裁切 (offsetY)
       *   ├─────────────────────────────┤
       *   │         可見區域             │ ← 容器高度
       *   ├─────────────────────────────┤
       *   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 下方裁切 (offsetY)
       *   └─────────────────────────────┘
       *             圖片寬度 = 容器寬度
       */
      scale = displayWidth / naturalWidth;          // 以寬度計算縮放比例
      const scaledHeight = naturalHeight * scale;   // 縮放後的圖片高度
      offsetY = (scaledHeight - displayHeight) / 2; // 上下各裁切一半

    } else {
      /**
       * 情況 B: 容器比較「高瘦」
       *
       * 圖片會以高度為基準縮放，寬度會超出並被裁切
       *
       *   ┌───┬─────────────────┬───┐
       *   │░░░│                 │░░░│
       *   │░░░│    可見區域      │░░░│
       *   │░░░│                 │░░░│
       *   └───┴─────────────────┴───┘
       *     ↑                     ↑
       *   左裁切               右裁切
       *  (offsetX)            (offsetX)
       */
      scale = displayHeight / naturalHeight;       // 以高度計算縮放比例
      const scaledWidth = naturalWidth * scale;    // 縮放後的圖片寬度
      offsetX = (scaledWidth - displayWidth) / 2;  // 左右各裁切一半
    }

    // ---------- Step 4: 座標轉換函數 ----------

    /**
     * 將原始圖片座標轉換為顯示座標
     *
     * 公式: 顯示座標 = 原始座標 × 縮放比例 - 裁切偏移
     *
     * 範例:
     *   原始座標 x1 = 568 (紅門左邊界)
     *   scale = 0.8 (圖片被縮小)
     *   offsetX = 50 (左邊被裁掉 50px)
     *
     *   顯示座標 = 568 × 0.8 - 50 = 404.4 ≈ 404
     */
    const calcCoords = (coords: DoorCoords): string => {
      const x1 = Math.round(coords.x1 * scale - offsetX);
      const y1 = Math.round(coords.y1 * scale - offsetY);
      const x2 = Math.round(coords.x2 * scale - offsetX);
      const y2 = Math.round(coords.y2 * scale - offsetY);

      // 回傳 HTML Image Map 需要的格式: "x1,y1,x2,y2"
      return `${x1},${y1},${x2},${y2}`;
    };

    /**
     * 計算 Debug 框框的 CSS 位置
     * 與上面邏輯相同，但回傳 CSS 格式
     */
    const calcBox = (coords: DoorCoords): BoxPosition => ({
      left: coords.x1 * scale - offsetX,
      top: coords.y1 * scale - offsetY,
      width: (coords.x2 - coords.x1) * scale,   // 寬度 = 右邊界 - 左邊界
      height: (coords.y2 - coords.y1) * scale,  // 高度 = 下邊界 - 上邊界
    });

    // ---------- Step 5: 更新 State ----------

    setMapCoords({
      red: calcCoords(doorCoords.red),
      blue: calcCoords(doorCoords.blue),
    });

    setDebugBoxes({
      red: calcBox(doorCoords.red),
      blue: calcBox(doorCoords.blue),
    });

  }, [doorCoords]);

  // ========== 副作用：監聽視窗縮放 ==========

  useEffect(() => {
    // 如果未啟用，不做任何事
    if (!enabled) return;

    // 初始計算一次
    updateCoords();

    // 監聽視窗縮放事件，縮放時重新計算座標
    window.addEventListener("resize", updateCoords);

    // 清理函數：移除事件監聽器
    return () => window.removeEventListener("resize", updateCoords);
  }, [enabled, updateCoords]);

  // ========== 回傳值 ==========

  return {
    imageRef,     // 綁定到 <img> 的 ref
    mapCoords,    // Image Map 座標 (字串)
    debugBoxes,   // Debug 框框位置 (像素)
    updateCoords, // 手動更新函數
  };
}

// ============================================
// 預設座標配置
// ============================================

/**
 * 預設的門座標 (來自 image-map.net 工具)
 *
 * 這些座標是相對於「原始圖片」的像素位置
 * 使用 https://www.image-map.net/ 上傳圖片後框選門的區域取得
 *
 * 座標格式: { x1: 左, y1: 上, x2: 右, y2: 下 }
 */
export const DEFAULT_DOOR_COORDS: DoorCoordsConfig = {
  red: { x1: 568, y1: 376, x2: 697, y2: 697 },   // 紅門區域
  blue: { x1: 772, y1: 376, x2: 902, y2: 693 },  // 藍門區域
};
