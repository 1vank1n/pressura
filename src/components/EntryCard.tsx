import { PAIN_LEVELS } from "../constants";
import { S } from "../styles";
import { formatDate } from "../utils";
import type { Entry } from "../types";

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: number) => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  return (
    <div style={S.entry}>
      <div style={S.entryHeader}>
        <span style={S.entryDate}>{formatDate(entry.datetime)}</span>
        <span style={entry.type === "headache" ? S.badge : S.badgeBlue}>
          {entry.type === "headache" ? "🤕" : "💓"}
        </span>
        <button
          onClick={() => {
            if (window.confirm("Удалить эту запись?")) {
              onDelete(entry.id);
            }
          }}
          style={S.delBtn}
        >
          ✕
        </button>
      </div>
      {entry.type === "headache" ? (
        <div>
          <div style={S.entryRow}>
            <span
              style={{
                ...S.painDot,
                background: PAIN_LEVELS[entry.pain - 1]?.color,
              }}
            >
              {entry.pain}/10
            </span>
            {entry.locations.length > 0 && (
              <span style={S.entryDetail}>{entry.locations.join(", ")}</span>
            )}
          </div>
          {entry.triggers.length > 0 && (
            <p style={S.entryTriggers}>Триггеры: {entry.triggers.join(", ")}</p>
          )}
        </div>
      ) : (
        <div style={S.entryRow}>
          <span style={S.bpValue}>
            {entry.sys}/{entry.dia}
          </span>
          {entry.pulse && <span style={S.pulseValue}>♡ {entry.pulse}</span>}
        </div>
      )}
      {entry.note && <p style={S.entryNote}>💬 {entry.note}</p>}
    </div>
  );
}
