const title: string = "Студент";
const year: number = 2025;
const isActive: boolean = true;

function getStatus(role: string, currentYear: number, active: boolean): string {
    const activity = active ? "активний" : "неактивний";
    return `${role} (${currentYear}): статус — ${activity}`;
}

console.log(getStatus(title, year, isActive));