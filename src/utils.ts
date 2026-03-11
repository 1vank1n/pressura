import { STORAGE_KEY } from "./constants";
import type { Entry } from "./types";

const pad = (n: number): string => String(n).padStart(2, "0");

export function now(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface ParsedDatetime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export function parseDatetime(dt: string): ParsedDatetime {
  const [datePart = "", timePart = "00:00"] = dt.split("T");
  const parts = datePart.split("-").map(Number);
  const timeParts = timePart.split(":").map(Number);
  return {
    year: parts[0] ?? 2000,
    month: (parts[1] ?? 1) - 1,
    day: parts[2] ?? 1,
    hour: timeParts[0] ?? 0,
    minute: timeParts[1] ?? 0,
  };
}

export function buildDatetime({ year, month, day, hour, minute }: ParsedDatetime): string {
  return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

export function saveEntries(data: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
