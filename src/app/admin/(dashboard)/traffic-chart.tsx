"use client";

import type { DailyPoint } from "@/features/admin/analytics/data";

/**
 * Bağımlılıksız SVG trafik grafiği: günlük görüntülenme (çubuk) + tekil
 * ziyaretçi (çizgi). Responsive (viewBox), tema token'larıyla renklenir.
 */
export function TrafficChart({ data }: { data: DailyPoint[] }) {
  const W = 760;
  const H = 260;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxV = Math.max(1, ...data.map((d) => d.pageviews));
  // Y ekseni için "güzel" bir üst sınır.
  const niceMax = niceCeil(maxV);

  const n = data.length;
  const slot = innerW / n;
  const barW = Math.max(4, slot * 0.55);

  const x = (i: number) => padL + slot * i + slot / 2;
  const y = (v: number) => padT + innerH - (v / niceMax) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.visitors).toFixed(1)}`)
    .join(" ");

  // X etiketleri: en fazla ~7 tarih göster.
  const labelStep = Math.ceil(n / 7);

  const totalViews = data.reduce((a, b) => a + b.pageviews, 0);
  const totalVisitors = data.reduce((a, b) => a + b.visitors, 0);

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Legend swatch="bg-accent" label="Görüntülenme" />
        <Legend swatch="bg-foreground" label="Tekil ziyaretçi" line />
        <span className="ml-auto text-xs text-muted-foreground">
          Son {n} gün
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Son ${n} günde toplam ${totalViews} görüntülenme, ${totalVisitors} tekil ziyaretçi.`}
      >
        {/* Yatay ızgara + y etiketleri */}
        {[0, 0.5, 1].map((t) => {
          const yy = padT + innerH - t * innerH;
          const val = Math.round(niceMax * t);
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={W - padR}
                y1={yy}
                y2={yy}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={padL - 6}
                y={yy + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Çubuklar (görüntülenme) */}
        {data.map((d, i) => {
          const h = (d.pageviews / niceMax) * innerH;
          return (
            <rect
              key={d.day}
              x={x(i) - barW / 2}
              y={padT + innerH - h}
              width={barW}
              height={h}
              rx={2}
              className="fill-accent/70"
            >
              <title>
                {formatDay(d.day)}: {d.pageviews} görüntülenme, {d.visitors} ziyaretçi
              </title>
            </rect>
          );
        })}

        {/* Çizgi (tekil ziyaretçi) */}
        <path d={linePath} fill="none" className="stroke-foreground" strokeWidth={2} />
        {data.map((d, i) => (
          <circle key={d.day} cx={x(i)} cy={y(d.visitors)} r={2.5} className="fill-foreground" />
        ))}

        {/* X etiketleri */}
        {data.map((d, i) =>
          i % labelStep === 0 ? (
            <text
              key={d.day}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {formatDay(d.day)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

function Legend({
  swatch,
  label,
  line,
}: {
  swatch: string;
  label: string;
  line?: boolean;
}) {
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        className={`${swatch} inline-block ${line ? "h-0.5 w-4" : "h-2.5 w-2.5 rounded-sm"}`}
      />
      {label}
    </span>
  );
}

function niceCeil(v: number): number {
  if (v <= 5) return 5;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const step = pow / 2;
  return Math.ceil(v / step) * step;
}

function formatDay(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}.${m}`;
}
