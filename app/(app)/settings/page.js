"use client";
import { useState } from "react";
import { Plus, X, Trash2, Upload } from "lucide-react";
import { useData } from "../../../lib/DataContext";
import { Card, Btn, Input } from "../../../components/ui";

const MAX_LOGO_BYTES = 400 * 1024; // 400KB — بتتخزن كنص داخل قاعدة البيانات، فلازم تفضل خفيفة

export default function SettingsPage() {
  const data = useData();
  const [newCat, setNewCat] = useState("");
  const [office, setOffice] = useState(data.settings.office_info);
  const [logoErr, setLogoErr] = useState("");

  const addCat = async () => {
    if (!newCat.trim()) return;
    await data.updateSettings({ expense_categories: [...data.settings.expense_categories, newCat.trim()] });
    setNewCat("");
  };
  const removeCat = (c) => data.updateSettings({ expense_categories: data.settings.expense_categories.filter((x) => x !== c) });
  const saveOffice = () => data.updateSettings({ office_info: office });

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoErr("");
    if (file.size > MAX_LOGO_BYTES) { setLogoErr("حجم الصورة كبير جدًا — الحد الأقصى 400KB. جرب صورة أصغر."); return; }
    const dataUrl = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
    const next = { ...office, logo: dataUrl };
    setOffice(next);
    await data.updateSettings({ office_info: next });
  };

  const removeLogo = async () => {
    const next = { ...office, logo: "" };
    setOffice(next);
    await data.updateSettings({ office_info: next });
  };

  const clearLog = async () => {
    if (!confirm("هل أنت متأكد من مسح سجل النشاط بالكامل؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    await data.clearActivityLog();
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">الإعدادات</h2>

      <Card className="p-4">
        <h3 className="font-bold mb-3 text-slate-800 dark:text-slate-100">بيانات المكتب</h3>
        <div className="flex flex-col gap-3">
          <Input label="اسم المكتب" value={office.name || ""} onChange={(e) => setOffice({ ...office, name: e.target.value })} />
          <Input label="التليفون" value={office.phone || ""} onChange={(e) => setOffice({ ...office, phone: e.target.value })} />
          <Input label="العنوان" value={office.address || ""} onChange={(e) => setOffice({ ...office, address: e.target.value })} />

          <div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1.5">شعار المكتب</span>
            <div className="flex items-center gap-3">
              {office.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={office.logo} alt="الشعار" className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200 dark:border-slate-600 p-1" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">بدون</div>
              )}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"><Upload size={14} /> رفع شعار</span>
              </label>
              {office.logo && <button onClick={removeLogo} className="text-xs text-rose-500 hover:underline">إزالة</button>}
            </div>
            {logoErr && <p className="text-xs text-rose-500 mt-1">{logoErr}</p>}
            <p className="text-xs text-slate-400 mt-1">هيظهر تلقائيًا في صفحة تسجيل الدخول. صيغة صورة عادية (PNG/JPG)، حد أقصى 400KB.</p>
          </div>

          <Btn className="self-start" onClick={saveOffice}>حفظ بيانات المكتب</Btn>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold mb-3 text-slate-800 dark:text-slate-100">تصنيفات المصروفات</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.settings.expense_categories.map((c) => (
            <span key={c} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-sm">{c}<button onClick={() => removeCat(c)}><X size={13} /></button></span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="تصنيف جديد" className="flex-1" />
          <Btn onClick={addCat}><Plus size={15} /> إضافة</Btn>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">سجل النشاط (آخر العمليات)</h3>
          <Btn variant="danger" onClick={clearLog}><Trash2 size={14} /> امسح السجل</Btn>
        </div>
        <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
          {data.activityLog.slice(0, 50).map((a) => (
            <div key={a.id} className="text-xs border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
              <span className="font-semibold">{a.actor}</span> — {a.action} {a.entity} <span className="text-slate-400">({a.details})</span>
              <span className="text-slate-400 block">{new Date(a.timestamp).toLocaleString("ar-EG")}</span>
            </div>
          ))}
          {data.activityLog.length === 0 && <p className="text-slate-400 text-sm">لا يوجد نشاط مسجل بعد</p>}
        </div>
      </Card>
    </div>
  );
}
