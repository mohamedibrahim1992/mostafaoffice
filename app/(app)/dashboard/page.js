"use client";
import { useState, useMemo } from "react";
import { Users, FileText, Wallet, CheckCircle2, Clock, ClipboardCheck } from "lucide-react";
import { useData } from "../../../lib/DataContext";
import { Card } from "../../../components/ui";
import { fmtMoney, generateAllDeclarations } from "../../../lib/helpers";

export default function DashboardPage() {
  const data = useData();
  const [mode, setMode] = useState("month");
  const now = new Date();

  const inScope = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (mode === "month") return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    return d.getFullYear() === now.getFullYear();
  };

  const invoicesScope = data.invoices.filter((i) => inScope(i.date));
  const expensesScope = data.expenses.filter((e) => inScope(e.date));
  const totalInvoices = invoicesScope.reduce((s, i) => s + Number(i.amount || 0), 0);
  const collected = invoicesScope.filter((i) => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0);
  const pending = totalInvoices - collected;
  const totalExpenses = expensesScope.reduce((s, e) => s + Number(e.amount || 0), 0);
  const declarations = useMemo(() => generateAllDeclarations(data.clients, data.declarationStatus), [data.clients, data.declarationStatus]);
  const pendingDeclarations = declarations.filter((d) => d.status !== "مكتمل").length;

  const stat = (label, value, color, Icon) => (
    <Card className="p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "22", color }}><Icon size={20} /></div>
      <div className="min-w-0">
        <div className="text-slate-500 dark:text-slate-400 text-xs">{label}</div>
        <div className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{value}</div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">لوحة التحكم</h2>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 text-sm">
          <button onClick={() => setMode("month")} className={`px-3 py-1.5 rounded-md ${mode === "month" ? "bg-white dark:bg-slate-900 shadow font-semibold" : ""}`}>شهري</button>
          <button onClick={() => setMode("year")} className={`px-3 py-1.5 rounded-md ${mode === "year" ? "bg-white dark:bg-slate-900 shadow font-semibold" : ""}`}>سنوي</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stat("عدد العملاء", data.clients.length, "#173B5E", Users)}
        {stat("عدد الفواتير", invoicesScope.length, "#0ea5e9", FileText)}
        {stat("إجمالي الفواتير", fmtMoney(totalInvoices), "#173B5E", Wallet)}
        {stat("المحصّل", fmtMoney(collected), "#16a34a", CheckCircle2)}
        {stat("المعلّق", fmtMoney(pending), "#d97706", Clock)}
        {stat("إجمالي المصروفات", fmtMoney(totalExpenses), "#e11d48", Wallet)}
        {stat("إقرارات متأخرة", pendingDeclarations, "#C9A227", ClipboardCheck)}
      </div>
    </div>
  );
}
