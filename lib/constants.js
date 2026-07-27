// قائمة المستخدمين الثمانية — تُستخدم فقط لعرض الأسماء في شاشة الدخول.
// كلمات المرور الفعلية مُدارة بالكامل داخل Supabase Auth (مشفّرة)، وليست هنا.
export const USERS = [
  { username: "mostafa", name: "أ/مصطفى حمزة", role: "مدير" },
  { username: "mohamed", name: "أ/ محمد رواج", role: "أدمن" },
  { username: "yomna", name: "أ/ يمنى الكفراوي", role: "محاسب" },
  { username: "manar", name: "أ/ منار يحيى", role: "محاسب" },
  { username: "nada", name: "أ/ ندى الزهار", role: "محاسب" },
  { username: "noran", name: "أ/ نوران نادر", role: "محاسب" },
  { username: "mariam", name: "أ/ مريم العربي", role: "محاسب" },
  { username: "trainee", name: "أ/ متدرب", role: "متدرب" },
];

export const DEFAULT_EXPENSE_CATEGORIES = ["إنترنت", "كهرباء", "أجور", "إيجار مكتب", "مستلزمات مكتبية", "صيانة", "ضيافة", "مواصلات", "أخرى"];
export const IMPORTANT_DATE_TYPES = ["انتهاء البطاقة الضريبية", "انتهاء اشتراك موقع الضرائب", "انتهاء التوكن", "لجان الطعن", "أخرى"];
export const TASK_PRIORITIES = ["عادي", "عاجل", "معلومة"];
export const MONTH_NAMES = ["يناير","فبراير","مارس","إبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

export const TABS_FULL = [
  { key: "dashboard", label: "لوحة التحكم", roles: ["مدير", "أدمن"] },
  { key: "clients", label: "العملاء", roles: ["مدير", "أدمن", "محاسب", "متدرب"] },
  { key: "invoices", label: "الفواتير", roles: ["مدير", "أدمن", "محاسب", "متدرب"] },
  { key: "expenses", label: "المصروفات", roles: ["مدير", "أدمن"] },
  { key: "reports", label: "التقارير", roles: ["مدير", "أدمن"] },
  { key: "declarations", label: "الإقرارات", roles: ["مدير", "أدمن", "محاسب", "متدرب"] },
  { key: "tasks", label: "المهام", roles: ["مدير", "أدمن", "محاسب", "متدرب"] },
  { key: "settings", label: "الإعدادات", roles: ["مدير", "أدمن"] },
];

// أول صفحة يتحول لها كل دور بعد تسجيل الدخول — المحاسب والمتدرب معندهمش صلاحية /dashboard
export const defaultRouteForRole = (role) => (role === "مدير" || role === "أدمن" ? "/dashboard" : "/clients");
