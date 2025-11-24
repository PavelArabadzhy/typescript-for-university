# Практична робота №3
Гілка: feature/schedule-system

У рамках третьої практичної роботи було реалізовано систему управління розкладом університету на TypeScript.

## Виконана функціональність

### 1. Визначення type alias та union types
- `DayOfWeek` — дні тижня
- `TimeSlot` — часові слоти занять
- `CourseType` — типи занять
- Базові структури: `Professor`, `Classroom`, `Course`, `Lesson`, `ScheduleConflict`

### 2. Робота з масивами даних
Створено масиви:
- `professors: Professor[]`
- `classrooms: Classroom[]`
- `courses: Course[]`
- `schedule: Lesson[]`

### 3. Функціонал роботи з даними
Реалізовано функції:
- `addProfessor(professor)` — додавання професора
- `addLesson(lesson)` — додавання заняття з перевіркою конфліктів
- `validateLesson(lesson)` — повертає конфлікт або null
- `findAvailableClassrooms(timeSlot, dayOfWeek)` — пошук вільних аудиторій
- `getProfessorSchedule(professorId)` — розклад конкретного викладача
- `getClassroomUtilization(classroomNumber)` — відсоток використання аудиторії
- `getMostPopularCourseType()` — найпопулярніший тип занять
- `reassignClassroom(lessonId, newClassroomNumber)` — зміна аудиторії
- `cancelLesson(lessonId)` — видалення заняття

### 4. Компіляція та структура
- Увесь код розташований у `src/schedule.ts`
- Компілюється у `dist/schedule.js` за допомогою `tsc`
- Налаштовано `tsconfig.json` та `package.json`

## Результат
Система повністю працює, всі функції реалізовані згідно з вимогами завдання.  
Код типізований, використовуються union types, type aliases, масиви та базова обробка помилок.