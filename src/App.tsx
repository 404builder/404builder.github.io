import { useEffect, useMemo, useRef, useState } from "react";
import Noise from "./components/noise";

interface Translations {
  title: string;
  description: string;
  tags: string[];
  contact: string;
}

interface TranslationSet {
  [key: string]: Translations;
}

const translations  : TranslationSet = {
  en: {
    title: "404builder",
    description: "Not everything that works is truly well built.",
    tags: ["# Red Team", "# Pentester", "# Reverser"],
    contact: "Contact",
  },
  es: {
    title: "404builder",
    description: "No todo lo que funciona está realmente bien hecho.",
    tags: ["# Red Team", "# Pentester", "# Reverser"],
    contact: "Contacto",
  },
};

export default function App() {
  const [lang, setLang] = useState(
    localStorage.getItem("selectedLang") || (navigator.language.startsWith("es") ? "es" : "en")
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem("selectedLang", lang);
  }, [lang]);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "01";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute left-0 top-0 w-screen h-screen pointer-events-none" />
              <select
          className="fixed top-3 right-3 z-10 bg-black text-green-400  border border-green-500 font-mono text-sm px-2 py-1"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="es">🌐 Español</option>
          <option value="en">🌐 English</option>
        </select>

      <div className="  min-h-dvh flex flex-col items-center justify-center  w-full overflow-hidden  ">

        <div className=" bg-black/10 backdrop-blur-2xl text-center sm:px-20 sm:py-20 py-20 px-2 sm:rounded-4xl mx-auto w-full sm:w-fit ">
        <h1
          className="text-5xl md:text-6xl text-green-400 font-mono"
          style={{ textShadow: "0 0 20px #00ff00, 0 0 40px #00ff00" }}
        >
          {t.title}
        </h1>


        <p className="text-green-300 text-base font-mono mt-5">{t.description}</p>

        <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm">
          {t.tags.map((tag) => (
            <span
              key={tag}
              className="border border-dashed border-green-500 text-green-400 px-2 py-1 bg-black/30 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 text-gray-400 text-sm font-mono">
          <p>
            {t.contact}:{" "}
            <a className="text-green-400 hover:underline" href="mailto:404builder@proton.me">
              404builder@proton.me
            </a>
          </p>
        </div>
      </div>

      </div>

  <Noise
    patternSize={250}
    patternScaleX={1}
    patternScaleY={1}
    patternRefreshInterval={2}
    patternAlpha={15}
  ></Noise>

    </>
  );
}
