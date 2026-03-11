import { useState, useEffect } from "react";
import { S } from "./styles";
import { loadEntries, saveEntries } from "./utils";
import type { Entry, TabType } from "./types";
import EntryForm from "./components/EntryForm";
import History from "./components/History";
import UpdatePrompt from "./components/UpdatePrompt";

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries());
  const [tab, setTab] = useState<TabType>("add");

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleAddEntry = (entry: Entry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const handleDelete = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleImport = (imported: Entry[]) => {
    setEntries((prev) => [...imported, ...prev]);
  };

  const handleReset = () => {
    if (confirm("Удалить все записи?")) setEntries([]);
  };

  return (
    <div style={S.root}>
      <header style={S.header}>
        <h1 style={S.title}>🩺 Дневник здоровья</h1>
        <p style={S.subtitle}>Головная боль & давление</p>
      </header>

      <div style={S.tabs}>
        <button
          style={tab === "add" ? S.tabActive : S.tab}
          onClick={() => setTab("add")}
        >
          ＋ Запись
        </button>
        <button
          style={tab === "history" ? S.tabActive : S.tab}
          onClick={() => setTab("history")}
        >
          📋 История ({entries.length})
        </button>
      </div>

      {tab === "add" && <EntryForm onSave={handleAddEntry} />}

      {tab === "history" && (
        <History
          entries={entries}
          onDelete={handleDelete}
          onImport={handleImport}
          onReset={handleReset}
        />
      )}
      <UpdatePrompt />
    </div>
  );
}
