import { useRegisterSW } from "virtual:pwa-register/react";
import { S } from "../styles";

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div style={S.updateBar}>
      <span>Доступно обновление</span>
      <button
        style={S.updateBtn}
        onClick={() => updateServiceWorker(true)}
      >
        Обновить
      </button>
    </div>
  );
}
