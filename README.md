# Практична робота №4 — Модульна структура (TypeScript)
Гілка: feature/modules

У папці `src/` знаходяться модулі та типи:
- `src/main.ts` — головний файл (імпортує модулі)
- `src/types/` — всі type aliases (DayOfWeek, TimeSlot, CourseType, Professor, Classroom, Course, Lesson, ScheduleConflict)
- `src/api/` — fetch-утиліти (posts)
- `src/ui/` — UI-утиліти (modal, dom)
- `src/schedule/` — логіка управління розкладом (professors, classrooms, timetable, courses)

Команди:
- `npm install` — встановити dev-залежності (TypeScript)
- `npm run build` — зібрати TS у `dist/`
- `npm run start` — запустити `dist/main.js` (node)