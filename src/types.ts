export interface HeadacheEntry {
  id: number;
  type: "headache";
  datetime: string;
  pain: number;
  locations: string[];
  triggers: string[];
  note: string;
}

export interface BPEntry {
  id: number;
  type: "bp";
  datetime: string;
  sys: number;
  dia: number;
  pulse: number | null;
  note: string;
}

export type Entry = HeadacheEntry | BPEntry;

export type EntryType = "headache" | "bp";
export type FilterType = "all" | EntryType;
export type TabType = "add" | "history";
