export type ChargerCondition = "New" | "Used" | "Refurbished";
export interface Charger {
  id: string;
  name: string;
  brand: string;
  pinType: string;
  wattage: string;
  voltage: string;
  amperage: string;
  compatibility: string[];
  condition: ChargerCondition;
  original: boolean;
  stock: number;
  costPrice: number;
  salePrice: number;
  sku: string;
  imageUrl: string;
}

const r = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

const brands = ["Lenovo", "HP", "Dell", "Asus", "Apple", "Targus", "Anker"];
const images = [
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
  "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400",
  "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400",
];

export function seedChargers(n = 24): Charger[] {
  return Array.from({ length: n }, () => {
    const brand = r(brands);
    const cost = ri(15, 90);
    return {
      id: crypto.randomUUID(),
      name: `${brand} ${r(["Slim", "Pro", "Travel", "OEM", "Fast"])} Charger`,
      brand,
      pinType: r(["Type-C", "Lenovo Pin", "Dell Pin", "HP Pin", "MagSafe", "Universal"]),
      wattage: r(["45W", "65W", "90W", "120W", "180W", "240W"]),
      voltage: r(["19V", "20V", "19.5V"]),
      amperage: r(["2.37A", "3.25A", "4.62A", "9.23A"]),
      compatibility: Array.from(new Set(Array.from({ length: ri(1, 3) }, () => r(brands)))),
      condition: r<ChargerCondition>(["New", "Used", "Refurbished"]),
      original: Math.random() > 0.4,
      stock: ri(0, 40),
      costPrice: cost,
      salePrice: cost + ri(10, 50),
      sku: `CHG-${ri(1000, 9999)}`,
      imageUrl: r(images),
    };
  });
}
