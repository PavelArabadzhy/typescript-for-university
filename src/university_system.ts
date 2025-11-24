// --------------------------
// 1) ENUM-и
// --------------------------

export enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

export enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
}

export enum Semester {
    First = "First",
    Second = "Second",
}

export enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

export enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
}

// --------------------------
// 2) Інтерфейси
// --------------------------

/**
 * Студент
 */
export interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

/**
 * Курс
 */
export interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

/**
 * Запис оцінки (interface названо Grade, як в ТЗ;
 * поле grade має тип enum GradeValue)
 */
export interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeValue;
    date: Date;
    semester: Semester;
}

// --------------------------
// 3) Тип для реєстрації
// --------------------------

type Registration = {
    studentId: number;
    courseId: number;
    registeredAt: Date;
};

// --------------------------
// 4) UniversityManagementSystem
// --------------------------

/**
 * Клас, що містить базову логіку управління студентами, курсами, реєстраціями та оцінками.
 * Усі масиви всередині приватні; доступ через методи.
 */
export class UniversityManagementSystem {
    // Приватні сховища
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private registrations: Registration[] = [];

    // генератори id
    private nextStudentId = 1;
    private nextCourseId = 1;

    // --------------------------
    // enrollStudent
    // --------------------------
    /**
     * Регіструє нового студента (генерує id) та повертає повний об'єкт Student.
     * Перевірки: коректність полів (повне ім'я, faculty, year тощо).
     */
    public enrollStudent(student: Omit<Student, "id">): Student {
        // прості валідації
        if (!student.fullName || student.fullName.trim().length === 0) {
            throw new Error("fullName is required");
        }
        if (!Object.values(Faculty).includes(student.faculty)) {
            throw new Error("Invalid faculty");
        }
        if (typeof student.year !== "number" || student.year <= 0) {
            throw new Error("Invalid year");
        }

        const newStudent: Student = {
            ...student,
            id: this.nextStudentId++,
        };

        this.students.push(newStudent);
        console.log(`Enrolled student: ${newStudent.fullName} (ID=${newStudent.id})`);
        return newStudent;
    }

    // --------------------------
    // addCourse (вспомогательный метод)
    // --------------------------
    /**
     * Додає курс в систему (додатковий утилітний метод для наповнення даних).
     */
    public addCourse(courseInfo: Omit<Course, "id">): Course {
        if (!courseInfo.name || courseInfo.name.trim().length === 0) {
            throw new Error("Course name required");
        }
        if (!Object.values(CourseType).includes(courseInfo.type)) {
            throw new Error("Invalid course type");
        }
        if (!Object.values(Semester).includes(courseInfo.semester)) {
            throw new Error("Invalid semester");
        }
        if (!Object.values(Faculty).includes(courseInfo.faculty)) {
            throw new Error("Invalid faculty");
        }
        if (typeof courseInfo.maxStudents !== "number" || courseInfo.maxStudents <= 0) {
            throw new Error("maxStudents must be positive");
        }

        const newCourse: Course = { ...courseInfo, id: this.nextCourseId++ };
        this.courses.push(newCourse);
        console.log(`Added course: "${newCourse.name}" (ID=${newCourse.id})`);
        return newCourse;
    }

    // --------------------------
    // registerForCourse
    // --------------------------
    /**
     * Реєструє студента на курс:
     * Перевіряє наявність студента та курсу, статус студента (Active),
     * відповідність факультету для обов'язкових курсів,
     * наявність місць, відсутність дублюючої реєстрації.
     */
    public registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            console.error(`registerForCourse: student ${studentId} not found`);
            return;
        }
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) {
            console.error(`registerForCourse: course ${courseId} not found`);
            return;
        }

        // дозволяємо реєструвати лише активних студентів
        if (student.status !== StudentStatus.Active) {
            console.error(`registerForCourse: student ${studentId} status is not Active (${student.status})`);
            return;
        }

        // перевірка факультету для обов'язкового курсу
        if (course.type === CourseType.Mandatory && student.faculty !== course.faculty) {
            console.warn(
                `Warning: student ${student.fullName} (faculty ${student.faculty}) registering to mandatory course of faculty ${course.faculty}`,
            );
            // попередження, але не заборона
        }

        // кількість зареєстрованих
        const currentCount = this.registrations.filter((r) => r.courseId === courseId).length;
        if (currentCount >= course.maxStudents) {
            console.error(`registerForCourse: course ${course.name} is full`);
            return;
        }

        // вже зареєстрований?
        const already = this.registrations.some((r) => r.studentId === studentId && r.courseId === courseId);
        if (already) {
            console.error(`registerForCourse: student ${studentId} already registered for course ${courseId}`);
            return;
        }

        // додати реєстрацію
        this.registrations.push({ studentId, courseId, registeredAt: new Date() });
        console.log(`registerForCourse: student ${student.fullName} registered to ${course.name}`);
    }

    // --------------------------
    // setGrade
    // --------------------------
    /**
     * Встановлює оцінку для студента по курсу.
     * Перевіряє, чи студент зареєстрований на курс; якщо ні — забороняє.
     */
    public setGrade(studentId: number, courseId: number, gradeValue: GradeValue): void {
        // чи існує реєстрація?
        const reg = this.registrations.find((r) => r.studentId === studentId && r.courseId === courseId);
        if (!reg) {
            console.error(`setGrade: student ${studentId} is not registered for course ${courseId}`);
            return;
        }

        const course = this.courses.find((c) => c.id === courseId);
        if (!course) {
            console.error(`setGrade: course ${courseId} not found`);
            return;
        }

        // створюємо запис оцінки
        const gradeRecord: Grade = {
            studentId,
            courseId,
            grade: gradeValue,
            date: new Date(),
            semester: course.semester,
        };

        this.grades.push(gradeRecord);
        console.log(
            `setGrade: student ${studentId} received ${GradeValue[gradeValue]} (${gradeValue}) for course ${course.name}`,
        );
    }

    // --------------------------
    // updateStudentStatus
    // --------------------------
    /**
     * Оновлює статус студента з базовою валідацією:
     *   - не дозволяє змінити статус Graduated на щось інше
     *   - дозволяє поновлення Expelled -> Active (з логом)
     *   - інші переходи дозволені
     */
    public updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            console.error(`updateStudentStatus: student ${studentId} not found`);
            return;
        }

        // не дозволяємо змінювати статус випускника
        if (student.status === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
            console.error("updateStudentStatus: cannot change status of a graduated student");
            return;
        }

        // приклад: поновлення відрахованого
        if (student.status === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
            console.log(`updateStudentStatus: reinstating expelled student ${student.fullName}`);
        }

        student.status = newStatus;
        console.log(`updateStudentStatus: student ${student.fullName} status set to ${newStatus}`);
    }

    // --------------------------
    // getStudentsByFaculty
    // --------------------------
    /**
     * Повертає список студентів певного факультету.
     */
    public getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((s) => s.faculty === faculty);
    }

    // --------------------------
    // getStudentGrades
    // --------------------------
    /**
     * Повертає записи оцінок для конкретного студента.
     */
    public getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter((g) => g.studentId === studentId);
    }

    // --------------------------
    // getAvailableCourses
    // --------------------------
    /**
     * Повертає курси для певного факультету та семестру.
     */
    public getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter((c) => c.faculty === faculty && c.semester === semester);
    }

    // --------------------------
    // calculateAverageGrade
    // --------------------------
    /**
     * Обчислює середній бал студента по всім виставленим оцінкам (в межах поточної системи оцінювання).
     * Якщо оцінок немає — повертає 0.
     * Результат має 2 знаки після коми.
     */
    public calculateAverageGrade(studentId: number): number {
        const grades = this.getStudentGrades(studentId);
        if (grades.length === 0) return 0;
        const sum = grades.reduce((acc, g) => acc + g.grade, 0);
        const avg = sum / grades.length;
        return Math.round(avg * 100) / 100;
    }

    // --------------------------
    // getExcellentStudentsByFaculty
    // --------------------------
    /**
     * Повертає студентів з середнім балом >= 4.5 і статусом Active для заданого факультету.
     */
    public getExcellentStudentsByFaculty(faculty: Faculty): Student[] {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        return facultyStudents.filter((s) => {
            if (s.status !== StudentStatus.Active) return false;
            const avg = this.calculateAverageGrade(s.id);
            return avg >= 4.5;
        });
    }

    // --------------------------
    // Допоміжні методи
    // --------------------------
    /**
     * Повертає студентів (всі)
     */
    public listStudents(): Student[] {
        return [...this.students];
    }

    /**
     * Повертає курси (всі)
     */
    public listCourses(): Course[] {
        return [...this.courses];
    }

    /**
     * Повертає реєстрації
     */
    public listRegistrations(): Registration[] {
        return [...this.registrations];
    }

    /**
     * Повертає оцінки
     */
    public listGrades(): Grade[] {
        return [...this.grades];
    }
}

// --------------------------
// 5) Тестові виклики / Демонстрація
// --------------------------

console.log("=== START UniversityManagementSystem DEMO ===");

const ums = new UniversityManagementSystem();

// Додаємо курси
const csIntro = ums.addCourse({
    name: "Intro to Computer Science",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30,
});

const calculus = ums.addCourse({
    name: "Calculus I",
    type: CourseType.Mandatory,
    credits: 6,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 40,
});

const econHistory = ums.addCourse({
    name: "History of Economics",
    type: CourseType.Optional,
    credits: 3,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 20,
});

console.log("\n--- Enroll students ---");
const st1 = ums.enrollStudent({
    fullName: "Олена Коваленко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS-1",
});

const st2 = ums.enrollStudent({
    fullName: "Петро Яценко",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2022-09-01"),
    groupNumber: "CS-2",
});

const st3 = ums.enrollStudent({
    fullName: "Марія Бондар",
    faculty: Faculty.Economics,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "ECO-1",
});

console.log("\n--- Register for courses ---");
ums.registerForCourse(st1.id, csIntro.id); // ok
ums.registerForCourse(st1.id, calculus.id); // ok
ums.registerForCourse(st2.id, csIntro.id); // ok
ums.registerForCourse(st1.id, econHistory.id); // warning allowed (different faculty but optional)
ums.registerForCourse(999, csIntro.id); // student not found

console.log("\n--- Set grades ---");
ums.setGrade(st1.id, csIntro.id, GradeValue.Excellent);
ums.setGrade(st1.id, calculus.id, GradeValue.Good);
ums.setGrade(st2.id, csIntro.id, GradeValue.Excellent);

// try to set grade for not-registered student
ums.setGrade(st3.id, csIntro.id, GradeValue.Satisfactory); // should be prevented

console.log("\n--- Status changes ---");
ums.updateStudentStatus(st3.id, StudentStatus.Academic_Leave);
ums.updateStudentStatus(st3.id, StudentStatus.Active); // allow reactivation

console.log("\n--- Reports / Analytics ---");
console.log("Students in Computer Science:", ums.getStudentsByFaculty(Faculty.Computer_Science).length);
console.log("Avg grade for", st1.fullName, ":", ums.calculateAverageGrade(st1.id));
console.log(
    "Available CS courses (First semester):",
    ums.getAvailableCourses(Faculty.Computer_Science, Semester.First).map((c) => c.name),
);

console.log("Excellent students (CS):", ums.getExcellentStudentsByFaculty(Faculty.Computer_Science).map((s) => s.fullName));

console.log("\n=== END DEMO ===");