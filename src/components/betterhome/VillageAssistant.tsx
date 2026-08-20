"use client";

import { useEffect, useRef, useState } from "react";

interface GuideTopic {
  id: string;
  category: string;
  title: string;
  dialogue: string;
  actionText: string;
  actionHref: string;
}

const guideTopics: GuideTopic[] = [
  {
    id: "welcome",
    category: "REALM BRIEFING",
    title: "Welcome Chief!",
    dialogue: "You stand within Clan Aura-7F. Our fortress is built upon forbidden code and guarded by the legendary Barbarian King. How may I advise you today?",
    actionText: "Enter the Guild",
    actionHref: "#home",
  },
  {
    id: "lore",
    category: "ANCIENT CODEX",
    title: "The Code of Aura",
    dialogue: "Our brotherhood is bound by 6 Canon Laws: Alliance, Wisdom, Glory, Magic, Ascension, and Precision. Uphold them to level up your clan rank!",
    actionText: "Study The Code",
    actionHref: "#lore",
  },
  {
    id: "relics",
    category: "TROPHY HALL",
    title: "10+ Relics Forged",
    dialogue: "Our guild members maintain a 100% War Loyalty Rate and draw power from an infinite mana pool to construct legendary software artifacts.",
    actionText: "View Clan Stats",
    actionHref: "#clan",
  },
  {
    id: "war",
    category: "WAR PORTAL",
    title: "Heed the Call",
    dialogue: "The War Portal is actively channeling. Step through the void to collaborate with elite code-wizards and forge the future.",
    actionText: "Open War Portal",
    actionHref: "#lore",
  },
  {
    id: "recruitment",
    category: "GUILD HALL",
    title: "Join the Fellowship",
    dialogue: "Whether you wield frontend magic, backend sorcery, or systems alchemy, there is a place for your banner in our grand hall.",
    actionText: "Join Ranks",
    actionHref: "#home",
  },
];

export default function VillageAssistant() {
  const [selectedTopic, setSelectedTopic] = useState<GuideTopic>(guideTopics[0]);
  const [isOpen, setIsOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [activeTab, setActiveTab] = useState<"briefing" | "topics">("briefing");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Show immediately for the Advisor
  useEffect(() => {
    setHasScrolledPastHero(true);
  }, []);

  // WebGL White-Chroma Shader for transparent villager
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    let gl: WebGLRenderingContext | null = null;
    let isWebGL = false;

    try {
      gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
      if (gl) isWebGL = true;
    } catch {
      isWebGL = false;
    }

    if (isWebGL && gl) {
      const vsSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
        }
      `;

      const fsSource = `
        precision mediump float;
        uniform sampler2D u_image;
        varying vec2 v_texCoord;
        void main() {
          vec4 color = texture2D(u_image, v_texCoord);
          
          float dist = distance(color.rgb, vec3(1.0, 1.0, 1.0));
          float minC = min(color.r, min(color.g, color.b));
          
          float alpha = smoothstep(0.08, 0.28, dist);
          if (minC > 0.94) {
            alpha = 0.0;
          }

          if (alpha <= 0.01) {
            discard;
          }

          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `;

      const createShader = (type: number, source: string) => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, source);
        gl!.compileShader(shader);
        return shader;
      };

      const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vertexShader && fragmentShader) {
        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
          ]),
          gl.STATIC_DRAW
        );

        const posAttr = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            0, 0, 1, 0, 0, 1,
            0, 1, 1, 0, 1, 1,
          ]),
          gl.STATIC_DRAW
        );

        const texAttr = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(texAttr);
        gl.vertexAttribPointer(texAttr, 2, gl.FLOAT, false, 0, 0);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const render = () => {
          if (video.readyState >= video.HAVE_CURRENT_DATA) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth || 720;
              canvas.height = video.videoHeight || 1280;
              gl!.viewport(0, 0, canvas.width, canvas.height);
            }

            gl!.bindTexture(gl!.TEXTURE_2D, texture);
            gl!.texImage2D(
              gl!.TEXTURE_2D,
              0,
              gl!.RGBA,
              gl!.RGBA,
              gl!.UNSIGNED_BYTE,
              video
            );

            gl!.clearColor(0, 0, 0, 0);
            gl!.clear(gl!.COLOR_BUFFER_BIT);
            gl!.drawArrays(gl!.TRIANGLES, 0, 6);
          }
          animationFrameId = requestAnimationFrame(render);
        };

        render();
      }
    }

    video.play().catch(() => { });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end transition-all duration-500 ease-out ${hasScrolledPastHero
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-12 pointer-events-none"
        }`}
    >
      {/* ── CoC Detailed Advisor Dialogue Card ── */}
      {isOpen && !minimized && hasScrolledPastHero && (
        <div className="relative mb-2 w-[270px] sm:w-[310px] p-4 rounded-2xl bg-gradient-to-b from-[#182338]/95 via-[#101726]/95 to-[#0B0F19]/98 border-2 border-[#F59E0B]/80 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">

          {/* Corner Rivets */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#FDE047] shadow-[0_0_4px_#FDE047]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#FDE047] shadow-[0_0_4px_#FDE047]" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#FDE047] shadow-[0_0_4px_#FDE047]" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#FDE047] shadow-[0_0_4px_#FDE047]" />

          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#F59E0B]/30 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <div>
                <span className="font-[family-name:var(--font-cinzel)] text-[11px] font-black text-[#FDE047] tracking-wider uppercase block leading-none">
                  Village Advisor
                </span>
                <span className="text-[8px] font-bold text-amber-200/60 uppercase tracking-widest">
                  {selectedTopic.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setMinimized(true)}
              className="text-white/50 hover:text-[#FDE047] text-xs font-bold px-1.5 py-0.5 rounded transition-colors"
              title="Minimize Advisor"
            >
              ✕
            </button>
          </div>

          {/* Tab Selection (Briefing vs Quest Topics) */}
          <div className="flex gap-1 bg-[#0B0F19]/80 p-1 rounded-lg border border-[#F59E0B]/20 mb-3 text-[9px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("briefing")}
              className={`flex-1 py-1 rounded transition-colors ${activeTab === "briefing"
                ? "bg-[#F59E0B] text-[#0B0F19] font-black"
                : "text-white/60 hover:text-white"
                }`}
            >
              Briefing
            </button>
            <button
              onClick={() => setActiveTab("topics")}
              className={`flex-1 py-1 rounded transition-colors ${activeTab === "topics"
                ? "bg-[#F59E0B] text-[#0B0F19] font-black"
                : "text-white/60 hover:text-white"
                }`}
            >
              Ask Questions
            </button>
          </div>

          {/* View: Briefing Mode */}
          {activeTab === "briefing" && (
            <div>
              <h4 className="font-[family-name:var(--font-cinzel)] text-xs font-black text-white mb-1.5">
                {selectedTopic.title}
              </h4>
              <p className="font-sans text-[11px] sm:text-xs text-amber-100/90 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mb-3">
                &ldquo;{selectedTopic.dialogue}&rdquo;
              </p>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const currentIndex = guideTopics.findIndex((t) => t.id === selectedTopic.id);
                    const nextIndex = (currentIndex + 1) % guideTopics.length;
                    setSelectedTopic(guideTopics[nextIndex]);
                  }}
                  className="text-[9px] font-bold uppercase tracking-wider text-[#FDE047] hover:underline"
                >
                  Next Briefing →
                </button>
                <a
                  href={selectedTopic.actionHref}
                  className="text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#F59E0B] to-[#FDE047] text-[#0B0F19] px-3 py-1 rounded-full shadow hover:brightness-110 transition-all"
                >
                  {selectedTopic.actionText}
                </a>
              </div>
            </div>
          )}

          {/* View: Interactive Questions Topics Mode */}
          {activeTab === "topics" && (
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {guideTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setActiveTab("briefing");
                  }}
                  className={`text-left text-[10px] p-1.5 rounded-lg border transition-all ${selectedTopic.id === topic.id
                    ? "bg-[#F59E0B]/20 border-[#FDE047] text-[#FDE047] font-bold"
                    : "bg-[#0B0F19]/50 border-white/5 text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <div className="font-semibold">{topic.title}</div>
                  <div className="text-[8px] text-white/40">{topic.category}</div>
                </button>
              ))}
            </div>
          )}

          {/* Dialogue Arrow pointing to character on right */}
          <div className="absolute -bottom-2 right-6 w-3.5 h-3.5 bg-[#101726] border-r-2 border-b-2 border-[#F59E0B] transform rotate-45" />
        </div>
      )}

      {/* ── Compact Villager Avatar (Bottom-Right) ── */}
      <div
        onClick={() => setMinimized(!minimized)}
        className="relative group cursor-pointer w-[75px] h-[105px] sm:w-[90px] sm:h-[125px] filter drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform"
      >
        {/* Hidden video source */}
        <video
          ref={videoRef}
          src="/assistant.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hidden"
        />

        {/* WebGL Transparent Output Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]"
        />

        {/* Minimized Floating Badge */}
        {minimized && (
          <div className="absolute -top-1 left-0 bg-[#F59E0B] text-[#0B0F19] text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_8px_#F59E0B] animate-bounce">
            Advisor
          </div>
        )}
      </div>
    </div>
  );
}
