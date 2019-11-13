import { TMoveData } from "@/types/internal/TMoveData";

export interface TPositionData {
  position: string;
  positionValue: string;
  remoteness: number;
  moveDataArray: Array<TMoveData>;
}
