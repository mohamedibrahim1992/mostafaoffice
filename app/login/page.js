"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MapPin, Lock } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { USERS, defaultRouteForRole } from "../../lib/constants";

function OfficeLogo({ logo }) {
  const [error, setError] = useState(false);
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="شعار المكتب" className="w-16 h-16 rounded-2xl object-contain bg-white shadow-lg p-1" />;
  }
  if (error) {
    return <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center text-navyDark font-black text-2xl shadow-lg">مح</div>;
  }
  // بديل احتياطي: لو حطيت ملف اسمه logo.png داخل مجلد public هيظهر تلقائيًا من غير ما ترفع صورة من الإعدادات
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="شعار المكتب" onError={() => setError(true)}
      className="w-16 h-16 rounded-2xl object-contain bg-white shadow-lg p-1" />
  );
}

function StaffLoginWidget() {
  const { login, profile, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && profile) router.replace(defaultRouteForRole(profile.role)); }, [loading, profile, router]);

  const submit = async (e) => {
    e.preventDefault();
    if (!username) { setErr("اختر الاسم"); return; }
    setBusy(true);
    const { error } = await login(username, password);
    if (error) { setBusy(false); setErr(error); return; }
    // التوجيه بيحصل من الـ useEffect فوق بعد ما الملف الشخصي (ودوره) يتحمّل فعليًا
  };

  return (
    <div className="fixed top-3 left-3 z-30 w-48">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2.5">
        <div className="flex items-center gap-1 mb-1.5 text-slate-400 dark:text-slate-500">
          <Lock size={10} />
          <span className="text-[10px]">دخول الموظفين</span>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-1.5">
          <select value={username} onChange={(e) => { setUsername(e.target.value); setErr(""); }} required
            className="text-[11px] px-1.5 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-navy">
            <option value="">الاسم</option>
            {USERS.map((u) => <option key={u.username} value={u.username}>{u.name}</option>)}
          </select>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} required placeholder="كلمة المرور"
            className="text-[11px] px-1.5 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-navy" />
          {err && <div className="text-[10px] text-rose-600">{err}</div>}
          <button type="submit" disabled={busy}
            className="text-[11px] font-medium bg-navy hover:bg-navyDark text-white rounded-md py-1 disabled:opacity-50">
            {busy ? "..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [officeInfo, setOfficeInfo] = useState(null);

  useEffect(() => {
    supabase.from("settings").select("office_info").eq("id", 1).single()
      .then(({ data }) => { if (data?.office_info) setOfficeInfo(data.office_info); });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-navyDark via-navy to-[#0a1f33]">
      <StaffLoginWidget />

      {/* الصفحة الرئيسية العامة — أي زائر يشوفها */}
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <OfficeLogo logo={officeInfo?.logo} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{officeInfo?.name || "مكتب المحاسب القانوني / مصطفى حمزة"}</h1>
            <p className="text-slate-400 text-sm">محاسبة · مراجعة · استشارات ضريبية</p>
          </div>
        </div>

        <div className="text-sm md:text-base leading-7 md:leading-8 space-y-4 text-slate-300">
          <p>
            بفخر، نقدم مكتب المحاسب القانوني / مصطفى حمزة باعتباره مؤسسة محترفة متخصصة في الخدمات المحاسبية والمراجعة
            والخدمات الضريبية، ونهدف إلى خدمة الشركات الصغيرة والمتوسطة والمساعدة في تطويرها، وذلك من خلال تقديم مجموعة
            متنوعة من الخدمات الأساسية التي تحافظ على استقرار الشركات الناشئة وتعزز نموها.
          </p>
          <p>
            نحن نقدم الدعم اللازم والملائم لأصحاب الشركات وصناع القرار داخل هذه الشركات للنجاح في سوق الأعمال المصري.
            نحرص دائمًا على الامتثال لجميع القوانين والتشريعات الضريبية والتجارية التي تنظم إجراءات الاستثمار في مصر،
            مما يشمل الالتزام بالمسائل المالية والمحاسبية للشركات.
          </p>
          <p>
            نهدف إلى تخفيف الضغط والتوتر الناتج عن المسائل المحاسبية والضريبية، وإنجاز الإجراءات الحكومية، مما يتيح لك
            التركيز بشكل أفضل على إدارة وتطوير أعمالك. نحن هنا لدعمك وتقديم الخدمات المهنية التي تحقق أهدافك الضرورية
            في عالم الأعمال.
          </p>

          <div>
            <h3 className="text-gold font-bold mb-1">هدفنا الرئيسي</h3>
            <p>
              تقديم خدمات مالية وقانونية وبرمجية شاملة لعملائنا، وتقديم خيارات اقتصادية وحلول إدارية لرفع مستوى أدائهم
              والمحافظة على استمرارية مشروعاتهم وتعزيز نموها. كما نسعى لتوعية العملاء بالفرص الاستثمارية المتاحة والتي
              قد تكون غير معروفة لهم.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-bold mb-1">رسالتنا</h3>
            <p>
              نحن نسعى دومًا لتحقيق التميز والجودة العالية في أداء المهام، من خلال فرق العمل المميزة ذات الوعي
              والتدريب اللازم. نسعى لبناء علاقات مهنية قوية مع جميع عملائنا.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-bold mb-1">رؤيتنا</h3>
            <p>
              نطمح لأن نكون من أفضل المكاتب في تقديم الخدمات المالية والإدارية لعملائنا على مستوى مصر والمنافسة على
              مستوى الوطن العربي بشكل فعّال وملموس.
            </p>
          </div>

          {(officeInfo?.phone || officeInfo?.address) && (
            <div className="pt-4 border-t border-white/10 flex flex-col gap-1.5 text-slate-300">
              {officeInfo?.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-gold" /> {officeInfo.phone}</span>}
              {officeInfo?.address && <span className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> {officeInfo.address}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
