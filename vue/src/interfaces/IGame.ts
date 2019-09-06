import { Round } from "@/classes/Round";
import { History } from "@/classes/History";

export interface IGame {
  statuses: { [status: number]: string };
  status: number;
  id: string;
  name: string;
  dataBaseUrl: string;
  starterTurn: number;
  maximumRemoteness: number;
  round: Round;
  history: History;
}
