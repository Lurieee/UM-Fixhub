import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Menu, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

const Field = ({ label, type = "text", icon: Icon, placeholder }) => { const [visible, setVisible] = useState(false); const password = type === "password"; return <label className="auth-field"><span>{label}</span><div><Icon className="h-4 w-4"/><input required type={password && !visible ? "password" : "text"} placeholder={placeholder}/>{password && <button type="button" aria-label="Show password" onClick={() => setVisible(!visible)}>{visible ? <EyeOff/> : <Eye/>}</button>}</div></label>; };
const Brand = () => {
  const [transparentLogo, setTransparentLogo] = useState(null);

  useEffect(() => {
    const logo = new Image();
    logo.src = "/um-fixhub-logo-cropped.png";
    logo.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = logo.naturalWidth;
      canvas.height = logo.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(logo, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index];
        const green = pixels.data[index + 1];
        const blue = pixels.data[index + 2];
        if (red > 235 && green > 235 && blue > 235) pixels.data[index + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
      setTransparentLogo(canvas.toDataURL("image/png"));
    };
  }, []);

  return <div className="auth-brand"><img src={transparentLogo || "/um-fixhub-logo-cropped.png"} alt="UM FixHub" /></div>;
};

export function LandingPage({ onNavigate }) { const cards=[[Wrench,"Report Issues Instantly","Snap a picture of the broken item, set location, and submit under 30 seconds."],[ShieldCheck,"Track Repairs in Real-Time","Monitor status updates from 'Received' to 'Resolved' on your dashboard."],[CheckCircle2,"Keep Campus Safe","Flag electrical, plumbing, or infrastructure faults before they escalate."]]; const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); return <div className="min-h-screen bg-white text-slate-900"><header className="mx-auto flex h-[76px] max-w-6xl items-center justify-between border-b border-slate-200 px-6"><Brand/><nav className="flex items-center gap-2 text-sm font-bold sm:gap-4"><button onClick={() => scrollTo("about-campus")} className="header-link hidden rounded-lg px-3 py-2.5 text-slate-600 sm:block">About Campus</button><button onClick={() => scrollTo("support")} className="header-link hidden rounded-lg px-3 py-2.5 text-slate-600 sm:block">Support</button><button onClick={()=>onNavigate("/login")} className="header-link rounded-lg px-3 py-2.5 text-slate-700 sm:px-5">Sign In</button><button onClick={()=>onNavigate("/signup")} className="header-link header-cta rounded-lg px-3 py-2.5 text-white shadow-sm sm:px-5">Create Account</button></nav></header><section id="about-campus" className="landing-hero mx-auto max-w-6xl px-7 py-16 sm:px-10 sm:py-24"><div className="relative max-w-2xl"><p className="mb-4 text-sm font-extrabold uppercase tracking-[.18em] text-red-100">University of Mindanao</p><h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl">Keep your campus working beautifully</h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-100 sm:text-lg">Join hands with the facility maintenance team to report structural and utility issues instantly. Ensuring a safe and functional environment for every student.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={()=>onNavigate("/signup")} className="rounded-xl bg-white px-6 py-4 text-sm font-extrabold text-[#970014] shadow-lg hover:bg-[#8c1022] hover:text-white">Create Student Account</button><button onClick={()=>onNavigate("/dashboard")} className="rounded-xl border border-white/50 bg-white/10 px-6 py-4 text-sm font-extrabold text-white backdrop-blur-sm hover:bg-white hover:text-[#8c1022]">View Live Dashboard</button></div></div></section><section className="mx-auto max-w-6xl px-7 py-20"><div className="text-center"><h2 className="text-3xl font-extrabold">How we keep things running</h2><span className="mt-5 inline-block h-1 w-16 rounded-full bg-[#b40012]"/></div><div className="mt-14 grid gap-7 md:grid-cols-3">{cards.map(([Icon,title,text])=><article key={title} className="rounded-[26px] bg-[#f7f9fc] p-7"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-[#b40012]"><Icon/></span><h3 className="mt-6 text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section><footer id="support" className="mx-auto grid max-w-6xl grid-cols-2 gap-8 bg-[#f7f9fc] px-7 py-12 text-sm text-slate-600 md:grid-cols-4"><div><Brand/><p className="mt-4">Empowering students to maintain a better campus environment through technology.</p></div><div><b>Platform</b><p className="mt-3">Features<br/>Report Guide<br/>Mobile App</p></div><div><b>Support</b><p className="mt-3">Help Center<br/>Safety Guidelines<br/>Contact Us</p></div><div><b>Legal</b><p className="mt-3">Privacy Policy<br/>Terms of Service<br/>Accessibility</p></div></footer></div>; }

function AuthPanel({ mode, onNavigate, onLogin }) { const signup = mode === "signup"; const submit = (e) => { e.preventDefault(); onLogin?.(); onNavigate("/dashboard"); }; return <div className="auth-page"><section className="auth-art"><Brand/><div className="art-copy"><h1>{signup ? <>Join the community<br/>maintaining UM.</> : <>Ensuring excellence<br/>in campus facilities.</>}</h1><p>{signup ? "Create your account to start reporting facilities issues. Your contribution helps ensure a better learning environment for all students and faculty." : "Log in to your account to report maintenance issues, track progress, and help us maintain a safe campus environment for everyone."}</p></div>{!signup && <div className="community"><span>● ● ●</span>Join 2,000+ active campus reporters</div>}</section><section className="auth-content"><form onSubmit={submit} className="auth-form"><button type="button" className="back" onClick={() => onNavigate(signup ? "/login" : "/")}><ArrowLeft/>{signup ? "Back to Login" : "Back to Home"}</button><h1>{signup ? "Create your account" : "Welcome back!"}</h1><p className="intro">{signup ? "Please fill in your correct student or faculty credentials to get started." : "Enter your credentials to manage and track your maintenance reports."}</p>{signup && <Field label="Full Name" icon={UserRound} placeholder="e.g. Lorena Odiong"/>}<Field label="Campus Email Address" icon={Mail} placeholder="e.g. l.odiong.696969@umindanao.edu.ph"/>{signup && <Field label="Student / Staff ID" icon={Menu} placeholder="e.g. 696969"/>}<Field label="Password" type="password" icon={LockKeyhole} placeholder={signup ? "Create strong password" : "••••••••••••"}/>{signup && <Field label="Confirm Password" type="password" icon={LockKeyhole} placeholder="Re-enter password"/>}{!signup && <button type="button" className="forgot">Forgot Password?</button>}<button className="auth-submit">{signup ? "Create Student Account" : "Log In"}</button><p className="switch">{signup ? "Already have an account? " : "Don't have an account? "}<button type="button" onClick={() => onNavigate(signup ? "/login" : "/signup")}>{signup ? "Sign In" : "Sign Up"}</button></p></form></section></div>; }
export const LoginPage = ({ onNavigate, onLogin }) => <AuthPanel mode="login" onNavigate={onNavigate} onLogin={onLogin}/>;
export function SignUpPage({ onNavigate, onSignup }) {
  const [form, setForm] = useState({ fullName: "", email: "", studentId: "", program: "", campus: "" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const names = form.fullName.trim().split(/\s+/);
    onSignup({ firstName: names[0] || "Student", lastName: names.slice(1).join(" "), initials: names.map((name) => name[0]).join("").slice(0, 2).toUpperCase() || "ST", email: form.email, studentId: form.studentId, program: form.program, campus: form.campus });
    onNavigate("/dashboard");
  };
  return <div className="auth-page"><section className="auth-art"><Brand /><div className="art-copy"><h1>Join the community<br />maintaining UM.</h1><p>Create your account to start reporting facilities issues and help improve the campus for everyone.</p></div></section><section className="auth-content"><form onSubmit={submit} className="auth-form"><button type="button" className="back" onClick={() => onNavigate("/login")}><ArrowLeft />Back to Login</button><h1>Create your account</h1><p className="intro">Your profile will use the information below.</p><SignupField label="Full Name" name="fullName" icon={UserRound} placeholder="e.g. Lorena Odiong" value={form.fullName} onChange={update} /><SignupField label="Campus Email Address" name="email" type="email" icon={Mail} placeholder="e.g. name@umindanao.edu.ph" value={form.email} onChange={update} /><SignupField label="Student ID" name="studentId" icon={Menu} placeholder="e.g. 2026-001234" value={form.studentId} onChange={update} /><SignupField label="Program" name="program" icon={BookOpenIcon} placeholder="e.g. BS Information Technology" value={form.program} onChange={update} /><SignupField label="Campus" name="campus" icon={Menu} placeholder="e.g. Matina Campus" value={form.campus} onChange={update} /><Field label="Password" type="password" icon={LockKeyhole} placeholder="Create strong password" /><Field label="Confirm Password" type="password" icon={LockKeyhole} placeholder="Re-enter password" /><button className="auth-submit">Create Student Account</button></form></section></div>;
}

function SignupField({ label, name, type = "text", icon: Icon, placeholder, value, onChange }) {
  return <label className="auth-field"><span>{label}</span><div><Icon className="h-4 w-4" /><input required name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} /></div></label>;
}

function BookOpenIcon(props) { return <Menu {...props} />; }
