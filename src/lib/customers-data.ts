export type CustomerType = "B2B" | "B2C";
export type CustomerStatus = "Active" | "Inactive" | "VIP" | "Blocked";

export interface Customer {
  id: string;
  name: string;
  company?: string;
  type: CustomerType;
  status: CustomerStatus;
  email: string;
  phone: string;
  city: string;
  country: string;
  address: string;
  taxId?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  createdAt: string;
  notes?: string;
  avatarColor: string;
}

const firstNames = ["Ahmed", "Sara", "Imran", "Nadia", "Bilal", "Hina", "Usman", "Ayesha", "Zain", "Maria", "Fahad", "Rabia"];
const lastNames = ["Khan", "Ahmed", "Raza", "Malik", "Hussain", "Sheikh", "Iqbal", "Tariq", "Aslam", "Javed"];
const companies = ["Tech Hub LLC", "PixelPoint Ltd", "Nova Systems", "ByteForge Co", "Cygnus Trading", "Orbit Resellers", "Apex IT Sol", "Lumen Mart"];
const cities = ["Karachi", "Lahore", "Islamabad", "Dubai", "Riyadh", "Doha", "Muscat", "Manama"];
const countries = ["Pakistan", "UAE", "KSA", "Qatar", "Oman", "Bahrain"];
const colors = ["from-primary to-accent", "from-accent to-info", "from-info to-success", "from-warning to-primary", "from-success to-primary"];

const r = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

export function seedCustomers(n = 32): Customer[] {
  return Array.from({ length: n }, () => {
    const type: CustomerType = Math.random() > 0.5 ? "B2B" : "B2C";
    const first = r(firstNames);
    const last = r(lastNames);
    const orders = ri(1, 40);
    return {
      id: crypto.randomUUID(),
      name: type === "B2B" ? r(companies) : `${first} ${last}`,
      company: type === "B2B" ? r(companies) : undefined,
      type,
      status: r<CustomerStatus>(["Active", "Active", "Active", "VIP", "Inactive", "Blocked"]),
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${type === "B2B" ? "company" : "mail"}.com`,
      phone: `+92 3${ri(10, 99)} ${ri(1000000, 9999999)}`,
      city: r(cities),
      country: r(countries),
      address: `${ri(1, 200)} ${r(["Main Blvd", "Business Bay", "Garden Town", "DHA Phase 5"])}`,
      taxId: type === "B2B" ? `NTN-${ri(1000000, 9999999)}` : undefined,
      totalOrders: orders,
      totalSpent: orders * ri(800, 3500),
      lastOrderAt: new Date(Date.now() - ri(0, 90) * 86400000).toISOString(),
      createdAt: new Date(Date.now() - ri(30, 720) * 86400000).toISOString(),
      avatarColor: r(colors),
    };
  }).sort((a, b) => +new Date(b.lastOrderAt) - +new Date(a.lastOrderAt));
}

export const customerSegments = [
  { name: "VIP", value: 18 },
  { name: "Active", value: 64 },
  { name: "Inactive", value: 12 },
  { name: "Blocked", value: 6 },
];

export const acquisitionTrend = [
  { month: "Jan", b2b: 8, b2c: 14 },
  { month: "Feb", b2b: 11, b2c: 19 },
  { month: "Mar", b2b: 9, b2c: 22 },
  { month: "Apr", b2b: 14, b2c: 28 },
  { month: "May", b2b: 17, b2c: 31 },
  { month: "Jun", b2b: 21, b2c: 35 },
];
