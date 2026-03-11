import { useState } from "react";
import { PAIN_LEVELS, LOCATIONS, TRIGGERS } from "../constants";
import { S } from "../styles";
import { now } from "../utils";
import type { Entry, EntryType } from "../types";
import DateTimePicker from "./DateTimePicker";

interface EntryFormProps {
  onSave: (entry: Entry) => void;
}

export default function EntryForm({ onSave }: EntryFormProps) {
  const [mode, setMode] = useState<EntryType>("headache");
  const [datetime, setDatetime] = useState(now());
  const [pain, setPain] = useState(5);
  const [locations, setLocations] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [pulse, setPulse] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleChip = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    val: string,
  ) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleSave = () => {
    const base = { id: Date.now(), datetime, note };
    const entry: Entry =
      mode === "headache"
        ? { ...base, type: "headache", pain, locations, triggers }
        : { ...base, type: "bp", sys: +sys, dia: +dia, pulse: pulse ? +pulse : null };

    onSave(entry);
    setDatetime(now());
    setPain(5);
    setLocations([]);
    setTriggers([]);
    setSys("");
    setDia("");
    setPulse("");
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div style={S.card}>
      <div style={S.modeRow}>
        <button
          style={mode === "headache" ? S.modeBtnActive : S.modeBtn}
          onClick={() => setMode("headache")}
        >
          🤕 Головная боль
        </button>
        <button
          style={mode === "bp" ? S.modeBtnActiveBlue : S.modeBtn}
          onClick={() => setMode("bp")}
        >
          💓 Давление
        </button>
      </div>

      <label style={S.label}>Дата и время</label>
      <DateTimePicker value={datetime} onChange={setDatetime} />

      {mode === "headache" ? (
        <>
          <label style={S.label}>Интенсивность боли</label>
          <div style={S.painRow}>
            {PAIN_LEVELS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPain(p.value)}
                style={{
                  ...S.painBtn,
                  background: pain === p.value ? p.color : "#2a2a3a",
                  color: pain === p.value ? "#000" : "#888",
                  fontWeight: pain === p.value ? 800 : 500,
                }}
              >
                {p.value}
              </button>
            ))}
          </div>

          <label style={S.label}>Локализация</label>
          <div style={S.chipRow}>
            {LOCATIONS.map((l) => (
              <button
                key={l}
                onClick={() => toggleChip(locations, setLocations, l)}
                style={locations.includes(l) ? S.chipActive : S.chip}
              >
                {l}
              </button>
            ))}
          </div>

          <label style={S.label}>Возможные триггеры</label>
          <div style={S.chipRow}>
            {TRIGGERS.map((t) => (
              <button
                key={t}
                onClick={() => toggleChip(triggers, setTriggers, t)}
                style={triggers.includes(t) ? S.chipActiveOrange : S.chip}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={S.bpRow}>
          <div style={S.bpField}>
            <label style={S.label}>Систолич.</label>
            <input
              type="number"
              placeholder="120"
              value={sys}
              onChange={(e) => setSys(e.target.value)}
              style={S.inputNum}
            />
          </div>
          <span style={S.bpSlash}>/</span>
          <div style={S.bpField}>
            <label style={S.label}>Диастолич.</label>
            <input
              type="number"
              placeholder="80"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              style={S.inputNum}
            />
          </div>
          <div style={S.bpField}>
            <label style={S.label}>Пульс</label>
            <input
              type="number"
              placeholder="72"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              style={S.inputNum}
            />
          </div>
        </div>
      )}

      <label style={S.label}>Заметка (необязательно)</label>
      <input
        type="text"
        placeholder="Лекарство, самочувствие..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={S.input}
      />

      <button onClick={handleSave} style={saved ? S.saveBtnDone : S.saveBtn}>
        {saved ? "✓ Сохранено!" : "Сохранить запись"}
      </button>
    </div>
  );
}
