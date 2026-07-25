"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MapPin } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { USERS } from "../../lib/constants";
import { Card, Btn, Input, Select } from "../../components/ui";

function OfficeLogo() {
  const [error, setError] = useState(false);
  if (error) {
    return <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center text-navyDark font-black text-2xl shadow-lg">مح</div>;
  }
  // ضع ملف الشعار باسم logo.png داخل مجلد public وهيظهر تلقائيًا هنا بدل الحرفين
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="شعار المكتب" onError={() => setError(true)}
      className="w-16 h-16 rounded-2xl object-contain bg-white shadow-lg p-1" />
  );
}

export default function LoginPage() {
  const { login, profile, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [officeInfo, setOfficeInfo] = useState(null);

  useEffect(() => { if (!loading && profile) router.replace("/dashboard"); }, [loading, profile, router]);

  useEffect(() => {
    supabase.from("settings").select("office_info").eq("id", 1).single()
      .then(({ data }) => { if (data?.office_info) setOfficeInfo(data.office_info); });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!username) { setErr("اختر اسم المستخدم"); return; }
    setBusy(true);
    const { error } = await login(username, password);
    setBusy(false);
    if (error) { setErr(error); return; }
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-navyDark via-navy to-[#0a1f33] flex flex-col md:flex-row">
      {/* الوصف التعريفي بالمكتب */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-14 md:py-16 order-2 md:order-1">
        <div className="max-w-xl mx-auto md:mx-0 text-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <OfficeLogo />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{officeInfo?.name || "مكتب المحاسب القانوني / مصطفى حمزة"}</h1>
              <p className="text-slate-400 text-sm">محاسبة · مراجعة · استشارات ضريبية</p>
            </div>
          </div>

          <div className="text-sm leading-7 space-y-4 text-slate-300">
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
              <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5 text-slate-300">
                {officeInfo?.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-gold" /> {officeInfo.phone}</span>}
                {officeInfo?.address && <span className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> {officeInfo.address}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نموذج تسجيل الدخول */}
      <div className="w-full md:w-[420px] shrink-0 flex flex-col justify-center px-6 py-10 md:px-10 order-1 md:order-2 bg-black/10">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-6 md:hidden">
            <p className="text-slate-300 text-sm">سجّل الدخول لمتابعة عملك</p>
          </div>
          <Card className="p-6">
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Select label="اسم المستخدم" value={username} onChange={(e) => { setUsername(e.target.value); setErr(""); }} required>
                <option value="">اختر الاسم</option>
                {USERS.map((u) => <option key={u.username} value={u.username}>{u.name} — {u.role}</option>)}
              </Select>
              <Input label="كلمة المرور" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} placeholder="••••••••" required />
              {err && <div className="text-rose-600 text-sm bg-rose-50 dark:bg-rose-900/30 rounded-lg px-3 py-2">{err}</div>}
              <Btn type="submit" disabled={busy} className="justify-center w-full mt-1">{busy ? "جاري الدخول..." : "تسجيل الدخول"}</Btn>
            </form>
          </Card>
          <p className="text-center text-slate-400 text-xs mt-4">النظام محمي — لا تشارك بيانات الدخول مع أي شخص</p>
        </div>
      </div>
    </div>
  );
}
