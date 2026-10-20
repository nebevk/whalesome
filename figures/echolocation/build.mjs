// Fig 1 · Echolocation. A sonar test tank built like a dolphin's head.
//
//   ANATOMY_KIT=/path/to/anatomy node figures/echolocation/build.mjs [--standalone] [--light] [--out path.html]
//
// By default this writes the embed build the site uses, public/figures/echolocation.html:
// no page chrome, no caption (pages/anatomy.vue renders it), and it reports its height to
// the parent page. --standalone writes a full preview page next to this script instead.
//
// The Anatomy kit (MIT, https://github.com/wheresryan22/anatomy) is not vendored: clone it
// and point ANATOMY_KIT at the clone. This figure was built against commit 1482e84.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as M from "./model.mjs";

const KIT = process.env.ANATOMY_KIT;
if (!KIT || !existsSync(join(KIT, "kit", "iso-kit.mjs"))) {
  console.error("Set ANATOMY_KIT to a clone of https://github.com/wheresryan22/anatomy");
  process.exit(1);
}
const fromKit = (path) => import(pathToFileURL(join(KIT, path)).href);
const k = await fromKit("kit/iso-kit.mjs");
const G = await fromKit("kit/lathe.mjs");
const { kitScript } = await fromKit("scripts/inline-kit.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const theme = argv.includes("--light") ? "light" : "dark";
const embed = !argv.includes("--standalone");
const outAt = argv.indexOf("--out");
const OUT = outAt >= 0
  ? argv[outAt + 1]
  : embed
    ? join(HERE, "..", "..", "public", "figures", "echolocation.html")
    : join(HERE, theme === "light" ? "echolocation-light.html" : "echolocation.html");

const WIDTH = 600;
const HEIGHT = 300;
const RAD = Math.PI / 180;
const AZIMUTH = 60;

// ---------------------------------------------------------------------------
// World. x runs down the tank toward the fish, y across it, z up; 1 unit ~ 1 px.
// x = 0 is the tip of the lens: the zero of the range ruler.
const UPM = 5; // world units per metre of range
const Z_AX = 28; // beam axis
const WL = 46; // water level
const TAN = Math.tan((M.BEAM_DEG / 2) * RAD); // half the -3 dB beam
const RING0 = 8; // beam radius as it leaves the lens
const RING_MAX = 15; // the drawn beam stays inside the tank

const PLATE = { x: -108, y: -34, w: 318, d: 68, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;
const PED = { x: -102, y: -21, w: 86, d: 42, r: 3 };
const PED_H = 4;
const FRAME = { x: -16, y: -24, w: 212, d: 48, r: 2 }; // tank frame footprint, x -16..196
const GL = { x0: -14, x1: 194, y0: -22, y1: 22 }; // the glass panes' planes
const BOT = 8; // top of the bottom rails
const RAIL_Z = 50;
const RAIL_TOP = 54;

const EAR = [-78, 0];
const EAR_R = 17;
const EAR_Z0 = 12;
const EAR_TOP = 25;
const JAW_Z0 = 12;
const JAW_H = 5;
const LENS_R = 9;
const LENS_L = 14; // the dome in the water, from the end pane (x -14) to the tip (x 0)

const DIAL_GAP = Math.atan2(Math.cos(AZIMUTH * RAD), -Math.sin(AZIMUTH * RAD)); // plan direction toward the viewer
const DIAL_SPAN = 270 * RAD;
const DIAL_FROM = DIAL_GAP + (360 * RAD - DIAL_SPAN) / 2;
const DIAL_TICK_R = EAR_R - 2.4;

const FISH_L = 24;
const FISH_R = 5.4;
const FISH_A = FISH_R / (Math.sqrt(0.4) * Math.pow(0.6, 0.75));
const FISH_MID = 12; // where the strut holds the fish, from its nose
const fishR = (s) => {
  const u = s / FISH_L;
  return FISH_A * Math.sqrt(u) * Math.pow(1 - u, 0.75);
};
const fishSlope = (s) => {
  const u = s / FISH_L;
  return (FISH_A / FISH_L) * (0.5 * Math.pow(u, -0.5) * Math.pow(1 - u, 0.75) - 0.75 * Math.sqrt(u) * Math.pow(1 - u, -0.25));
};
const FISH_TOP = fishR(FISH_MID);
const BRIDGE_Z = 57.5;

const START_M = 8;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...k.boxCorners(FRAME, 0, RAIL_TOP),
    [M.RANGE[0] * UPM + FISH_MID, 17, BRIDGE_Z + 7],
    [M.RANGE[1] * UPM + FISH_MID, 17, BRIDGE_Z + 7],
    [-32, 0, 50],
  ],
  WIDTH,
  HEIGHT,
  { pad: 20, azimuth: AZIMUTH },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const poly = (points) => k.pathOf(points.map(at), true);
// A rounded rectangle drawn on a vertical face that faces +y, as one closed outline.
function faceRect(x0, x1, y, z0, z1, r) {
  const points = [];
  const corner = (cx, cz, from) => { for (let i = 0; i <= 4; i++) { const a = from + (i / 4) * (Math.PI / 2); points.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); } };
  corner(x1 - r, z0 + r, -Math.PI / 2); corner(x1 - r, z1 - r, 0); corner(x0 + r, z1 - r, Math.PI / 2); corner(x0 + r, z0 + r, Math.PI);
  return poly(points);
}
const slab = (plan, z, h, tone = "mid", steps = 4, bevel = 0.5, extra = {}) => S(k.slabOf(plan, z, h, P, steps, bevel), { tone, ...extra });
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// A coil spring standing on z, split into the half behind its axis and the half in front.
function vcoil(cx, cy, r, z0, z1, turns, perTurn = 18) {
  const count = Math.round(turns * perTurn);
  const back = [];
  const front = [];
  let run = [];
  let near = null;
  const flush = () => run.length > 1 && (near ? front : back).push(k.pathOf(run));
  for (let index = 0; index <= count; index++) {
    const angle = (index / count) * turns * Math.PI * 2;
    const flat = at([cx + r * Math.cos(angle), cy + r * Math.sin(angle), z0 + ((z1 - z0) * index) / count]);
    const facing = k.depthOf([Math.cos(angle), Math.sin(angle), 0], P) > 0;
    if (near === null) near = facing;
    if (facing !== near) {
      run.push(flat);
      flush();
      run = [flat];
      near = facing;
    } else run.push(flat);
  }
  flush();
  return { back: back.join(""), front: front.join("") };
}

// A gradient that runs down a vertical pane at y, perpendicular to its waterline on screen.
function paneGradient(id, y, zTop, zBottom) {
  const top = at([GL.x0, y, zTop]);
  const along = at([GL.x0 + 1, y, zTop]);
  const bottom = at([GL.x0, y, zBottom]);
  const ux = along[0] - top[0];
  const uy = along[1] - top[1];
  const n = Math.hypot(ux, uy);
  const nx = -uy / n;
  const ny = ux / n;
  const depth = (bottom[0] - top[0]) * nx + (bottom[1] - top[1]) * ny;
  const f = (v) => v.toFixed(2);
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(top[0])}" y1="${f(top[1])}" x2="${f(top[0] + nx * depth)}" y2="${f(top[1] + ny * depth)}"><stop offset="0" style="stop-color:var(--eco-deep-top)"/><stop offset="1" style="stop-color:var(--eco-deep-bottom)"/></linearGradient>`;
}

// ---------------------------------------------------------------------------
function base() {
  const out = [`<defs>${paneGradient("eco-deep", GL.y0, WL, BOT)}</defs>`];
  out.push(`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`);
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate, front left
  const label = { x: -101, y: 23.5, w: 30, d: 8.5, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[26.1, 19], [27.9, 13], [29.7, 16]].map(([y, w]) => k.lineOnTop([label.x + 4, y], [label.x + 4 + w, y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 2.4, label.y + 4.25, 0.8]), at([label.x + label.w - 2.4, label.y + 4.25, 0.8])], { size: 0.45 }));
  // pedestal under the head, and the tank's base frame
  out.push(S(k.slabOf(PED, 0, PED_H, P, 6, 0.6), { tone: "mid" }));
  out.push(D(k.corners(PED, 3.4).map(([x, y]) => at([x, y, PED_H])), { size: 0.45 }));
  out.push(S(k.slabOf(FRAME, 0, 4, P, 4, 0.6), { tone: "mid" }));
  return out.join("");
}

const post = (x, y) => slab({ x, y, w: 2, d: 2, r: 0.5 }, 4, RAIL_Z - 4, "mid", 2, 0.3);

// The far side of the tank: back posts, back bottom rail, the back pane and the back top rail.
function tankBack() {
  const out = [];
  out.push(post(FRAME.x, FRAME.y), post(GL.x1, FRAME.y));
  out.push(slab({ x: GL.x0, y: FRAME.y, w: GL.x1 - GL.x0, d: 2, r: 0.5 }, 4, BOT - 4, "mid", 2, 0.3));
  out.push(`<path class="eco-pane" d="${poly([[GL.x0, GL.y0, BOT], [GL.x1, GL.y0, BOT], [GL.x1, GL.y0, RAIL_Z], [GL.x0, GL.y0, RAIL_Z]])}"/>`);
  out.push(`<path fill="url(#eco-deep)" d="${poly([[GL.x0, GL.y0, BOT], [GL.x1, GL.y0, BOT], [GL.x1, GL.y0, WL], [GL.x0, GL.y0, WL]])}"/>`);
  out.push(slab({ x: FRAME.x, y: FRAME.y, w: FRAME.w, d: 4, r: 0.8 }, RAIL_Z, RAIL_TOP - RAIL_Z, "mid", 3, 0.5));
  // range marks on the tank floor, every 5 m, under the ruler's major ticks
  const marks = [];
  for (let m = 0; m <= M.RANGE[1]; m += 5) marks.push(k.segment([m * UPM, GL.y0, 4], [m * UPM, GL.y1, 4], P));
  out.push(L(marks.join(""), { tone: "faint" }));
  return out.join("");
}

// The ear: a capsule on four soft mounts, its top a dial that times the echo.
function ear() {
  const out = [];
  const [cx, cy] = EAR;
  const mounts = [15, 105, 195, 285].map((deg) => [cx + 12.5 * Math.cos(deg * RAD), cy + 12.5 * Math.sin(deg * RAD)]);
  for (const [x, y] of byDepth(mounts)) {
    const c = vcoil(x, y, 1.7, PED_H + 0.6, EAR_Z0 - 0.6, 4.5);
    out.push(L(c.back, { tone: "lo" }), L(c.front, { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 2.5, PED_H, 1, P, 20), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 2.5, EAR_Z0 - 1, 1, P, 20), { tone: "lo" }));
  }
  out.push(S(k.cylinder(cx, cy, EAR_R, EAR_Z0, EAR_TOP - EAR_Z0, P, 72, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(cx, cy, EAR_R, EAR_TOP - 3.6, EAR_TOP, 96, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(cx, cy, EAR_R, EAR_TOP - 3.6, P, 56), { tone: "faint" }));
  out.push(L(k.sideArc(cx, cy, EAR_R, EAR_Z0 + 3.2, P, 56), { tone: "faint" }));
  out.push(L(k.ring(cx, cy, DIAL_TICK_R, EAR_TOP, P, 80), { tone: "lo" }));
  const ticks = k.radialTicks(cx, cy, DIAL_TICK_R, 20, 5, EAR_TOP, [1.5, 3.1], P, DIAL_FROM, DIAL_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const zero = [Math.sin(DIAL_FROM), -Math.cos(DIAL_FROM)];
  out.push(L(k.lineOnTop([cx + zero[0] * (DIAL_TICK_R - 3.9), cy + zero[1] * (DIAL_TICK_R - 3.9)], [cx + zero[0] * DIAL_TICK_R, cy + zero[1] * DIAL_TICK_R], EAR_TOP, P), { tone: "hi" }));
  const gap = [Math.sin(DIAL_GAP), -Math.cos(DIAL_GAP)];
  out.push(k.faceTextSvg(k.topMatrix([cx + gap[0] * 7.6 - 0.3, cy + gap[1] * 7.6 + 1], EAR_TOP, P, "x"), "ms", { size: 3, tone: "lo", anchor: "middle" }));
  out.push(`<path data-part="ear-flash" class="iso-line" data-tone="red" d="${k.ring(cx, cy, DIAL_TICK_R, EAR_TOP, P, 80)}" style="opacity:0;stroke-width:1.3"/>`);
  return out.join("");
}

const needleAt = (ms) => {
  const share = Math.min(1, Math.max(0, ms / M.DIAL_MS));
  const angle = DIAL_FROM + share * DIAL_SPAN;
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  return k.lineOnTop([EAR[0] - sx * 3, EAR[1] - sy * 3], [EAR[0] + sx * (DIAL_TICK_R - 1.4), EAR[1] + sy * (DIAL_TICK_R - 1.4)], EAR_TOP + 0.2, P);
};

function dialTop() {
  return [
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="both" d="${needleAt(M.echoMs(START_M))}" style="stroke-width:1.2"/>`,
    L(k.ring(EAR[0], EAR[1], 1.8, EAR_TOP + 0.2, P, 20), { tone: "mid" }),
    D([at([EAR[0], EAR[1], EAR_TOP + 0.2])], { size: 0.65, tone: "hi" }),
  ].join("");
}

const XA = EAR[0] + Math.sqrt(EAR_R * EAR_R - 6 * 6); // where the jaw meets the capsule
const JAW_BACK = [[XA, -6], [-15.6, -5], [-15.6, 5], [XA, 6]];
const JAW_BACK_CORE = [[XA + 1.4, -4.2], [-15.6, -3.4], [-15.6, 3.4], [XA + 1.4, 4.2]];
const JAW_FRONT = [[-12.4, -5], [12, -2.3], [14.6, 0], [12, 2.3], [-12.4, 5]];
const JAW_FRONT_CORE = [[-12.4, -3.4], [10.2, -1.3], [10.2, 1.3], [-12.4, 3.4]];
const coreOf = (ring, part) => {
  const d = poly(ring.map(([x, y]) => [x, y, JAW_Z0 + JAW_H]));
  return L(d, { tone: "faint" }) + `<path data-part="${part}" class="iso-line" data-tone="red" d="${d}" style="opacity:0;stroke-width:1.2"/>`;
};

// The jaw: a fat-filled channel from the water back to the ear.
function jawBack() {
  const out = [];
  out.push(slab({ x: -44, y: -6.6, w: 7, d: 13.2, r: 1 }, PED_H, JAW_Z0 - PED_H, "mid", 3, 0.4));
  out.push(D([[-43, -5.2], [-38, -5.2], [-43, 5.2], [-38, 5.2]].map(([x, y]) => at([x, y, PED_H])), { size: 0.4 }));
  out.push(S(k.extrude(JAW_BACK, JAW_Z0, JAW_H, P), { tone: "hi", crease: "lo" }));
  out.push(coreOf(JAW_BACK_CORE, "core-back"));
  return out.join("");
}

// The head's dry side: the lens housing with the clicker and its air bellows on top.
const HOUSING = { x: -44, y: -11, w: 28.4, d: 22, r: 2 };
function head() {
  const out = [];
  out.push(S(k.slabOf(HOUSING, 18, 20, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(HOUSING, 28, P, 4), { tone: "faint" }) }));
  out.push(D(k.corners(HOUSING, 2.6).map(([x, y]) => at([x, y, 38])), { size: 0.45 }));
  const clicker = { x: -40, y: -6, w: 16, d: 12, r: 1.6 };
  out.push(slab(clicker, 38, 7, "mid", 4, 0.5));
  // a screwed access plate on the housing's side
  out.push(L(faceRect(-41, -24, HOUSING.y + HOUSING.d, 21, 26.6, 1.2), { tone: "lo" }), L(faceRect(-41, -24, HOUSING.y + HOUSING.d, 29.4, 35, 1.2), { tone: "lo" }));
  out.push(D([[-40, 22], [-25, 22], [-40, 25.6], [-25, 25.6], [-40, 30.4], [-25, 30.4], [-40, 34], [-25, 34]].map(([x, z]) => at([x, HOUSING.y + HOUSING.d, z])), { size: 0.4 }));
  out.push(slab({ x: -38, y: 6, w: 11, d: 2, r: 0.7 }, 39.3, 1.8, "hi", 3, 0, { crease: "lo" }));
  out.push(slab({ x: -38, y: 6, w: 11, d: 2, r: 0.7 }, 41.7, 1.8, "hi", 3, 0, { crease: "lo" }));
  const slit = k.segment([-37.6, 8, 41.4], [-27.4, 8, 41.4], P);
  out.push(L(slit, { tone: "lo" }), `<path data-part="slit" class="iso-line" data-tone="blue" d="${slit}" style="opacity:0;stroke-width:1.4"/>`);
  // bellows: the air sacs that drive the lips
  const B = { x: -37, y: -4.5, w: 9, d: 9, r: 1.4 };
  // the top pleat and the cap sink a little when the lips fire
  let z = 45;
  const top = [];
  for (let index = 0; index < 3; index++) {
    (index === 2 ? top : out).push(slab(index % 2 ? k.insetPlan(B, 0.9) : B, z, 1.8, "lo", 4, 0));
    z += 1.8;
  }
  top.push(slab(k.insetPlan(B, -0.7), z, 1.6, "mid", 4, 0.4));
  top.push(D([at([B.x + 0.6, B.y + 0.6, z + 1.6]), at([B.x + B.w - 0.6, B.y + B.d - 0.6, z + 1.6])], { size: 0.4 }));
  out.push(`<g data-part="bellows">${top.join("")}</g>`);
  return out.join("");
}

function startWire() {
  const angle = 22 * RAD;
  const to = at([EAR[0] + EAR_R * Math.cos(angle), EAR[1] + EAR_R * Math.sin(angle), 21.5]);
  return k.wireSvg(at([-40, -2.5, 44]), to, { via: [at([-48, 0.5, 35.5]), at([-55, 3.4, 28.5])], tone: "mid", size: 1.1 });
}

const F_LENS = G.frameAlong([GL.x0, 0, Z_AX], [1, 0, 0]);
const lensR = (s) => LENS_R * Math.sqrt(Math.max(0, 1 - (s / LENS_L) ** 2));
const lensSlope = (s) => (-LENS_R * (s / (LENS_L * LENS_L))) / Math.sqrt(Math.max(1e-6, 1 - (s / LENS_L) ** 2));

// Collars on the outside of the end pane, then the left end of the frame.
function leftEnd() {
  const out = [];
  out.push(slab({ x: -15.6, y: -7, w: 1.6, d: 14, r: 0.8 }, 11, 7, "mid", 3, 0.3));
  out.push(S(G.ringBand(-1.4, 0, LENS_R, LENS_R + 2.6, F_LENS, P), { tone: "mid" }));
  out.push(`<path class="eco-glass" d="${poly([[GL.x0, GL.y0, BOT], [GL.x0, GL.y1, BOT], [GL.x0, GL.y1, RAIL_Z], [GL.x0, GL.y0, RAIL_Z]])}"/>`);
  out.push(slab({ x: FRAME.x, y: GL.y0, w: 2, d: GL.y1 - GL.y0, r: 0.5 }, 4, BOT - 4, "mid", 2, 0.3));
  out.push(slab({ x: FRAME.x, y: -20, w: 2, d: 40, r: 0.5 }, RAIL_Z, RAIL_TOP - RAIL_Z, "mid", 2, 0.3));
  return out.join("");
}

function inWater() {
  const out = [];
  // jaw collar and the jaw's front, with its thin window (the pan bone)
  out.push(slab({ x: GL.x0, y: -7, w: 1.6, d: 14, r: 0.8 }, 11, 7, "mid", 3, 0.3));
  out.push(D([[-12.4, -5.6, 12.2], [-12.4, -5.6, 16.8], [-12.4, 5.6, 12.2], [-12.4, 5.6, 16.8]].map(at), { size: 0.4 }));
  out.push(S(k.extrude(JAW_FRONT, JAW_Z0, JAW_H, P), { tone: "hi", crease: "lo" }));
  out.push(coreOf(JAW_FRONT_CORE, "core-front"));
  const side = (t, z) => [-12.4 + 24.4 * t, 5 - 2.7 * t, z];
  out.push(L(poly([side(0.05, 13.3), side(0.45, 13.3), side(0.45, 15.7), side(0.05, 15.7)]), { tone: "lo" }));
  // the lens: collar on the end pane and the dome in the water
  out.push(S(G.ringBand(0, 1.4, LENS_R, LENS_R + 2.6, F_LENS, P), { tone: "mid" }));
  out.push(D(G.dotsOf(F_LENS, 1.4, LENS_R + 1.3, 8, P, { all: true }), { size: 0.42, tone: "mid" }));
  const knots = Array.from({ length: 13 }, (_, index) => {
    const s = 1.4 + (LENS_L - 0.08 - 1.4) * Math.sin(((index / 12) * Math.PI) / 2);
    return [s, lensR(s), 1];
  });
  const seams = [5.5, 9.8].map((s) => G.arcOf(F_LENS, s, lensR(s), P, { slope: lensSlope(s) })).join("");
  out.push(S(G.solidOf(knots, F_LENS, P, { smooth: { slope: lensSlope, rows: 3 } }), { tone: "hi", inner: L(seams, { tone: "faint" }) }));
  return out.join("");
}

function pulses() {
  return [
    `<path data-part="click-glow" class="eco-glow" data-tone="blue" d="" style="opacity:0"/>`,
    `<path data-part="click" class="iso-line" data-tone="blue" d="" style="opacity:0;stroke-width:1.2"/>`,
    `<path data-part="echo-glow" class="eco-glow" data-tone="red" d="" style="opacity:0"/>`,
    `<path data-part="echo" class="iso-line" data-tone="red" d="" style="opacity:0;stroke-width:1.2"/>`,
  ].join("");
}

// The target: a fish on a strut, all built with its nose at x = 0 and moved by translate.
const F_FISH = G.frameAlong([0, 0, Z_AX], [1, 0, 0]);
const F_TAIL = G.frameOf([0, 0, Z_AX], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
function fish() {
  const out = [];
  out.push(S(G.prismOf(F_TAIL, [[20.4, 0], [20.4, 1.7], [28.8, 7.2], [26.8, 0]], -0.5, 0.5, P), { tone: "hi", crease: "lo" }));
  out.push(S(G.prismOf(F_TAIL, [[20.4, 0], [26.8, 0], [28.8, -7.2], [20.4, -1.7]], -0.5, 0.5, P), { tone: "hi", crease: "lo" }));
  const knots = Array.from({ length: 16 }, (_, index) => {
    const s = 0.05 + (FISH_L * 0.9 - 0.05) * Math.pow(index / 15, 1.7);
    return [s, fishR(s), 1];
  });
  const gill = G.arcOf(F_FISH, 5.6, fishR(5.6), P, { slope: fishSlope(5.6) });
  out.push(S(G.solidOf(knots, F_FISH, P, { smooth: { slope: fishSlope, rows: 3 } }), { tone: "hi", inner: L(gill, { tone: "lo" }) }));
  const eye = 2.9;
  const er = fishR(eye);
  out.push(D([at([eye, er * Math.cos(32 * RAD), Z_AX + er * Math.sin(32 * RAD)])], { size: 0.9, tone: "hi" }));
  out.push(S(k.cylinder(FISH_MID, 0, 2.1, Z_AX + FISH_TOP - 0.8, 2, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(FISH_MID, 0, 1.15, Z_AX + FISH_TOP + 1.2, WL - (Z_AX + FISH_TOP + 1.2), P, 20), { tone: "mid", crease: "none" }));
  return out.join("");
}

function water() {
  return [
    `<path class="eco-water" d="${poly([[GL.x0, GL.y0, WL], [GL.x1, GL.y0, WL], [GL.x1, GL.y1, WL], [GL.x0, GL.y1, WL]])}"/>`,
    `<path class="eco-water" d="${poly([[GL.x0, GL.y1, BOT], [GL.x1, GL.y1, BOT], [GL.x1, GL.y1, WL], [GL.x0, GL.y1, WL]])}"/>`,
    `<path class="eco-water" d="${poly([[GL.x1, GL.y0, BOT], [GL.x1, GL.y1, BOT], [GL.x1, GL.y1, WL], [GL.x1, GL.y0, WL]])}"/>`,
    L(poly([[GL.x0, GL.y0, WL], [GL.x1, GL.y0, WL], [GL.x1, GL.y1, WL], [GL.x0, GL.y1, WL]]), { tone: "lo" }),
  ].join("");
}

function strutHigh() {
  return S(k.cylinder(FISH_MID, 0, 1.15, WL, BRIDGE_Z - 2 - WL, P, 20), { tone: "mid", crease: "none" });
}

function tankFront() {
  const out = [];
  out.push(`<path class="eco-glass" d="${poly([[GL.x0, GL.y1, WL], [GL.x1, GL.y1, WL], [GL.x1, GL.y1, RAIL_Z], [GL.x0, GL.y1, RAIL_Z]])}"/>`);
  out.push(`<path class="eco-glass" d="${poly([[GL.x1, GL.y0, WL], [GL.x1, GL.y1, WL], [GL.x1, GL.y1, RAIL_Z], [GL.x1, GL.y0, RAIL_Z]])}"/>`);
  out.push(L([[118, 128], [124, 133]].map(([a, b]) => k.segment([a, GL.y1, BOT], [b, GL.y1, RAIL_Z], P)).join(""), { tone: "faint" }));
  // right end: bottom rail, back post, top rail; then the front of the frame
  out.push(slab({ x: GL.x1, y: GL.y0, w: 2, d: GL.y1 - GL.y0, r: 0.5 }, 4, BOT - 4, "mid", 2, 0.3));
  out.push(slab({ x: GL.x0, y: GL.y1, w: GL.x1 - GL.x0, d: 2, r: 0.5 }, 4, BOT - 4, "mid", 2, 0.3));
  out.push(post(FRAME.x, GL.y1), post(GL.x1, GL.y1));
  out.push(slab({ x: GL.x1, y: -20, w: 2, d: 40, r: 0.5 }, RAIL_Z, RAIL_TOP - RAIL_Z, "mid", 2, 0.3));
  // the front top rail carries the range ruler, in metres from the lens tip
  out.push(slab({ x: FRAME.x, y: 20, w: FRAME.w, d: 4, r: 0.8 }, RAIL_Z, RAIL_TOP - RAIL_Z, "mid", 3, 0.5));
  const strip = { x: -4, y: 20.4, w: M.RANGE[1] * UPM + 8, d: 3.2, r: 0.7 };
  out.push(S(k.slabOf(strip, RAIL_TOP, 0.5, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(0, M.RANGE[1] * UPM, UPM, 5, strip.y + 0.25, RAIL_TOP + 0.5, [1.1, 2.3], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop([0, strip.y + 0.25], [0, strip.y + 2.9], RAIL_TOP + 0.5, P), { tone: "hi" }));
  out.push(D([at([FRAME.x + 1, 22, RAIL_TOP]), at([FRAME.x + FRAME.w - 1, 22, RAIL_TOP]), at([FRAME.x + FRAME.w - 1, -22, RAIL_TOP])], { size: 0.45 }));
  return out.join("");
}

function carriageTop() {
  const out = [];
  out.push(L(k.lineOnTop([0, 23.6], [0, 20.65], RAIL_TOP + 0.5, P), { tone: "hi" }));
  out.push(slab({ x: FISH_MID - 6, y: -24.4, w: 12, d: 4.8, r: 1 }, RAIL_TOP, BRIDGE_Z - RAIL_TOP, "mid", 3, 0.4));
  out.push(S(k.cylinder(FISH_MID, 0, 2.4, BRIDGE_Z - 2, 2, P, 24), { tone: "mid" }));
  out.push(slab({ x: FISH_MID - 6, y: 19.6, w: 12, d: 4.8, r: 1 }, RAIL_TOP, BRIDGE_Z - RAIL_TOP, "mid", 3, 0.4));
  out.push(slab({ x: -1.2, y: 24.4, w: FISH_MID - 2, d: 1.6, r: 0.6 }, RAIL_TOP + 0.6, 1.6, "hi", 3, 0, { crease: "lo" }));
  out.push(slab({ x: FISH_MID - 5, y: -25, w: 10, d: 50, r: 1.5 }, BRIDGE_Z, 3, "mid", 4, 0.5));
  out.push(D([[FISH_MID - 3.4, -23], [FISH_MID + 3.4, -23], [FISH_MID - 3.4, 23], [FISH_MID + 3.4, 23]].map(([x, y]) => at([x, y, BRIDGE_Z + 3])), { size: 0.45 }));
  out.push(S(k.cylinder(FISH_MID, 16, 2.6, BRIDGE_Z + 3, 3.6, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(FISH_MID, 16, 2.6, BRIDGE_Z + 3, BRIDGE_Z + 6.6, 24, P), { tone: "lo" }));
  return out.join("");
}

const move = k.translateAlong(P, [START_M * UPM, 0, 0]);
const group = (svg) => `<g data-part="carriage" transform="${move}">${svg}</g>`;

const label =
  "A sonar test tank built like a dolphin's head. On the left a clicker with lips and an air bellows sits on a lens housing; the lens dome reaches into the water through the tank's glass end, and below it a fat-filled jaw channel runs from the water back to an ear capsule on four soft springs, whose dial times the echo. A fish hangs on a strut from a carriage that rides the tank's top rails over a ruler marked in metres.";

const PARTS = { base, tankBack, ear, dialTop, jawBack, head, startWire, leftEnd, inWater, pulses, fish, water, strutHigh, tankFront, carriageTop };
if (argv.includes("--sizes")) for (const [name, fn] of Object.entries(PARTS)) console.log(name.padEnd(12), (fn().length / 1024).toFixed(1) + " KB");
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label,
  body: [
    base(),
    tankBack(),
    ear(),
    dialTop(),
    jawBack(),
    head(),
    startWire(),
    leftEnd(),
    inWater(),
    pulses(),
    group(fish()),
    water(),
    group(strutHigh()),
    tankFront(),
    group(carriageTop()),
  ],
});

// ---------------------------------------------------------------------------
const fmt = (value, digits = 0) => value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const caption =
  `A sonar test tank built like a dolphin's head. The clicker is the phonic lips in the nose, driven by air from the bellows (the air sacs). ` +
  `Each click lasts ${M.CLICK_US[0]} to ${M.CLICK_US[1]} µs in wild bottlenose dolphins and centres on ${M.CENTROID_KHZ[0]} to ${M.CENTROID_KHZ[1]} kHz, so its waves are ${fmt(M.wavelengthMm(M.CENTROID_KHZ[1]))} to ${fmt(M.wavelengthMm(M.CENTROID_KHZ[0]))} mm long. ` +
  `The lens is the fatty melon, which focuses the click into a beam about ${M.BEAM_DEG}° wide. ` +
  `The echo comes back through a fat-filled channel in the lower jaw to the ear bones, which hang on soft mounts, isolated from the skull. ` +
  `Sound crosses seawater at about ${fmt(M.C)} m/s, so the dial's round trip gives the range: ${fmt(M.metresPerMs, 2)} m for every millisecond. ` +
  `The next click waits for the echo. Sound here runs ${M.SLOW} times slower than real.`;

const live = `
{
const P = ${JSON.stringify(P)};
const C = ${M.C}, SLOW = ${M.SLOW}, UPM = ${UPM}, R0 = ${M.RANGE[0]}, R1 = ${M.RANGE[1]}, ZA = ${Z_AX};
const TAN = ${TAN}, RING0 = ${RING0}, RING_MAX = ${RING_MAX}, FISH_R = ${FISH_R}, FISH_MID = ${FISH_MID};
const EAR = ${JSON.stringify(EAR)}, TICK_R = ${DIAL_TICK_R}, DIAL_TOP = ${EAR_TOP}, DIAL_FROM = ${DIAL_FROM}, DIAL_SPAN = ${DIAL_SPAN}, DIAL_MS = ${M.DIAL_MS};
const SPEED = C * UPM / SLOW, PAUSE = 0.9, DWELL = 5.4;
const STOPS = [8, 22, 13, 29, 4, 17];
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const q = (name) => svg.querySelector('[data-part="' + name + '"]');
const carriages = [...svg.querySelectorAll('[data-part="carriage"]')];
const click = q("click"), clickGlow = q("click-glow"), echo = q("echo"), echoGlow = q("echo-glow");
const needle = q("needle"), bellows = q("bellows"), slit = q("slit"), cores = [q("core-front"), q("core-back")], earFlash = q("ear-flash");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const echoMs = (m) => (2 * m / C) * 1000;
const say = (m) => m.toFixed(1) + " m · echo " + echoMs(m).toFixed(1) + " ms";
const describe = (m) => "Fish at " + m.toFixed(1) + " metres. The echo returns " + echoMs(m).toFixed(1) + " milliseconds after the click.";
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const flash = (age, rise, fall) => (age < 0 ? 0 : age < rise ? ease(age / rise) : Math.exp(-(age - rise) / fall));
const put = (el, name, value) => { const v = String(value); if (!el.__v) el.__v = {}; if (el.__v[name] !== v) { el.__v[name] = v; el.setAttribute(name, v); } };
const show = (el, alpha) => { const v = alpha < 0.004 ? "0" : alpha.toFixed(3); if (!el.__o || el.__o !== v) { el.__o = v; el.style.opacity = v; } };
const needleAt = (ms) => {
  const angle = DIAL_FROM + Math.min(1, Math.max(0, ms / DIAL_MS)) * DIAL_SPAN;
  const sx = Math.sin(angle), sy = -Math.cos(angle);
  return lineOnTop([EAR[0] - sx * 3, EAR[1] - sy * 3], [EAR[0] + sx * (TICK_R - 1.4), EAR[1] + sy * (TICK_R - 1.4)], DIAL_TOP + 0.2, P);
};
const ringAt = (x, r) => sideRing([x, 0, ZA], r, "x", P, 64);

let range = ${START_M}, target = range, dial = echoMs(range);
let clock = 0, last = 0, frame = 0, visible = false;
let touring = !still.matches, tourClock = 0, idleTimer = 0, stop = 0;
let ping = null, nextAt = 0.5, lastClick = -9, lastEcho = -9, measured = echoMs(range);

function draw(calm) {
  const fishX = range * UPM;
  const move = translateAlong(P, [fishX, 0, 0]);
  for (const g of carriages) put(g, "transform", move);
  let c = 0, e = 0;
  if (!calm && ping) {
    if (ping.hitT === undefined) {
      const x = Math.min(fishX, SPEED * (clock - ping.t0));
      put(click, "d", ringAt(x, Math.min(RING_MAX, RING0 + x * TAN)));
      put(clickGlow, "d", click.getAttribute("d"));
      c = ease((clock - ping.t0) / 0.05);
    } else if (clock - ping.hitT < 0.1) {
      c = 1 - (clock - ping.hitT) / 0.1;
    }
    if (ping.hitT !== undefined) {
      const back = SPEED * (clock - ping.hitT);
      const x = Math.max(0, ping.hitX - back);
      if (ping.echoT === undefined || clock - ping.echoT < 0.25) {
        put(echo, "d", ringAt(x, Math.min(RING_MAX, FISH_R + Math.min(back, ping.hitX) * TAN)));
        put(echoGlow, "d", echo.getAttribute("d"));
        e = 0.9 * ease((clock - ping.hitT) / 0.05) * (ping.echoT === undefined ? 1 : Math.exp(-(clock - ping.echoT) / 0.06));
      }
    }
  }
  show(click, c); show(clickGlow, c * 0.28); show(echo, e); show(echoGlow, e * 0.26);
  show(slit, calm ? 0 : flash(clock - lastClick, 0.03, 0.14));
  const breath = calm ? 0 : flash(clock - lastClick + 0.05, 0.05, 0.22);
  put(bellows, "transform", breath < 0.004 ? "translate(0 0)" : translateAlong(P, [0, 0, -1.2 * breath]));
  const heard = calm ? 0 : flash(clock - lastEcho, 0.04, 0.3);
  for (const core of cores) show(core, heard);
  show(earFlash, calm ? 0 : flash(clock - lastEcho - 0.05, 0.05, 0.4));
  put(needle, "d", needleAt(dial));
  const text = say(range);
  if (readout.textContent !== text) readout.textContent = text;
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  clock += dt;
  if (touring && !calm) {
    tourClock += dt;
    const next = Math.floor(tourClock / DWELL) % STOPS.length;
    if (next !== stop) { stop = next; target = STOPS[stop]; stage.setAttribute("aria-valuenow", String(Math.round(target))); stage.setAttribute("aria-valuetext", describe(target)); }
  }
  range = calm ? target : range + (target - range) * (1 - Math.exp(-dt / 0.45));
  if (Math.abs(target - range) < 0.002) range = target;
  const fishX = range * UPM;
  let want = measured;
  if (calm) {
    ping = null;
    want = echoMs(range);
    dial = want;
  } else {
    if (!ping && clock >= nextAt) { ping = { t0: clock }; lastClick = clock; }
    if (ping) {
      if (ping.hitT === undefined && SPEED * (clock - ping.t0) >= fishX) { ping.hitT = ping.t0 + fishX / SPEED; ping.hitX = fishX; }
      if (ping.hitT !== undefined && ping.echoT === undefined && SPEED * (clock - ping.hitT) >= ping.hitX) {
        ping.echoT = ping.hitT + ping.hitX / SPEED;
        lastEcho = ping.echoT;
        measured = echoMs(ping.hitX / UPM);
        nextAt = ping.echoT + PAUSE;
      }
      want = ping.echoT === undefined ? ((clock - ping.t0) / SLOW) * 1000 : measured;
      if (ping.echoT !== undefined && clock >= nextAt) ping = null;
    }
    dial += (want - dial) * (1 - Math.exp(-dt / 0.035));
  }
  draw(calm);
  const settled = calm && range === target;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}

const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const clampRange = (m) => Math.min(R1, Math.max(R0, m));
function steer(m) {
  touring = false;
  target = clampRange(m);
  stage.setAttribute("aria-valuenow", String(Math.round(target)));
  stage.setAttribute("aria-valuetext", describe(target));
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; tourClock = stop * DWELL; run(); }, 3600);
  run();
}
const rail0 = iso([R0 * UPM + FISH_MID, 0, ZA], P), rail1 = iso([R1 * UPM + FISH_MID, 0, ZA], P);
function rangeAt(event) {
  const box = svg.getBoundingClientRect();
  const view = svg.viewBox.baseVal;
  const px = view.x + ((event.clientX - box.left) / box.width) * view.width;
  const py = view.y + ((event.clientY - box.top) / box.height) * view.height;
  const dx = rail1[0] - rail0[0], dy = rail1[1] - rail0[1];
  const t = Math.min(1, Math.max(0, ((px - rail0[0]) * dx + (py - rail0[1]) * dy) / (dx * dx + dy * dy)));
  return R0 + t * (R1 - R0);
}
let dragging = false;
stage.addEventListener("pointerdown", (event) => {
  dragging = true;
  try { stage.setPointerCapture(event.pointerId); } catch (error) {}
  steer(rangeAt(event));
});
stage.addEventListener("pointermove", (event) => { if (dragging) steer(rangeAt(event)); });
const release = (event) => { dragging = false; try { stage.releasePointerCapture(event.pointerId); } catch (error) {} };
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 5 : 1;
  const from = touring ? range : target;
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = Math.round(from) + step;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = Math.round(from) - step;
  if (event.key === "Home") to = R0;
  if (event.key === "End") to = R1;
  if (to === null) return;
  event.preventDefault();
  steer(to);
});
still.addEventListener?.("change", () => { touring = !still.matches; run(); });
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
draw(still.matches);
}
`;

const keys = [
  { mark: "blue", label: "Click, focused by the lens (the melon)" },
  { mark: "red", label: "Echo, carried by the jaw fat to the ear" },
  { mark: "lit", label: "Needle: time from click to echo" },
];

const stage = `<div class="iso-stage" tabindex="0" role="slider" aria-label="Echolocation rig: arrow keys move the fish along the tank, Shift for 5 metre steps" aria-valuemin="${M.RANGE[0]}" aria-valuemax="${M.RANGE[1]}" aria-valuenow="${START_M}" aria-valuetext="Fish at ${START_M.toFixed(1)} metres. The echo returns ${M.echoMs(START_M).toFixed(1)} milliseconds after the click.">${svg}</div>`;

// The embed leaves the legend and caption to the host page, so they stay in its
// prerendered HTML (pages/anatomy.vue mirrors `keys` and `caption`).
const body = k.plateHtml({
  fig: "Fig 1",
  title: "Echolocation",
  hint: "Drag the fish · ← →",
  readout: `${START_M.toFixed(1)} m · echo ${M.echoMs(START_M).toFixed(1)} ms`,
  keys: embed ? [] : keys,
  caption: embed ? undefined : caption,
  body: stage,
});

const ECO_CSS = `
.iso{--anatomy-page:#061624;--anatomy-card:#0a223a;--anatomy-text:#9fb8cc;--anatomy-strong:#e0f2fe;--anatomy-muted:#6684a0;
  --anatomy-paper:#0a223a;--anatomy-face:#0e3052;--anatomy-top:#0f3255;
  --anatomy-shade-0:#081b2e;--anatomy-shade-1:#092037;--anatomy-shade-2:#0b2640;--anatomy-shade-3:#0d2b49;
  --anatomy-lit-top:#144474;--anatomy-lit-shade:#0f3458;
  --anatomy-hi:#cfe6f6;--anatomy-mid:#5e7f9c;--anatomy-lo:#37546f;--anatomy-faint:#1f3b57;--anatomy-lit:#ffffff;
  --anatomy-halo:#01060c;--anatomy-dot:#e0f2fe;--anatomy-blue:#00f0ff;--anatomy-red:#ff3ec8;
  --eco-pane:#0b2541;--eco-deep-top:#103352;--eco-deep-bottom:#081c31;--eco-water:rgba(96,176,240,.075);--eco-glass:rgba(160,214,255,.035)}
.iso[data-theme="light"]{--anatomy-blue:#0891b2;--anatomy-red:#d23a8f;--eco-pane:#f1f3f4;--eco-deep-top:#e6f0f6;--eco-deep-bottom:#d3e2ec;--eco-water:rgba(40,120,190,.07);--eco-glass:rgba(80,150,210,.035)}
.iso-plate{box-shadow:0 0 0 1px var(--anatomy-faint)}
.iso-stage{touch-action:pan-y;cursor:grab;outline:none}
.iso-stage:active{cursor:grabbing}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.eco-pane{fill:var(--eco-pane);stroke:none}
.eco-water{fill:var(--eco-water);stroke:none}
.eco-glass{fill:var(--eco-glass);stroke:none}
.eco-glow{fill:none;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.eco-glow[data-tone="blue"]{stroke:var(--anatomy-blue)}
.eco-glow[data-tone="red"]{stroke:var(--anatomy-red)}
`;

// Embedded: fill the frame, no page margins, and tell the host page how tall the
// figure is so the iframe can fit it at every width (FigureFrame.vue listens).
const EMBED_CSS = `
html,body{background:transparent}
.iso-page{width:calc(100% - 2px);margin:1px}
`;
// The host may hydrate after this page has loaded and missed the first report, so it
// also pings ("whalesome:figure-ping") and gets an answer.
const EMBED_SCRIPT = `
{
const report = () => parent.postMessage({ type: "whalesome:figure-height", height: Math.ceil(document.documentElement.scrollHeight) }, "*");
new ResizeObserver(report).observe(document.body);
addEventListener("load", report);
addEventListener("message", (event) => { if (event.source === parent && event.data && event.data.type === "whalesome:figure-ping") report(); });
report();
}
`;

const MIT_NOTICE = `<!--
Built with the Anatomy kit, https://github.com/wheresryan22/anatomy (commit 1482e84),
whose runtime is inlined below.

MIT License

Copyright (c) 2026 Ryan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->`;

// The notice goes after <meta charset>: before the doctype it risks quirks mode, and
// ahead of the charset it could push that past the first 1,024 bytes.
const html = k
  .pageHtml({ title: "Echolocation", theme, body, script: kitScript() + live + (embed ? EMBED_SCRIPT : "") })
  .replace('<meta charset="utf-8">', `<meta charset="utf-8">${MIT_NOTICE}`)
  .replace("</style></head>", `${ECO_CSS}${embed ? EMBED_CSS : ""}</style></head>`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log("wrote", OUT, (Buffer.byteLength(html) / 1024).toFixed(1) + " KB");
