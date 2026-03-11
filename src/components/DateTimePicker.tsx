import { useState } from "react";
import { MONTHS_RU, WEEKDAYS_RU } from "../constants";
import { PS } from "../styles";
import {
  parseDatetime,
  buildDatetime,
  getDaysInMonth,
  getFirstDayOfWeek,
} from "../utils";
import type { ParsedDatetime } from "../utils";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseDatetime(value);
  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  const displayText = new Date(value).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const update = (fields: Partial<ParsedDatetime>) => {
    const next = { ...parsed, ...fields };
    const maxDay = getDaysInMonth(next.year, next.month);
    if (next.day > maxDay) next.day = maxDay;
    onChange(buildDatetime(next));
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d: number) =>
    d === parsed.day && viewMonth === parsed.month && viewYear === parsed.year;

  const isToday = (d: number) => {
    const t = new Date();
    return d === t.getDate() && viewMonth === t.getMonth() && viewYear === t.getFullYear();
  };

  const setNow = () => {
    const n = new Date();
    const nd: ParsedDatetime = {
      year: n.getFullYear(),
      month: n.getMonth(),
      day: n.getDate(),
      hour: n.getHours(),
      minute: n.getMinutes(),
    };
    onChange(buildDatetime(nd));
    setViewYear(nd.year);
    setViewMonth(nd.month);
  };

  return (
    <div>
      <button onClick={() => setOpen(!open)} style={PS.trigger}>
        {displayText}
        <span style={{ marginLeft: 8, fontSize: 12, color: "#666" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div style={PS.panel}>
          <div style={PS.calHeader}>
            <button onClick={prevMonth} style={PS.navBtn}>
              ‹
            </button>
            <span style={PS.monthLabel}>
              {MONTHS_RU[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} style={PS.navBtn}>
              ›
            </button>
          </div>
          <div style={PS.weekRow}>
            {WEEKDAYS_RU.map((w) => (
              <span key={w} style={PS.weekDay}>
                {w}
              </span>
            ))}
          </div>
          <div style={PS.dayGrid}>
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  onClick={() => update({ year: viewYear, month: viewMonth, day: d })}
                  style={{
                    ...PS.dayBtn,
                    ...(isSelected(d) ? PS.daySelected : {}),
                    ...(isToday(d) && !isSelected(d) ? PS.dayToday : {}),
                  }}
                >
                  {d}
                </button>
              ) : (
                <span key={i} style={PS.dayEmpty} />
              ),
            )}
          </div>
          <div style={PS.timeRow}>
            <button onClick={setNow} style={PS.nowBtn}>
              Сейчас
            </button>
            <div style={PS.timePickerGroup}>
              <button
                onClick={() => update({ hour: (parsed.hour + 23) % 24 })}
                style={PS.timeArrow}
              >
                ▲
              </button>
              <span style={PS.timeValue}>
                {String(parsed.hour).padStart(2, "0")}
              </span>
              <button
                onClick={() => update({ hour: (parsed.hour + 1) % 24 })}
                style={PS.timeArrow}
              >
                ▼
              </button>
            </div>
            <span style={PS.timeColon}>:</span>
            <div style={PS.timePickerGroup}>
              <button
                onClick={() => update({ minute: (parsed.minute + 55) % 60 })}
                style={PS.timeArrow}
              >
                ▲
              </button>
              <span style={PS.timeValue}>
                {String(parsed.minute).padStart(2, "0")}
              </span>
              <button
                onClick={() => update({ minute: (parsed.minute + 5) % 60 })}
                style={PS.timeArrow}
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
