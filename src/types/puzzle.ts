// types/puzzle.ts
export type Tile = {
    letter: string | null     // im Raster stehender Buchstabe
    clue?: string             // kleine Hilfestellung (z. B. „Domestic Animal“)
    filled?: boolean          // steht hier schon eine Antwort?
  }
  
  export type Puzzle = {
    id: string
    size: number              // z. B. 8 für 8×8
    grid: Tile[][]            // 2D-Array der Tiles
    bank: string[]            // Buchstaben, die du unten auswählst
  }
  