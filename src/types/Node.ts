export interface Node {
  uuid: string;
  title: string;
  content: string;
  resolved: boolean;
  childNodes: string[];
  parentNode: string | null;
  pomodoroCount: number;
  createdAt: string;
  updatedAt: string;
}
