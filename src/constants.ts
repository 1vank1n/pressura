export const STORAGE_KEY = "health-diary-entries";

export const PAIN_LEVELS = [
  { value: 1, color: "#a3d977" },
  { value: 2, color: "#d4e157" },
  { value: 3, color: "#ffee58" },
  { value: 4, color: "#ffca28" },
  { value: 5, color: "#ffa726" },
  { value: 6, color: "#ff7043" },
  { value: 7, color: "#ef5350" },
  { value: 8, color: "#e53935" },
  { value: 9, color: "#c62828" },
  { value: 10, color: "#b71c1c" },
] as const;

export const LOCATIONS = [
  "Лоб",
  "Виски",
  "Затылок",
  "Макушка",
  "Левая сторона",
  "Правая сторона",
  "Шея",
  "Вся голова",
] as const;

export const TRIGGERS = [
  "Стресс",
  "Недосып",
  "Погода",
  "Еда",
  "Экран",
  "Шея",
  "Кофе",
  "Алкоголь",
  "Нагрузка",
] as const;

export const MONTHS_RU = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

export const WEEKDAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
