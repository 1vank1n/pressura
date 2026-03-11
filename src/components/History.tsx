import { useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { MONTHS_RU } from "../constants";
import { S } from "../styles";
import { now } from "../utils";
import type { Entry, FilterType } from "../types";
import EntryCard from "./EntryCard";

interface MonthGroup {
  label: string;
  entries: Entry[];
}

interface HistoryProps {
  entries: Entry[];
  onDelete: (id: number) => void;
  onImport: (imported: Entry[]) => void;
  onReset: () => void;
}

function groupByMonth(entries: Entry[]): Map<string, MonthGroup> {
  return entries.reduce((acc, e) => {
    const d = new Date(e.datetime);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!acc.has(key)) {
      acc.set(key, {
        label: `${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`,
        entries: [],
      });
    }
    acc.get(key)!.entries.push(e);
    return acc;
  }, new Map<string, MonthGroup>());
}

export default function History({ entries, onDelete, onImport, onReset }: HistoryProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(() => {
    const d = new Date();
    return new Set([`${d.getFullYear()}-${d.getMonth()}`]);
  });

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredEntries = filter === "all" ? entries : entries.filter((e) => e.type === filter);
  const groupedEntries = groupByMonth(filteredEntries);

  const handleExport = () => {
    const rows = entries.map((e) => ({
      Дата: new Date(e.datetime).toLocaleString("ru-RU"),
      Тип: e.type === "headache" ? "Головная боль" : "Давление",
      "Боль (1-10)": e.type === "headache" ? e.pain : "",
      Локализация: e.type === "headache" ? e.locations.join(", ") : "",
      Триггеры: e.type === "headache" ? e.triggers.join(", ") : "",
      "Систолич.": e.type === "bp" ? e.sys : "",
      "Диастолич.": e.type === "bp" ? e.dia : "",
      Пульс: e.type === "bp" ? (e.pulse ?? "") : "",
      Заметка: e.note || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 18 },
      { wch: 16 },
      { wch: 10 },
      { wch: 20 },
      { wch: 24 },
      { wch: 10 },
      { wch: 10 },
      { wch: 8 },
      { wch: 30 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Дневник");
    XLSX.writeFile(wb, "health-diary.xlsx");
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) return;
      const sheet = wb.Sheets[sheetName];
      if (!sheet) return;
      const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet);
      const imported: Entry[] = rows.map((r, i) => {
        const isHeadache = r["Тип"] === "Головная боль";
        const dateStr = r["Дата"]
          ? new Date(
              String(r["Дата"]).replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1"),
            )
              .toISOString()
              .slice(0, 16)
          : now();

        if (isHeadache) {
          return {
            id: Date.now() + i,
            type: "headache" as const,
            datetime: dateStr,
            pain: Number(r["Боль (1-10)"]) || 5,
            locations: r["Локализация"]
              ? String(r["Локализация"]).split(", ").filter(Boolean)
              : [],
            triggers: r["Триггеры"]
              ? String(r["Триггеры"]).split(", ").filter(Boolean)
              : [],
            note: String(r["Заметка"] ?? ""),
          };
        }
        return {
          id: Date.now() + i,
          type: "bp" as const,
          datetime: dateStr,
          sys: Number(r["Систолич."]) || 0,
          dia: Number(r["Диастолич."]) || 0,
          pulse: r["Пульс"] ? Number(r["Пульс"]) : null,
          note: String(r["Заметка"] ?? ""),
        };
      });
      onImport(imported);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const filters: [FilterType, string][] = [
    ["all", "Все"],
    ["headache", "🤕 Боль"],
    ["bp", "💓 Давление"],
  ];

  return (
    <div style={S.card}>
      {entries.length === 0 ? (
        <p style={S.empty}>Пока нет записей. Добавьте первую!</p>
      ) : (
        <>
          <div style={S.filterRow}>
            {filters.map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                style={filter === val ? S.filterActive : S.filterBtn}
              >
                {label}
              </button>
            ))}
          </div>
          {[...groupedEntries.entries()].map(([key, group]) => {
            const isOpen = expandedMonths.has(key);
            return (
              <div key={key} style={S.monthGroup}>
                <button onClick={() => toggleMonth(key)} style={S.monthHeader}>
                  <span>{group.label}</span>
                  <span style={S.monthMeta}>
                    <span style={S.monthCount}>{group.entries.length}</span>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </span>
                </button>
                {isOpen &&
                  group.entries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} onDelete={onDelete} />
                  ))}
              </div>
            );
          })}
          {filteredEntries.length === 0 && (
            <p style={S.empty}>Нет записей с таким фильтром</p>
          )}
          <button onClick={handleExport} style={S.exportBtn}>
            📥 Скачать Excel (.xlsx)
          </button>
          <button onClick={onReset} style={S.resetBtn}>
            Очистить всё
          </button>
        </>
      )}
      <label style={{ ...S.importBtn, marginTop: entries.length === 0 ? 0 : 8 }}>
        📤 Загрузить из Excel (.xlsx)
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImport}
          style={{ display: "none" }}
        />
      </label>
      <p style={S.storageNote}>
        Данные хранятся локально в браузере, не на сервере. Используйте экспорт/импорт
        Excel, чтобы не потерять записи при очистке браузера или смене устройства.
      </p>
    </div>
  );
}
