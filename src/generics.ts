// ----------------------
// Крок 1: Типи товарів
// ----------------------

/**
 * Базовий тип товару
 */
export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    // додаткові базові поля (необов'язкові)
    description?: string;
    inStock?: boolean;
};

/**
 * Тип для електроніки
 */
export type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    warrantyMonths?: number;
    powerW?: number;
};

/**
 * Тип для одягу
 */
export type Clothing = BaseProduct & {
    category: "clothing";
    size: "S" | "M" | "L" | "XL" | "XXL";
    material?: string;
    gender?: "male" | "female" | "unisex";
};

/**
 * Тип для книги
 */
export type Book = BaseProduct & {
    category: "books";
    author: string;
    pages?: number;
    publisher?: string;
};

// ----------------------
// Крок 2: Функції пошуку
// ----------------------

/**
 * Знаходить товар у масиві за id.
 * Повертає знайдений товар типу T або undefined.
 *
 * @param products - масив товарів типу T
 * @param id - ідентифікатор товару
 */
export const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    if (!Array.isArray(products)) {
        console.warn("findProduct: products має бути масивом.");
        return undefined;
    }
    if (typeof id !== "number" || Number.isNaN(id)) {
        console.warn("findProduct: некоректний id.");
        return undefined;
    }
    return products.find((p) => p.id === id);
};

/**
 * Фільтрує товари за максимальною ціною (<= maxPrice).
 *
 * @param products - масив товарів типу T
 * @param maxPrice - максимальна допустима ціна
 */
export const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    if (!Array.isArray(products)) {
        console.warn("filterByPrice: products має бути масивом.");
        return [];
    }
    if (typeof maxPrice !== "number" || Number.isNaN(maxPrice)) {
        console.warn("filterByPrice: maxPrice некоректний.");
        return [];
    }
    if (maxPrice < 0) {
        console.warn("filterByPrice: maxPrice менше 0 — повертаємо пустий масив.");
        return [];
    }
    return products.filter((p) => typeof p.price === "number" && p.price <= maxPrice);
};

// ----------------------
// Крок 3: Кошик
// ----------------------

/**
 * Тип елемента кошика
 */
export type CartItem<T extends BaseProduct> = {
    product: T;
    quantity: number;
};

/**
 * Додає товар у кошик.
 * Правила:
 *  - Якщо product === undefined або null — повертаємо cart без змін.
 *  - Якщо quantity <= 0 — нічого не додається.
 *  - Якщо товар вже в кошику (за id) — збільшуємо quantity.
 * Повертаємо новий масив (не мутуємо вхідний).
 *
 * @param cart - поточний кошик
 * @param product - товар для додавання
 * @param quantity - кількість для додавання
 */
export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T | undefined | null,
    quantity: number
): CartItem<T>[] => {
    if (!product) {
        console.warn("addToCart: продукт відсутній — нічого не додаємо.");
        return cart;
    }
    if (!Array.isArray(cart)) cart = [];
    if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity <= 0) {
        console.warn("addToCart: некоректна кількість — нічого не додаємо.");
        return cart;
    }

    const idx = cart.findIndex((item) => item.product.id === product.id);
    if (idx >= 0) {
        const newCart = cart.slice();
        newCart[idx] = { ...newCart[idx], quantity: newCart[idx].quantity + quantity };
        return newCart;
    } else {
        return [...cart, { product, quantity }];
    }
};

/**
 * Рахує загальну вартість кошика.
 * Повертає >= 0.
 *
 * @param cart - масив CartItem
 */
export const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.reduce((sum, item) => {
        const price = typeof item.product.price === "number" ? item.product.price : 0;
        const qty = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 0;
        return sum + price * qty;
    }, 0);
};

// ----------------------
// Крок 4: Тестові дані і демонстрація
// ----------------------

// Тестові дані — електроніка
const electronics: Electronics[] = [
    {
        id: 1,
        name: "Телефон Ultra",
        price: 12000,
        description: "Смартфон з камерою 108MP",
        inStock: true,
        category: "electronics",
        brand: "TechCo",
        warrantyMonths: 24,
    },
    {
        id: 2,
        name: "Портативні колонки",
        price: 2200,
        category: "electronics",
        brand: "SoundLabs",
        powerW: 10,
    },
];

// Тестові дані — одяг
const clothing: Clothing[] = [
    {
        id: 11,
        name: "Футболка базова",
        price: 450,
        category: "clothing",
        size: "M",
        material: "cotton",
    },
    {
        id: 12,
        name: "Спортивні штани",
        price: 900,
        category: "clothing",
        size: "L",
        material: "polyester",
    },
];

// Тестові дані — книги
const books: Book[] = [
    {
        id: 101,
        name: "TypeScript для початківців",
        price: 700,
        category: "books",
        author: "І. Автор",
        pages: 350,
    },
    {
        id: 102,
        name: "Патерни JavaScript",
        price: 650,
        category: "books",
        author: "П. Розробник",
    },
];

// DEMO: перевірка функцій
console.log("=== Практична 5: перевірка функцій ===");

// findProduct
const phone = findProduct<Electronics>(electronics, 1);
console.log("Знайдено телефон:", phone);

// find non-existing
const missing = findProduct<Electronics>(electronics, 999);
console.log("Невідомий товар (повинен бути undefined):", missing);

// filterByPrice
const cheapClothes = filterByPrice<Clothing>(clothing, 500);
console.log("Одяг до 500:", cheapClothes);

// addToCart + calculateTotal
let cart: CartItem<BaseProduct>[] = [];
cart = addToCart(cart, phone, 1); // phone може бути undefined, addToCart захищає
cart = addToCart(cart, clothing[0], 2);
cart = addToCart(cart, books[0], 1);
console.log("Кошик після додавань:", cart);

const total = calculateTotal(cart);
console.log("Загальна сума:", total);

// додавання ще одного такого самого товару (quantity має збільшитись)
cart = addToCart(cart, clothing[0], 1);
console.log("Кошик після додавання ще однієї футболки:", cart);
console.log("Загальна сума після оновлення:", calculateTotal(cart));

// обробка некоректних викликів
console.log("Спроба додати undefined товар:", addToCart(cart, undefined, 1));
console.log("Фільтрація з NaN (повинно повернути []):", filterByPrice<Book>(books, NaN));

console.log("Порожній кошик total:", calculateTotal([]));