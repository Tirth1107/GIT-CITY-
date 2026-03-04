"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface FounderMessageProps {
  onClose: () => void;
}

type Lang = "en" | "pt";

const MESSAGES: Record<Lang, string[]> = {
  en: [
    "You chose the truth. Good choice.",
    "Everything you see here... the buildings, the lights, the streets... it's code. Every pixel, every lit window, every shadow. It's all a simulation. But you already knew that.",
    "What you might not know is that behind this entire city, there's a single dev. A guy who decided to build this alone, because he could.",
    "Git City was born on a weekend. The idea was simple: what if we stopped looking at green squares on a chart and started seeing what they really are? People. Building things. Every day.",
    "In one week, over 6,000 devs showed up. 6,000 buildings in a city that didn't exist 7 days before. You built this. I just turned on the signal.",
    "This antenna you clicked? It's real. It transmits Git City. And keeping this signal on the air costs. Servers, database, API calls... every new building that goes up, the cost goes up with it.",
    "If Git City means something to you, help me keep the signal on. Any support keeps this city alive.",
    "Thank you for being here. Thank you for building. The city is yours.",
    "See you on the streets.",
  ],
  pt: [
    "Voce escolheu a verdade. Boa escolha.",
    "Tudo que voce ve aqui... os predios, as luzes, as ruas... e codigo. Cada pixel, cada janela acesa, cada sombra. E tudo uma simulacao. Mas voce ja sabia disso.",
    "O que voce talvez nao saiba e que por tras dessa cidade inteira, existe um unico dev. Um cara que decidiu construir isso sozinho, porque podia.",
    "A Git City nasceu num final de semana. A ideia era simples: e se a gente parasse de olhar pra quadrados verdes num grafico e comecasse a ver o que eles realmente sao? Pessoas. Construindo coisas. Todo dia.",
    "Em uma semana, mais de 6.000 devs apareceram. 6.000 predios numa cidade que nao existia 7 dias antes. Voces construiram isso. Eu so liguei o sinal.",
    "Essa antena que voce clicou? E real. Ela transmite a Git City. E manter esse sinal no ar custa. Servidores, banco de dados, API calls... cada novo predio que sobe, o custo sobe junto.",
    "Se a Git City significa algo pra voce, me ajuda a manter o sinal ligado. Qualquer apoio mantem essa cidade viva.",
    "Obrigado por estar aqui. Obrigado por construir. A cidade e de voces.",
    "Nos vemos nas ruas.",
  ],
};

const SIGNATURE: Record<Lang, string> = {
  en: "// samuel, founder, solo dev, citizen #1",
  pt: "// samuel, fundador, dev solo, cidadao #1",
};

const PS_TEXT: Record<Lang, string> = {
  en: "P.S. Would the white rabbit have found you if you had chosen the other one?",
  pt: "P.S. Sera que o coelho branco te encontraria se voce tivesse escolhido a outra?",
};

const CHAR_DELAY = 25;
const PARAGRAPH_PAUSE = 400;

export default function FounderMessage({ onClose }: FounderMessageProps) {
  const [lang, setLang] = useState<Lang>("en");
  const [typedText, setTypedText] = useState("");
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [paragraphsDone, setParagraphsDone] = useState<string[]>([]);
  const [showSignature, setShowSignature] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showPS, setShowPS] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  const paragraphs = MESSAGES[lang];
  const allParagraphsDone = currentParagraph >= paragraphs.length;

  // Fade in overlay
  useEffect(() => {
    requestAnimationFrame(() => {
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
    });
  }, []);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll helper
  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Typing effect
  useEffect(() => {
    if (allParagraphsDone) return;

    const text = paragraphs[currentParagraph];
    if (!text) return;

    charIndexRef.current = 0;
    setTypedText("");

    const type = () => {
      if (charIndexRef.current < text.length) {
        charIndexRef.current++;
        setTypedText(text.slice(0, charIndexRef.current));
        scrollToBottom();
        typingRef.current = setTimeout(type, CHAR_DELAY);
      } else {
        // Paragraph done, pause then move to next
        typingRef.current = setTimeout(() => {
          setParagraphsDone((prev) => [...prev, text]);
          setTypedText("");
          setCurrentParagraph((p) => p + 1);
        }, PARAGRAPH_PAUSE);
      }
    };

    // Small initial delay before starting
    typingRef.current = setTimeout(type, currentParagraph === 0 ? 500 : 200);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [currentParagraph, paragraphs, allParagraphsDone, scrollToBottom]);

  // After all paragraphs done, show signature, support, PS
  useEffect(() => {
    if (!allParagraphsDone) return;

    const t1 = setTimeout(() => {
      setShowSignature(true);
      scrollToBottom();
    }, 600);
    const t2 = setTimeout(() => {
      setShowSupport(true);
      scrollToBottom();
    }, 1800);
    const t3 = setTimeout(() => {
      setShowPS(true);
      scrollToBottom();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [allParagraphsDone, scrollToBottom]);

  // Skip: reveal everything instantly
  const skip = useCallback(() => {
    if (allParagraphsDone) return;
    if (typingRef.current) clearTimeout(typingRef.current);
    setParagraphsDone([...paragraphs]);
    setTypedText("");
    setCurrentParagraph(paragraphs.length);
    setShowSignature(true);
    setShowSupport(true);
    setShowPS(true);
    setTimeout(scrollToBottom, 50);
  }, [allParagraphsDone, paragraphs, scrollToBottom]);

  // Reset typing on language change
  const switchLang = (newLang: Lang) => {
    if (newLang === lang) return;
    if (typingRef.current) clearTimeout(typingRef.current);
    setLang(newLang);
    setTypedText("");
    setCurrentParagraph(0);
    setParagraphsDone([]);
    setShowSignature(false);
    setShowSupport(false);
    setShowPS(false);
    charIndexRef.current = 0;
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700"
      style={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Message container */}
      <div
        className="relative mx-4 w-full max-w-xl max-h-[85vh] flex flex-col"
        style={{
          border: "2px solid rgba(0, 255, 65, 0.3)",
          background: "rgba(5, 10, 5, 0.95)",
          boxShadow: "4px 4px 0px rgba(0, 255, 65, 0.1)",
        }}
      >
        {/* Header with lang toggle and close */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: "1px solid rgba(0, 255, 65, 0.15)" }}
        >
          <div
            className="font-pixel text-[8px] sm:text-[9px] tracking-wider"
            style={{ color: "rgba(0, 255, 65, 0.3)" }}
          >
            &gt; TRANSMISSION FROM SPIRE_01
          </div>

          <div className="flex items-center gap-1">
            {/* Language toggle */}
            <button
              onClick={() => switchLang("en")}
              className="font-pixel text-[9px] px-2 py-0.5 cursor-pointer transition-colors"
              style={{
                color: lang === "en" ? "#00ff41" : "rgba(0, 255, 65, 0.25)",
                background: lang === "en" ? "rgba(0, 255, 65, 0.1)" : "transparent",
                border: `1px solid ${lang === "en" ? "rgba(0, 255, 65, 0.3)" : "transparent"}`,
              }}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("pt")}
              className="font-pixel text-[9px] px-2 py-0.5 cursor-pointer transition-colors"
              style={{
                color: lang === "pt" ? "#00ff41" : "rgba(0, 255, 65, 0.25)",
                background: lang === "pt" ? "rgba(0, 255, 65, 0.1)" : "transparent",
                border: `1px solid ${lang === "pt" ? "rgba(0, 255, 65, 0.3)" : "transparent"}`,
              }}
            >
              PT
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="font-pixel text-[12px] ml-3 cursor-pointer transition-colors"
              style={{ color: "rgba(0, 255, 65, 0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00ff41")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0, 255, 65, 0.4)")}
            >
              [X]
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div ref={contentRef} className="overflow-y-auto p-6 sm:p-8">
          {/* Completed paragraphs */}
          <div className="flex flex-col gap-4">
            {paragraphsDone.map((text, i) => (
              <p
                key={`${lang}-${i}`}
                className="font-pixel text-[10px] sm:text-[11px] leading-relaxed"
                style={{ color: "#e0e0e0" }}
              >
                {text}
              </p>
            ))}

            {/* Currently typing paragraph */}
            {!allParagraphsDone && typedText.length > 0 && (
              <p
                className="font-pixel text-[10px] sm:text-[11px] leading-relaxed"
                style={{ color: "#e0e0e0" }}
              >
                {typedText}
                <span
                  className="inline-block w-[7px] h-[11px] ml-[1px] align-middle"
                  style={{
                    background: cursorVisible ? "#00ff41" : "transparent",
                    transition: "background 0.1s",
                  }}
                />
              </p>
            )}

            {/* Cursor when waiting for first char */}
            {!allParagraphsDone && typedText.length === 0 && paragraphsDone.length > 0 && (
              <p className="font-pixel text-[10px] sm:text-[11px]">
                <span
                  className="inline-block w-[7px] h-[11px] align-middle"
                  style={{
                    background: cursorVisible ? "#00ff41" : "transparent",
                    transition: "background 0.1s",
                  }}
                />
              </p>
            )}
          </div>

          {/* Signature */}
          <p
            className="font-pixel text-[9px] sm:text-[10px] mt-8 transition-all duration-700"
            style={{
              color: "#00ff41",
              opacity: showSignature ? 0.7 : 0,
              transform: showSignature ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {SIGNATURE[lang]}
          </p>

          {/* Support button */}
          <div
            className="mt-6 transition-all duration-700"
            style={{
              opacity: showSupport ? 1 : 0,
              transform: showSupport ? "translateY(0)" : "translateY(8px)",
            }}
          >
            <a
              href="/support"
              className="inline-block font-pixel text-[10px] sm:text-[11px] px-4 py-2 uppercase tracking-wider transition-all duration-300 cursor-pointer"
              style={{
                color: "#00ff41",
                border: "2px solid rgba(0, 255, 65, 0.4)",
                background: "rgba(0, 255, 65, 0.05)",
                boxShadow: "3px 3px 0px rgba(0, 255, 65, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 255, 65, 0.15)";
                e.currentTarget.style.borderColor = "#00ff41";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 255, 65, 0.05)";
                e.currentTarget.style.borderColor = "rgba(0, 255, 65, 0.4)";
              }}
            >
              {lang === "en" ? "Keep the signal alive" : "Mantenha o sinal vivo"}
            </a>
          </div>

          {/* P.S. */}
          <p
            className="font-pixel text-[8px] sm:text-[9px] mt-8 mb-2 italic transition-all duration-1000"
            style={{
              color: "rgba(0, 255, 65, 0.35)",
              opacity: showPS ? 1 : 0,
              transform: showPS ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {PS_TEXT[lang]}
          </p>
        </div>

        {/* Skip footer */}
        {!allParagraphsDone && (
          <div
            className="px-6 py-3 flex justify-center"
            style={{ borderTop: "1px solid rgba(0, 255, 65, 0.1)" }}
          >
            <button
              onClick={skip}
              className="font-pixel text-[9px] px-3 py-1 cursor-pointer transition-colors tracking-wider"
              style={{ color: "rgba(0, 255, 65, 0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00ff41")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0, 255, 65, 0.3)")}
            >
              SKIP &gt;&gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
