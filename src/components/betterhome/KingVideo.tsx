"use client";

import { useEffect, useRef } from "react";

interface KingVideoProps {
  className?: string;
}

export default function KingVideo({ className = "" }: KingVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      // ── WebGL GPU Shader Keyer ──
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
          
          // Calculate brightness / luminance
          float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          float maxC = max(color.r, max(color.g, color.b));
          float metric = max(luma, maxC);

          // Thresholds to completely eliminate the black / dark background
          float edgeLow = 0.08;
          float edgeHigh = 0.22;
          
          float alpha = smoothstep(edgeLow, edgeHigh, metric);

          if (alpha <= 0.001) {
            discard;
          }

          gl_FragColor = vec4(color.rgb, alpha);
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
              canvas.width = video.videoWidth || 1280;
              canvas.height = video.videoHeight || 720;
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
    } else {
      // ── 2D Canvas Fallback ──
      const ctx = canvas.getContext("2d");
      const render2d = () => {
        if (ctx && video.readyState >= video.HAVE_CURRENT_DATA) {
          if (canvas.width !== video.videoWidth) {
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            const maxVal = Math.max(r, g, b);
            const metric = Math.max(luma, maxVal);

            if (metric < 25) {
              data[i + 3] = 0;
            } else if (metric < 55) {
              data[i + 3] = Math.round(((metric - 25) / 30) * 255);
            }
          }
          ctx.putImageData(frame, 0, 0);
        }
        animationFrameId = requestAnimationFrame(render2d);
      };
      render2d();
    }

    // Autoplay handling
    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden offscreen video source */}
      <video
        ref={videoRef}
        src="/king.mp4"
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      {/* Pure Alpha Canvas displaying real-time keyed character */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-[0_0_40px_rgba(245,158,11,0.35)]"
      />
    </div>
  );
}
