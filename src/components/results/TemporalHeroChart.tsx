import { useState, useMemo } from "preact/hooks";
import type { JSX } from "preact";
import {
  temporalMatrix,
  THEMATIC_PRESETS,
  type TemporalDataPoint,
} from "../../data/resultsData";
import { THEMES, getThemeByCode, type ThemeDefinition } from "../../data/themes";

const PALETTE = [
  "#2563eb", // Blue
  "#d97706", // Amber
  "#059669", // Emerald
  "#7c3aed", // Purple
  "#e11d48", // Rose
  "#0891b2", // Cyan
  "#ea580c", // Orange
  "#4f46e5", // Indigo
  "#0d9488", // Teal
  "#db2777", // Pink
];

interface HoveredDotData {
  code: string;
  displayName: string;
  isNonLim: boolean;
  color: string;
  year: number;
  x: number;
  y: number;
  val: number;
  count: number;
  pct: number;
}

export default function TemporalHeroChart() {
  const [activePresetId, setActivePresetId] = useState<string>("mandate-swap");
  const [venue, setVenue] = useState<"all" | "acl" | "emnlp">("all");
  const [metric, setMetric] = useState<"pct" | "count">("pct");
  const [autoScaleY, setAutoScaleY] = useState<boolean>(true);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [spotlightCode, setSpotlightCode] = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<HoveredDotData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Custom selected codes (default = Top 5)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([
    "Scope Limitation",
    "Methodological Constraints",
    "High Resource Requirements",
    "Generalization Gap",
    "Dependency on Upstream Quality",
  ]);

  const [pickerCategory, setPickerCategory] = useState<"all" | "limitation" | "non-limitation">("all");

  const years = temporalMatrix.years; // [2020, 2021, 2022, 2023, 2024, 2025]

  // Direct explore navigation helper (filtered by code and optional year)
  const navigateToExplore = (code: string, year?: number) => {
    const params = new URLSearchParams();
    params.set("code", code);
    if (year) params.set("year", String(year));
    if (venue && venue !== "all") params.set("venue", venue);
    const targetUrl = `${import.meta.env.BASE_URL}explore?${params.toString()}`;
    window.location.assign(targetUrl);
  };

  // Direct explore navigation helper (filtered by year only across all codes)
  const navigateToExploreYearOnly = (year: number) => {
    const params = new URLSearchParams();
    params.set("year", String(year));
    if (venue && venue !== "all") params.set("venue", venue);
    const targetUrl = `${import.meta.env.BASE_URL}explore?${params.toString()}`;
    window.location.assign(targetUrl);
  };

  // Handle Preset selection (cleanly reset any spotlight / hover state)
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setSpotlightCode(null);
    setHoveredDot(null);
    setHoveredYear(null);
    const preset = THEMATIC_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedCodes([...preset.codes]);
    }
  };

  // Add / remove code (supports up to 10 codes)
  const handleAddCode = (codeName: string) => {
    if (selectedCodes.includes(codeName)) return;
    if (selectedCodes.length >= 10) {
      alert("To keep the visualization readable, you can compare up to 10 codes simultaneously. Please remove a code before adding another.");
      return;
    }
    setSpotlightCode(null);
    setHoveredDot(null);
    setHoveredYear(null);
    setSelectedCodes([...selectedCodes, codeName]);
    setActivePresetId("custom");
    setIsPickerOpen(false);
    setSearchQuery("");
  };

  const handleRemoveCode = (codeName: string) => {
    if (selectedCodes.length <= 1) return; // Keep at least one
    setSpotlightCode(null);
    setHoveredDot(null);
    setHoveredYear(null);
    setSelectedCodes(selectedCodes.filter((c) => c !== codeName));
    setActivePresetId("custom");
  };

  // SVG Geometry Dimensions
  const svgWidth = 840;
  const svgHeight = 420;
  const padding = { top: 40, right: 45, bottom: 50, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // X Coordinate mapper
  const xForYear = (year: number) => {
    const idx = years.indexOf(year);
    if (idx === -1) return padding.left;
    return padding.left + (idx / (years.length - 1)) * plotWidth;
  };

  // Max value calculation for Y scale (with dynamic auto-scaling support)
  const maxY = useMemo(() => {
    if (metric === "pct") {
      let maxPct = 0;
      for (const code of selectedCodes) {
        const cData = temporalMatrix.codeData[code]?.[venue];
        if (!cData) continue;
        for (const y of years) {
          if (cData[String(y)]?.pct > maxPct) maxPct = cData[String(y)].pct;
        }
      }
      if (!autoScaleY) {
        // Fixed standard scale
        return Math.min(100, Math.max(75, Math.ceil(maxPct / 10) * 10 + 5));
      }
      // Dynamic Auto-Zoom: scale tightly to active lines so small values don't sleep at bottom
      if (maxPct <= 3.5) return 5;
      if (maxPct <= 7) return 10;
      if (maxPct <= 12) return 15;
      if (maxPct <= 20) return 25;
      if (maxPct <= 32) return 40;
      if (maxPct <= 45) return 55;
      if (maxPct <= 65) return 75;
      return 100;
    } else {
      let maxCnt = 0;
      for (const code of selectedCodes) {
        const cData = temporalMatrix.codeData[code]?.[venue];
        if (!cData) continue;
        for (const y of years) {
          if (cData[String(y)]?.count > maxCnt) maxCnt = cData[String(y)].count;
        }
      }
      if (!autoScaleY) {
        return Math.max(1500, Math.ceil(maxCnt / 500) * 500);
      }
      if (maxCnt <= 100) return 120;
      if (maxCnt <= 300) return 350;
      if (maxCnt <= 600) return 700;
      if (maxCnt <= 1200) return 1400;
      return Math.max(100, Math.ceil((maxCnt * 1.15) / 100) * 100);
    }
  }, [selectedCodes, venue, metric, autoScaleY, years]);

  const yForVal = (val: number) => {
    return padding.top + plotHeight - (val / maxY) * plotHeight;
  };

  // Group and sort available codes by Theme, putting Non-Limitation at the very bottom
  const availableThemeGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return THEMES.map((theme) => {
      const isNonLimTheme = theme.id === "non-limitation";
      if (pickerCategory === "limitation" && isNonLimTheme) return null;
      if (pickerCategory === "non-limitation" && !isNonLimTheme) return null;

      const matchingCodes = temporalMatrix.codes
        .filter((c) => {
          if (selectedCodes.includes(c)) return false;
          const codeTheme = getThemeByCode(c);
          if (codeTheme.id !== theme.id) return false;
          if (!q) return true;
          const cleanName = c.replace(/^Non-Limitation:\s*/i, "").toLowerCase();
          return cleanName.includes(q) || c.toLowerCase().includes(q);
        })
        .sort((a, b) => a.localeCompare(b));

      if (matchingCodes.length === 0) return null;

      return {
        theme,
        codes: matchingCodes,
      };
    }).filter(Boolean) as { theme: ThemeDefinition; codes: string[] }[];
  }, [selectedCodes, searchQuery, pickerCategory]);

  const totalAvailableCount = useMemo(() => {
    return availableThemeGroups.reduce((acc, g) => acc + g.codes.length, 0);
  }, [availableThemeGroups]);

  // Mandate line positions: EMNLP 2022 and ACL 2023
  const emnlpMandateX = xForYear(2022);
  const aclMandateX = xForYear(2023);

  // Smooth Catmull-Rom to Cubic Bezier curve path generator
  const createSmoothPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  // Active series lines data (all lines use uniform, robust thickness and reliable Non-Limitation flag)
  const seriesList = useMemo(() => {
    return selectedCodes.map((code, idx) => {
      const color = PALETTE[idx % PALETTE.length];
      const isNonLim =
        code.startsWith("Non-Limitation") ||
        code.startsWith("NL:") ||
        getThemeByCode(code).id === "non-limitation";
      const displayName = isNonLim
        ? code.replace(/^Non-Limitation:\s*/i, "").replace(/^NL:\s*/i, "")
        : code;
      const cData = temporalMatrix.codeData[code]?.[venue] || {};
      const points = years.map((y) => {
        const pt = cData[String(y)] || { count: 0, total: 0, pct: 0 };
        const val = metric === "pct" ? pt.pct : pt.count;
        return {
          year: y,
          x: xForYear(y),
          y: yForVal(val),
          val,
          count: pt.count,
          pct: pt.pct,
          total: pt.total,
        };
      });
      const pathD = createSmoothPath(points);
      return {
        code,
        displayName,
        isNonLim,
        color,
        points,
        pathD,
      };
    });
  }, [selectedCodes, venue, metric, maxY, years]);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const ticksCount = 5;
    const step = maxY / ticksCount;
    return Array.from({ length: ticksCount + 1 }, (_, i) => Math.round(i * step));
  }, [maxY]);

  const activeSpotlightSeries = useMemo(() => {
    if (!spotlightCode) return null;
    return seriesList.find((s) => s.code === spotlightCode) || null;
  }, [spotlightCode, seriesList]);

  return (
    <div class="temporal-hero-card" id="temporal-chart-root">
      {/* Narrative Headline */}
      <div class="temporal-header">
        <div class="header-text-block">
          <div class="section-tag-row">
            <span class="section-kpi-badge">RQ1 · Temporal Evolution</span>
            <span class="section-corpus-pill">2020–2025 · 16,047 Papers</span>
          </div>
          <h3 class="temporal-title">The Policy Divergence &amp; The Rise of Scope Bounding</h3>
          <p class="temporal-lead">
            {venue === "all" && (
              <>
                The mandatory Limitations section was introduced sequentially: first at <strong>EMNLP 2022</strong>, 
                followed by <strong>ACL 2023</strong>. Across the combined corpus, <strong>Scope Limitation</strong> surged 
                dramatically from <strong>31.1%</strong> to <strong>65.9%</strong>, overtaking <strong>Methodological Constraints</strong> (peaked at 66.7% in 2021 before declining to 37.1%).
              </>
            )}
            {venue === "acl" && (
              <>
                At ACL, the section was encouraged in 2022 and became <strong>mandatory at ACL 2023</strong> (papers with limitations sections surged from 92 to 1,938). 
                <strong> Scope Limitation</strong> leaped to <strong>59.5%</strong> in 2023 and <strong>65.5%</strong> by 2025, 
                while <strong>Methodological Constraints</strong> dropped from 64.7% to 37.0%.
              </>
            )}
            {venue === "emnlp" && (
              <>
                At EMNLP, the policy was introduced earlier at <strong>EMNLP 2022</strong> (papers with limitations sections jumped from 50 to 1,345). 
                <strong> Scope Limitation</strong> immediately surged from <strong>30.0% (2021)</strong> to <strong>55.2% (2022)</strong> and reached <strong>66.4%</strong> by 2025.
              </>
            )}
          </p>
        </div>

        {/* Causal & Staggered Rollout Interpretation Caveat Banner */}
        <div class="causal-caveat-box">
          <div class="causal-caveat-title">
            <span class="caveat-icon">⚠️</span>
            <span>Policy Timing &amp; Causal Interpretation (§4.2)</span>
          </div>
          <p class="causal-caveat-text">
            The mandatory policy took effect at <strong>EMNLP in late 2022</strong> and at <strong>ACL in mid-2023</strong>. In both venues, the sharp surge in Scope Limitation aligned with the exact year the section was mandated, though this period also coincided with the rapid ascent of LLMs.
          </p>
        </div>
      </div>

      {/* Preset Pills Toolbar (Cognitive Scaffolding) */}
      <div class="presets-toolbar">
        <span class="presets-label">Exploratory Lenses:</span>
        <div class="presets-pills-row" role="tablist">
          {THEMATIC_PRESETS.map((p) => {
            const isActive = activePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                class={`preset-pill ${isActive ? "preset-pill-active" : ""}`}
                onClick={() => handleSelectPreset(p.id)}
                title={p.description}
              >
                {p.badge && <span class="pill-badge">{p.badge}</span>}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Options Bar: Chips, Visual Legend, Scale, Venue, Metric */}
      <div class="chart-controls-bar">
        {/* Active Series Chips */}
        <div class="active-chips-container">
          <span class="chips-label">Plotted ({selectedCodes.length}/10):</span>
          <div class="active-chips-wrap">
            {seriesList.map((s) => {
              const isSpotlighted = spotlightCode === s.code;
              return (
                <div
                  key={s.code}
                  class={`active-code-chip ${isSpotlighted ? "chip-spotlighted" : ""} ${s.isNonLim ? "chip-discourse" : ""}`}
                  style={{ "--series-color": s.color } as JSX.CSSProperties}
                  onMouseEnter={() => setSpotlightCode(s.code)}
                  onMouseLeave={() => setSpotlightCode(null)}
                  title={`Hover to spotlight line. Click to filter "${s.displayName}" across all years.`}
                  onClick={() => navigateToExplore(s.code)}
                >
                  <span
                    class={`chip-color-bullet ${s.isNonLim ? "bullet-discourse" : ""}`}
                    style={{
                      backgroundColor: s.isNonLim ? "transparent" : s.color,
                      borderColor: s.color,
                    }}
                  ></span>
                  <span class="chip-name">{s.displayName}</span>
                  {s.isNonLim && <span class="chip-type-tag">Non-Limitation</span>}
                  {selectedCodes.length > 1 && (
                    <button
                      type="button"
                      class="chip-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCode(s.code);
                      }}
                      title={`Remove ${s.displayName} from chart`}
                      aria-label={`Remove ${s.displayName}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}

            {/* "+ Add Code" Popover Trigger */}
            {selectedCodes.length < 10 && (
              <div class="add-code-dropdown-wrap">
                <button
                  type="button"
                  class="add-code-trigger-btn"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  title="Compare another code grouped by theme (up to 10 simultaneous lines)"
                >
                  <span class="plus-icon">+</span>
                  <span>Compare other code...</span>
                </button>

                {isPickerOpen && (
                  <div class="code-picker-popover">
                    <div class="picker-search-wrap">
                      <input
                        type="text"
                        class="picker-search-input"
                        placeholder="Search codes across themes..."
                        value={searchQuery}
                        onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                        autoFocus
                      />
                    </div>

                    {/* Filter Category Tabs */}
                    <div class="picker-tabs-row" role="tablist">
                      <button
                        type="button"
                        class={`picker-tab-btn ${pickerCategory === "all" ? "picker-tab-active" : ""}`}
                        onClick={() => setPickerCategory("all")}
                      >
                        All Themes (50)
                      </button>
                      <button
                        type="button"
                        class={`picker-tab-btn ${pickerCategory === "limitation" ? "picker-tab-active" : ""}`}
                        onClick={() => setPickerCategory("limitation")}
                      >
                        Limitations (40)
                      </button>
                      <button
                        type="button"
                        class={`picker-tab-btn ${pickerCategory === "non-limitation" ? "picker-tab-active" : ""}`}
                        onClick={() => setPickerCategory("non-limitation")}
                      >
                        Non-Limitation (10)
                      </button>
                    </div>

                    <div class="picker-list">
                      {availableThemeGroups.map((group) => {
                        const isNonLim = group.theme.id === "non-limitation";
                        return (
                          <div key={group.theme.id} class="picker-theme-group">
                            <div
                              class="picker-theme-header"
                              style={{ borderLeftColor: group.theme.color }}
                            >
                              <span
                                class="theme-num-tag"
                                style={{
                                  backgroundColor: group.theme.bgLight,
                                  color: group.theme.color,
                                  borderColor: group.theme.borderColor,
                                }}
                              >
                                {group.theme.number > 0 ? `Theme ${group.theme.number}` : "Non-Limitation"}
                              </span>
                              <span class="theme-title-text">{group.theme.shortTitle}</span>
                              <span class="theme-count-tag">({group.codes.length})</span>
                            </div>

                            <div class="picker-group-codes">
                              {group.codes.map((c) => {
                                const cleanName = c.replace(/^Non-Limitation:\s*/i, "");
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    class={`picker-item-btn ${isNonLim ? "item-discourse" : ""}`}
                                    onClick={() => handleAddCode(c)}
                                  >
                                    <span class="item-plus">+</span>
                                    <span class="item-name">{cleanName}</span>
                                    <span
                                      class={`item-badge ${isNonLim ? "badge-discourse" : "badge-limitation"}`}
                                      style={!isNonLim ? { borderLeft: `3px solid ${group.theme.color}` } : undefined}
                                    >
                                      {isNonLim ? "Non-Limitation" : `T${group.theme.number}`}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      {totalAvailableCount === 0 && (
                        <div class="picker-empty">No matching codes found.</div>
                      )}
                    </div>
                    <button
                      type="button"
                      class="picker-close-btn"
                      onClick={() => setIsPickerOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View Switchers & Legend Pill */}
        <div class="view-switchers-group">
          {/* Visual Key: Solid (Limitation) vs Dashed (Non-Limitation) */}
          <div class="line-style-legend-pill" title="Limitations use solid lines. Non-limitation rhetorical buffers use dashed lines.">
            <span class="legend-style-item">
              <svg width="22" height="10" viewBox="0 0 22 10" class="legend-line-svg" aria-hidden="true">
                <line x1="0" y1="5" x2="22" y2="5" stroke="#475569" stroke-width="3" stroke-linecap="round" />
              </svg>
              <span>Limitations (Solid)</span>
            </span>
            <span class="legend-style-sep">·</span>
            <span class="legend-style-item">
              <svg width="22" height="10" viewBox="0 0 22 10" class="legend-line-svg" aria-hidden="true">
                <line x1="0" y1="5" x2="22" y2="5" stroke="#7c3aed" stroke-width="3" stroke-dasharray="6,4" stroke-linecap="round" />
              </svg>
              <span>Non-Limitations (Dashed)</span>
            </span>
          </div>

          {/* Dynamic Auto-Scale Toggle */}
          <div class="control-segment">
            <span class="segment-label">Scale:</span>
            <div class="segmented-btn-group">
              <button
                type="button"
                class={`seg-btn ${autoScaleY ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setAutoScaleY(true);
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
                title="Auto-zoom Y axis to the highest active line so lower-prevalence lines are clearly visible"
              >
                Auto-Zoom
              </button>
              <button
                type="button"
                class={`seg-btn ${!autoScaleY ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setAutoScaleY(false);
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
                title="Fixed scale (up to 75%+) for standard absolute baseline comparisons"
              >
                Fixed
              </button>
            </div>
          </div>

          <div class="control-segment">
            <span class="segment-label">Venue:</span>
            <div class="segmented-btn-group">
              <button
                type="button"
                class={`seg-btn ${venue === "all" ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setVenue("all");
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
              >
                All
              </button>
              <button
                type="button"
                class={`seg-btn ${venue === "acl" ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setVenue("acl");
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
              >
                ACL
              </button>
              <button
                type="button"
                class={`seg-btn ${venue === "emnlp" ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setVenue("emnlp");
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
              >
                EMNLP
              </button>
            </div>
          </div>

          <div class="control-segment">
            <span class="segment-label">Metric:</span>
            <div class="segmented-btn-group">
              <button
                type="button"
                class={`seg-btn ${metric === "pct" ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setMetric("pct");
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
              >
                %
              </button>
              <button
                type="button"
                class={`seg-btn ${metric === "count" ? "seg-btn-active" : ""}`}
                onClick={() => {
                  setMetric("count");
                  setSpotlightCode(null);
                  setHoveredDot(null);
                  setHoveredYear(null);
                }}
              >
                Count
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main SVG Visualization Canvas */}
      <div class="temporal-canvas-wrapper">
        {/* Floating Line Hover Indicator (Shows when hovering on a line without hovering a dot) */}
        {activeSpotlightSeries && !hoveredDot && (
          <div class="temporal-line-floating-pill">
            <span
              class="line-pill-bullet"
              style={{ backgroundColor: activeSpotlightSeries.color }}
            ></span>
            <span class="line-pill-name">{activeSpotlightSeries.displayName}</span>
            <span class="line-pill-type">
              {activeSpotlightSeries.isNonLim ? "Non-Limitation" : "Limitation"}
            </span>
            <span class="line-pill-hint">Click line to explore across all years (2020–2025) ↗</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          class="temporal-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Temporal prevalence trends chart for NLP limitation codes (2020–2025)"
          onMouseLeave={() => {
            setHoveredYear(null);
            setSpotlightCode(null);
            setHoveredDot(null);
          }}
        >
          <defs>
            <linearGradient id="mandateLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Horizontal Grid lines & Y Axis Labels */}
          {yTicks.map((val) => {
            const yPos = yForVal(val);
            return (
              <g key={val} class="grid-row">
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={padding.left + plotWidth}
                  y2={yPos}
                  stroke="#e2e8f0"
                  stroke-width="1"
                  stroke-dasharray={val === 0 ? "none" : "3,3"}
                />
                <text
                  x={padding.left - 12}
                  y={yPos + 4}
                  textAnchor="end"
                  class="axis-tick-label"
                >
                  {val}{metric === "pct" ? "%" : ""}
                </text>
              </g>
            );
          })}

          {/* Policy Mandate Boundary Markers (EMNLP 2022 vs ACL 2023) */}
          {(venue === "all" || venue === "emnlp") && (
            <g class="policy-mandate-marker mandate-emnlp">
              <line
                x1={emnlpMandateX}
                y1={padding.top}
                x2={emnlpMandateX}
                y2={padding.top + plotHeight}
                stroke="#7c3aed"
                stroke-width="2"
                stroke-dasharray="5,4"
                opacity="0.85"
              />
              <g transform={`translate(${emnlpMandateX + 6}, ${padding.top + 16})`}>
                <rect
                  x="0"
                  y="-14"
                  width="144"
                  height="22"
                  rx="4"
                  fill="#f5f3ff"
                  stroke="#c4b5fd"
                  stroke-width="1"
                />
                <text x="6" y="1" class="mandate-badge-text" fill="#6d28d9">
                  EMNLP 2022 Mandate
                </text>
              </g>
            </g>
          )}

          {(venue === "all" || venue === "acl") && (
            <g class="policy-mandate-marker mandate-acl">
              <line
                x1={aclMandateX}
                y1={padding.top}
                x2={aclMandateX}
                y2={padding.top + plotHeight}
                stroke="#2563eb"
                stroke-width="2"
                stroke-dasharray="5,4"
                opacity="0.85"
              />
              <g transform={`translate(${aclMandateX + 6}, ${venue === "all" ? padding.top + 42 : padding.top + 16})`}>
                <rect
                  x="0"
                  y="-14"
                  width="134"
                  height="22"
                  rx="4"
                  fill="#eff6ff"
                  stroke="#bfdbfe"
                  stroke-width="1"
                />
                <text x="6" y="1" class="mandate-badge-text" fill="#1d4ed8">
                  ACL 2023 Mandate
                </text>
              </g>
            </g>
          )}

          {/* Hover Crosshair Column (Visible when hovering empty column space) */}
          {hoveredYear !== null && spotlightCode === null && (
            <line
              x1={xForYear(hoveredYear)}
              y1={padding.top}
              x2={xForYear(hoveredYear)}
              y2={padding.top + plotHeight}
              stroke="#0f172a"
              stroke-width="1.5"
              stroke-dasharray="4,4"
              opacity="0.5"
            />
          )}

          {/* Layer 1: X-Axis Years & Background Column Hit Areas (Handles empty space clicks to explore whole year) */}
          {years.map((y) => {
            const xPos = xForYear(y);
            const isColumnHovered = hoveredYear === y && spotlightCode === null;
            return (
              <g key={y} class="x-axis-hit-group">
                {/* Background column highlight & empty space hit area */}
                <rect
                  x={xPos - plotWidth / (years.length * 2)}
                  y={padding.top}
                  width={plotWidth / years.length}
                  height={plotHeight + 35}
                  fill={isColumnHovered ? "rgba(241, 245, 249, 0.65)" : "transparent"}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    if (spotlightCode === null) {
                      setHoveredYear(y);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoveredYear === y) {
                      setHoveredYear(null);
                    }
                  }}
                  onClick={() => {
                    // Empty space click navigates to explore all papers in that year
                    navigateToExploreYearOnly(y);
                  }}
                >
                  <title>{`Click empty space to explore all papers in ${y}`}</title>
                </rect>

                {/* X Axis Year Label */}
                <text
                  x={xPos}
                  y={padding.top + plotHeight + 25}
                  textAnchor="middle"
                  class={`axis-x-label ${hoveredYear === y ? "axis-x-label-active" : ""}`}
                >
                  {y}
                </text>
              </g>
            );
          })}

          {/* Layer 2: Series Visible Smooth Spline Curves */}
          {seriesList.map((s) => {
            const isDimmed = spotlightCode !== null && spotlightCode !== s.code;
            const isHighlighted = spotlightCode === s.code;

            return (
              <path
                key={`vis-${s.code}`}
                d={s.pathD}
                fill="none"
                stroke={s.color}
                stroke-width={isHighlighted ? 5.2 : 3.8}
                stroke-dasharray={s.isNonLim ? "10 6" : "none"}
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
                class={s.isNonLim ? "temporal-path-nonlim" : "temporal-path-lim"}
                pointerEvents="none"
                style={{
                  strokeWidth: isHighlighted ? "5.2px" : "3.8px",
                  strokeDasharray: s.isNonLim ? "10px 6px" : "none",
                  opacity: isDimmed ? 0.35 : 1,
                  transition: "opacity 0.2s ease, stroke-width 0.15s ease",
                }}
              />
            );
          })}

          {/* Layer 3: Invisible Wide Hit Paths (24px wide for effortless line hovering & clicking) */}
          {seriesList.map((s) => (
            <path
              key={`hit-${s.code}`}
              d={s.pathD}
              fill="none"
              stroke="transparent"
              stroke-width="24"
              stroke-linecap="round"
              stroke-linejoin="round"
              pointerEvents="stroke"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => {
                setSpotlightCode(s.code);
                setHoveredDot(null);
              }}
              onMouseLeave={() => {
                setSpotlightCode(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigateToExplore(s.code);
              }}
            >
              <title>{`Click line to explore all papers with "${s.displayName}" across 2020–2025`}</title>
            </path>
          ))}

          {/* Layer 4: Interactive Point Markers (Circles) */}
          {seriesList.map((s) => {
            const isDimmed = spotlightCode !== null && spotlightCode !== s.code;
            const isHighlighted = spotlightCode === s.code;

            return (
              <g
                key={`dots-${s.code}`}
                style={{
                  opacity: isDimmed ? 0.35 : 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                {s.points.map((pt) => {
                  const isThisDotHovered = hoveredDot?.code === s.code && hoveredDot?.year === pt.year;
                  const isYearActive = hoveredYear === pt.year;

                  return (
                    <circle
                      key={pt.year}
                      cx={pt.x}
                      cy={pt.y}
                      r={isThisDotHovered ? 9 : (isHighlighted ? 7.2 : (isYearActive ? 6.5 : 5.2))}
                      fill={s.isNonLim ? "#ffffff" : s.color}
                      stroke={s.isNonLim ? s.color : "#ffffff"}
                      stroke-width={s.isNonLim ? 3.5 : 2}
                      vector-effect="non-scaling-stroke"
                      class="series-dot"
                      style={{
                        strokeWidth: s.isNonLim ? "3.5px" : "2px",
                        cursor: "pointer",
                        pointerEvents: "all",
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setSpotlightCode(s.code);
                        setHoveredYear(pt.year);
                        setHoveredDot({
                          code: s.code,
                          displayName: s.displayName,
                          isNonLim: s.isNonLim,
                          color: s.color,
                          year: pt.year,
                          x: pt.x,
                          y: pt.y,
                          val: pt.val,
                          count: pt.count,
                          pct: pt.pct,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredDot(null);
                        setSpotlightCode(null);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToExplore(s.code, pt.year);
                      }}
                    >
                      <title>{`Click dot to explore ${s.displayName} in ${pt.year} (${pt.count.toLocaleString()} papers)`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Focused Dot Tooltip (Anchored above the specific hovered dot) */}
        {hoveredDot && (
          <div
            class="temporal-dot-tooltip"
            style={{
              left: `${(hoveredDot.x / svgWidth) * 100}%`,
              top: `${(hoveredDot.y / svgHeight) * 100}%`,
            }}
          >
            <div class="dot-tip-header">
              <span class="dot-tip-badge" style={{ backgroundColor: hoveredDot.color }}></span>
              <span class="dot-tip-title">{hoveredDot.displayName}</span>
              <span class="dot-tip-year">({hoveredDot.year})</span>
            </div>
            <div class="dot-tip-stat">
              <strong>{metric === "pct" ? `${hoveredDot.pct.toFixed(1)}%` : `${hoveredDot.count.toLocaleString()} p.`}</strong>
              <span class="dot-tip-total">
                of {temporalMatrix.totals[venue][String(hoveredDot.year)].toLocaleString()} papers
              </span>
            </div>
            <div class="dot-tip-action">
              <span>Click dot to explore in {hoveredDot.year} ↗</span>
            </div>
          </div>
        )}

        {/* Column Scrubbing Tooltip (Shown when hovering empty space in a year column) */}
        {hoveredYear !== null && spotlightCode === null && !hoveredDot && (
          <div
            class="temporal-scrub-tooltip"
            style={{
              left: `${(xForYear(hoveredYear) / svgWidth) * 100}%`,
            }}
          >
            <div class="tooltip-header">
              <span class="tooltip-year">{hoveredYear}</span>
              <span class="tooltip-venue">
                {venue === "all" ? "All Venues" : venue.toUpperCase()} ·{" "}
                {temporalMatrix.totals[venue][String(hoveredYear)].toLocaleString()} Papers
              </span>
            </div>
            <div class="tooltip-rows">
              {seriesList
                .map((s) => {
                  const pt = s.points.find((p) => p.year === hoveredYear);
                  return {
                    code: s.code,
                    displayName: s.displayName,
                    isNonLim: s.isNonLim,
                    color: s.color,
                    val: pt?.val ?? 0,
                    count: pt?.count ?? 0,
                    pct: pt?.pct ?? pt?.val ?? 0,
                  };
                })
                .sort((a, b) => b.val - a.val)
                .map((item) => (
                  <div key={item.code} class="tooltip-row">
                    <span
                      class={`row-bullet ${item.isNonLim ? "bullet-discourse" : ""}`}
                      style={{
                        backgroundColor: item.isNonLim ? "transparent" : item.color,
                        borderColor: item.color,
                      }}
                    ></span>
                    <span class="row-name">
                      {item.displayName}
                      {item.isNonLim && <span class="tip-cat-tag">Non-Limitation</span>}
                    </span>
                    <strong class="row-stat">
                      {metric === "pct"
                        ? `${item.pct.toFixed(1)}%`
                        : `${item.count.toLocaleString()} p.`}
                    </strong>
                  </div>
                ))}
            </div>
            <div class="tooltip-footer">
              <span class="tip-subtext">💡 Click empty space to explore all papers in {hoveredYear} ↗</span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Data Table (Accessibility & Deep Data Verification) */}
      <div class="table-disclosure-wrapper">
        <button
          type="button"
          class="disclosure-toggle-btn"
          onClick={() => setShowTable(!showTable)}
        >
          <span>{showTable ? "Hide data table" : "Show exact numbers table (16,047 papers)"}</span>
          <span class="chevron">{showTable ? "▲" : "▼"}</span>
        </button>

        {showTable && (
          <div class="temporal-table-wrap">
            <table class="temporal-data-table">
              <thead>
                <tr>
                  <th>Code / Category</th>
                  {years.map((y) => (
                    <th key={y} class="num-col">
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seriesList.map((s) => (
                  <tr key={s.code}>
                    <td class="code-cell">
                      <span
                        class={`cell-bullet ${s.isNonLim ? "bullet-discourse" : ""}`}
                        style={{
                          backgroundColor: s.isNonLim ? "transparent" : s.color,
                          borderColor: s.color,
                        }}
                      ></span>
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(s.code)}`}
                        class="table-code-link"
                        title={`Filter explore for ${s.displayName}`}
                      >
                        {s.displayName}
                      </a>
                      {s.isNonLim && <span class="table-cat-badge">Non-Limitation</span>}
                    </td>
                    {s.points.map((p) => (
                      <td key={p.year} class="num-col">
                        <span class="main-val">{p.pct.toFixed(1)}%</span>
                        <span class="count-sub">({p.count.toLocaleString()})</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
