"use client";
import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useData } from "../../../lib/DataContext";
import { Card, Btn, Input } from "../../../components/ui";

export default function SettingsPage() {
  const data = useData();
  const [newCat, setNewCat] = useState("");
  const [office, setOffice] = useState(data.settings.office_info);

  const addCat = async () => {
    if (!newCat.trim()) return;
    await data.updateSettings({ expense_categories: [...data.settings.expense_categories, newCat.trim()] });
    setNewCat("");
  };
  const removeCat = (c) => data.updateSettings({ expense_categories: data.settings.expense_categories.filter((x) => x !== c) });
  const saveOffice = () => data.updateSettings({ office_info: office });

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
          <Btn className="self-start" onClick={saveOffice}>حفظ</Btn>
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
