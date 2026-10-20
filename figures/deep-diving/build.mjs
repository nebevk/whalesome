// Fig 4 · Deep diving. A pressure test bench: a chamber of seawater with a lung inside.
//
//   ANATOMY_KIT=/path/to/anatomy node figures/deep-diving/build.mjs [--standalone] [--light] [--out path.html]
//
// By default this writes the embed build the site uses, public/figures/deep-diving.html:
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
    ? join(HERE, "..", "..", "public", "figures", "deep-diving.html")
    : join(HERE, theme === "light" ? "deep-diving-light.html" : "deep-diving.html");

const WIDTH = 600;
const HEIGHT = 360;
const RAD = Math.PI / 180;
const AZIMUTH = 60;

// ---------------------------------------------------------------------------
// World. x runs along the bench, y across it, z up; 1 unit ~ 1 px.
const PLATE = { x: -124, y: -50, w: 248, d: 98, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;

// The chamber: a clear cylinder of seawater clamped between two flanges by four tie rods.
const CH = [70, -8];
const FL_R = 37;
const FL_H = 8;
const GZ0 = FL_H; // glass bottom, on the lower flange
const GZ1 = 86; // glass top, under the upper flange
const LID = GZ1 + FL_H; // top of the upper flange
const GL_R = 28;
const ROD_R = 33;
const ROD_W = 1.5;
const RODS = [15, 105, 195, 285].map((deg) => [CH[0] + ROD_R * Math.cos(deg * RAD), CH[1] + ROD_R * Math.sin(deg * RAD)]);

// The lung inside it: a seat, the bellows (alveoli), a coil spring (ribcage), a cap and a stiff tube (airways).
const SEAT_R = 22;
const SEAT_H = 3;
const BZ = GZ0 + SEAT_H; // bellows base
const B_OUT = 16.5;
const B_IN = 13.6;
const PLEATS = 7;
const H0 = 38; // bellows height with full lungs
const H_MIN = 3.6; // pleats stacked flat
const CAP_R = 20.4;
const CAP_H = 2.6;
const TR_R = 4.2;
const TR_H = 19;
const COIL_R = 19.4;
const COIL_TURNS = 5.5;
const alveolarShare = M.alveolarShare;
const bellowsHeight = (m) => H_MIN + (H0 - H_MIN) * alveolarShare(m);

// The gauge on the lid: linear in absolute pressure, 0 to 300 atmospheres, like the readout.
const GA_R = 15.5;
const GA_Z = LID + 9;
const GA_TOP = GA_Z + 8;
const DIAL_ATM = 300;
const DIAL_GAP = Math.atan2(Math.cos(AZIMUTH * RAD), -Math.sin(AZIMUTH * RAD)); // plan direction toward the viewer
const DIAL_SPAN = 270 * RAD;
const DIAL_FROM = DIAL_GAP + (360 * RAD - DIAL_SPAN) / 2;
const DIAL_TICK_R = GA_R - 2.6;

// The depth regulator in front of the chamber, and its rail with the slider.
const BOX = { x: 51, y: 31, w: 26, d: 14, r: 2 };
const BOX_H = 13;
const STOP = { x: -117, y: 30.5, w: 5, d: 14, r: 1.2 };
const RAIL = { x: STOP.x, y: 32, w: BOX.x - STOP.x, d: 11, r: 1.2 };
const RAIL_H = 5;
const CAR = { x: -8, y: 30.6, w: 16, d: 7.8, r: 1.4 }; // the slider, built at x = 0
const CAR_H = 8;
const RAIL_X0 = STOP.x + STOP.w + CAR.w / 2; // slider centre at the surface
const RAIL_X1 = BOX.x - CAR.w / 2; // and at the record depth
const railX = (m) => RAIL_X0 + M.railOf(m) * (RAIL_X1 - RAIL_X0);
const STRIP = { x: STOP.x + STOP.w + 0.5, y: 37.6, w: BOX.x - STOP.x - STOP.w - 1, d: 3.8, r: 0.6 };

// Three oxygen reservoirs on a tray: lungs, blood, muscle.
const TANKS = [
  { key: "lungs", x: -66, share: M.O2.lungs / 100, tone: "air" },
  { key: "blood", x: -42, share: M.O2.blood / 100, tone: "blood" },
  { key: "muscle", x: -18, share: M.O2.muscle / 100, tone: "blood" },
];
const TANK_Y = -16;
const TK_R = 9;
const TK_FOOT = 10.4;
const TK_Z0 = 6;
const TK_Z1 = 44;
const TRAY = { x: -79, y: -29, w: 74, d: 26, r: 3 };
const TRAY_H = 3;

// The metronome: a square-tapered case on a plinth.
const MT = [-100, -18];
const PLINTH = { x: -118, y: -36, w: 36, d: 36, r: 2.4 };
const PLINTH_H = 4.5;
const MT_Z0 = PLINTH_H;
const MT_Z1 = 50;
const MT_HW0 = 12;
const MT_HW1 = 5;
const SW_FAST = 14; // weight's slant distance from the pivot at the surface rate
const SW_SLOW = 27; // and at the diving rate: higher on the rod is slower
const SWING = 20 * RAD;

const START_M = 0;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [CH[0], CH[1] + GA_R, GA_TOP + 1],
    [CH[0] - GA_R, CH[1], GA_TOP + 1],
    [CH[0] + GA_R, CH[1], GA_TOP + 1],
    [MT[0], MT[1], MT_Z1 + 4],
  ],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: AZIMUTH },
);

const V = G.viewOf(P);
const LIGHT = G.lightOf(P);
const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const poly = (points) => k.pathOf(points.map(at), true);
const slab = (plan, z, h, tone = "mid", steps = 4, bevel = 0.5, extra = {}) => S(k.slabOf(plan, z, h, P, steps, bevel), { tone, ...extra });
const cyl = (x, y, r, z, h, tone = "mid", steps = 32, extra = {}) => S(k.cylinder(x, y, r, z, h, P, steps), { tone, ...extra });
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// A solid whose paths the live page rewrites each frame: always the same eight children.
const slotOf = (name, paths, tone = "hi", crease = "lo") =>
  `<g class="iso-solid" data-slot="${name}"><path class="iso-fill" d="${paths.fill}"/>${[0, 1, 2, 3].map((shade) => `<path class="iso-shade" data-shade="${shade}" d="${paths.shades[shade]}"/>`).join("")}<path class="iso-top" d="${paths.top}"/><path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/></g>`;

// A box whose rectangular section tapers from (hw0, hd0) at z0 to (hw1, hd1) at z1, shaded like the kit's solids.
function frustumOf([cx, cy], z0, z1, [hw0, hd0], [hw1, hd1]) {
  const lo = [[cx + hw0, cy - hd0], [cx + hw0, cy + hd0], [cx - hw0, cy + hd0], [cx - hw0, cy - hd0]].map(([x, y]) => [x, y, z0]);
  const hi = [[cx + hw1, cy - hd1], [cx + hw1, cy + hd1], [cx - hw1, cy + hd1], [cx - hw1, cy - hd1]].map(([x, y]) => [x, y, z1]);
  const h = z1 - z0;
  const normals = [[h, 0, hw0 - hw1], [0, h, hd0 - hd1], [-h, 0, hw0 - hw1], [0, -h, hd0 - hd1]];
  const buckets = [[], [], [], [], []];
  const seen = normals.map((n) => G.dot3(n, V) > 1e-6);
  normals.forEach((n, i) => {
    if (!seen[i]) return;
    const j = (i + 1) % 4;
    buckets[G.bandOf(G.dot3(G.unit3(n), LIGHT))].push(k.pathOf([lo[i], lo[j], hi[j], hi[i]].map(at), true));
  });
  const top = k.pathOf(hi.map(at), true);
  const creases = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    if (seen[i]) creases.push(k.pathOf([hi[i], hi[j]].map(at)));
    if (seen[i] && seen[(i + 3) % 4]) creases.push(k.pathOf([lo[i], hi[i]].map(at)));
  }
  const hull = k.pathOf(G.hullOf([...lo, ...hi].map(at)), true);
  return { fill: hull, outline: hull, crease: creases.join(""), top, shades: buckets.slice(0, 4).map((list) => list.join("")) };
}

// A coil spring standing on z, split into the half behind its axis and the half in front.
// The live page rebuilds it with the same source, so it only uses kit functions through K.
const K = k;
const M_PER_ATM = M.M_PER_ATM;
function vcoil(cx, cy, r, z0, z1, turns, P, perTurn = 40) {
  const count = Math.round(turns * perTurn);
  const back = [];
  const front = [];
  let run = [];
  let near = null;
  const flush = () => run.length > 1 && (near ? front : back).push(K.pathOf(run));
  for (let index = 0; index <= count; index++) {
    const angle = (index / count) * turns * Math.PI * 2 + 0.6;
    const flat = K.iso([cx + r * Math.cos(angle), cy + r * Math.sin(angle), z0 + ((z1 - z0) * index) / count], P);
    const facing = K.depthOf([Math.cos(angle), Math.sin(angle), 0], P) > 0;
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

// The bellows: pleats of alternating radius stacked from BZ, as fourteen solids.
function bellowsOf(h, P) {
  const out = [];
  const pitch = h / PLEATS;
  for (let index = 0; index < PLEATS; index++) {
    const z = BZ + index * pitch;
    out.push(K.cylinder(CH[0], CH[1], B_IN, z, pitch * 0.55, P, 32));
    out.push(K.cylinder(CH[0], CH[1], B_OUT, z + pitch * 0.55, pitch * 0.45, P, 40));
  }
  return out;
}

// The gauge needle and the metronome's pendulum, also rebuilt live.
function needleOf(m, P) {
  const share = Math.min(1, Math.max(0, (1 + m / M_PER_ATM) / DIAL.atm));
  const angle = DIAL.from + share * DIAL.span;
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  return K.lineOnTop([DIAL.cx - sx * 3, DIAL.cy - sy * 3], [DIAL.cx + sx * (DIAL.r - 1.4), DIAL.cy + sy * (DIAL.r - 1.4)], DIAL.top + 0.2, P);
}

// ---------------------------------------------------------------------------
function base() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`);
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(cyl(x, y, 7, -PLATE_H - FOOT_H, 1.6, "lo", 20));
    out.push(cyl(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, "mid", 20));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate, front right
  const label = { x: 80, y: 37, w: 26, d: 8.5, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[39.6, 16], [41.4, 11], [43.2, 14]].map(([y, w]) => k.lineOnTop([label.x + 4, y], [label.x + 4 + w, y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 2.4, label.y + 4.25, 0.8]), at([label.x + label.w - 2.4, label.y + 4.25, 0.8])], { size: 0.45 }));
  // the reservoirs' tray and the metronome's plinth
  out.push(slab(TRAY, 0, TRAY_H, "mid", 5, 0.6));
  out.push(D(k.corners(TRAY, 3).map(([x, y]) => at([x, y, TRAY_H])), { size: 0.45 }));
  out.push(slab(PLINTH, 0, PLINTH_H, "mid", 5, 0.6));
  out.push(D(k.corners(PLINTH, 3).map(([x, y]) => at([x, y, PLINTH_H])), { size: 0.45 }));
  return out.join("");
}

// The lower flange and the two tie rods behind the glass.
function chamberBack() {
  const out = [];
  const [cx, cy] = CH;
  out.push(`<path class="iso-halo" d="${k.cylinder(cx, cy, FL_R, 0, 1, P, 64).fill}" style="filter:blur(5px)"/>`);
  out.push(S(k.cylinder(cx, cy, FL_R, 0, FL_H, P, 72, 0.8), { tone: "mid" }));
  out.push(L(k.sideArc(cx, cy, FL_R, FL_H / 2, P, 48), { tone: "faint" }));
  out.push(L(k.ring(cx, cy, GL_R + 1.6, FL_H, P, 72), { tone: "lo" })); // the glass's seat groove
  const bolts = Array.from({ length: 8 }, (_, i) => (i * 45 + 37.5) * RAD).map((a) => [cx + 34.4 * Math.cos(a), cy + 34.4 * Math.sin(a)]);
  out.push(D(bolts.map(([x, y]) => at([x, y, FL_H])), { size: 0.45 }));
  for (const [x, y] of byDepth(RODS).slice(0, 2)) out.push(rod(x, y));
  out.push(reflex());
  return out.join("");
}

// The reflex: a pressure switch on the flange, wired to the metronome, which slows as soon as the chamber dives.
const SWITCH_AT = 140 * RAD;
function reflex() {
  const n = [Math.cos(SWITCH_AT), Math.sin(SWITCH_AT), 0];
  const on = (r, z) => [CH[0] + r * n[0], CH[1] + r * n[1], z];
  const F = G.frameAlong(on(FL_R - 0.2, FL_H / 2), n);
  const out = [S(G.disc(0, 2.6, 2.4, F, P), { tone: "mid" }), S(G.disc(2.6, 4, 1.5, F, P), { tone: "mid" })];
  const route = G.fillet([on(FL_R + 4, FL_H / 2), on(FL_R + 9, 1.6), [16, 11.5, 0.6], [-78, 11.5, 0.6], [-91, 2.6, 0.6], [-91, 0.3, 2.4]], 5, 8);
  const points = route.map(at);
  out.push(k.wireSvg(points[0], points[points.length - 1], { via: points.slice(1, -1), tone: "mid", size: 1 }));
  return out.join("");
}

function rod(x, y) {
  return [
    S(k.cylinder(x, y, 2.9, FL_H, 2.4, P, 6), { tone: "mid" }),
    S(k.cylinder(x, y, ROD_W, FL_H + 2.4, GZ1 - FL_H - 2.4, P, 16), { tone: "mid", crease: "none" }),
  ].join("");
}

const deepGradient = (() => {
  const top = at([CH[0], CH[1], GZ1]);
  const bottom = at([CH[0], CH[1], GZ0]);
  return `<linearGradient id="dd-deep" gradientUnits="userSpaceOnUse" x1="${top[0].toFixed(1)}" y1="${top[1].toFixed(1)}" x2="${bottom[0].toFixed(1)}" y2="${bottom[1].toFixed(1)}"><stop offset="0" style="stop-color:var(--dd-deep-top)"/><stop offset="1" style="stop-color:var(--dd-deep-bottom)"/></linearGradient>`;
})();

function glassBack() {
  const [cx, cy] = CH;
  const silhouette = k.cylinder(cx, cy, GL_R, GZ0, GZ1 - GZ0, P, 72).fill;
  return [
    `<path class="dd-deep" d="${silhouette}"/>`,
    L(k.ring(cx, cy, GL_R - 1.2, GZ0, P, 96), { tone: "faint" }),
  ].join("");
}

// The lung: seat, back of the coil, bellows, front of the coil.
function lungBody() {
  const [cx, cy] = CH;
  const out = [];
  out.push(S(k.cylinder(cx, cy, SEAT_R, GZ0, SEAT_H, P, 64, 0.5), { tone: "mid" }));
  out.push(L(k.ring(cx, cy, COIL_R, BZ, P, 64), { tone: "faint" }));
  const coil = vcoil(cx, cy, COIL_R, BZ, BZ + H0, COIL_TURNS, P);
  out.push(`<path data-part="coil-back" class="iso-line" data-tone="lo" d="${coil.back}" style="stroke-width:0.9"/>`);
  out.push(`<g data-part="bellows" class="dd-air">${bellowsOf(H0, P).map((paths, index) => slotOf(`b${index}`, paths, index % 2 ? "hi" : "mid", index % 2 ? "lo" : "faint")).join("")}</g>`);
  out.push(`<path data-part="coil-front" class="iso-line" data-tone="mid" d="${coil.front}" style="stroke-width:1.1"/>`);
  return out.join("");
}

// The cap and the stiff ringed tube, built with full lungs and moved down by the live page.
function lungTop() {
  const [cx, cy] = CH;
  const out = [];
  const zc = BZ + H0;
  out.push(S(k.cylinder(cx, cy, CAP_R, zc, CAP_H, P, 64, 0.5), { tone: "hi", crease: "lo" }));
  out.push(D(Array.from({ length: 6 }, (_, i) => (i * 60 + 30) * RAD).map((a) => at([cx + 17.8 * Math.cos(a), cy + 17.8 * Math.sin(a), zc + CAP_H])), { size: 0.42 }));
  out.push(S(k.cylinder(cx, cy, 6.4, zc + CAP_H, 1.6, P, 32), { tone: "mid" }));
  const z0 = zc + CAP_H + 1.6;
  const rings = [];
  for (let z = z0 + 2; z < z0 + TR_H - 1; z += 2.4) rings.push(k.sideArc(cx, cy, TR_R, z, P, 20));
  out.push(`<g class="dd-air">${S(k.cylinder(cx, cy, TR_R, z0, TR_H, P, 32), { tone: "hi", crease: "lo", inner: L(rings.join(""), { tone: "mid" }) })}</g>`);
  out.push(S(k.cylinder(cx, cy, 5.6, z0 + TR_H, 2.2, P, 32, 0.4), { tone: "mid" }));
  out.push(D([at([cx, cy, z0 + TR_H + 2.2])], { size: 0.6, tone: "hi" }));
  return `<g data-part="lung-top">${out.join("")}</g>`;
}

function glassFront() {
  const [cx, cy] = CH;
  const glass = k.cylinder(cx, cy, GL_R, GZ0, GZ1 - GZ0, P, 72);
  const shine = [100, 108].map((deg) => k.segment([cx + GL_R * Math.cos(deg * RAD), cy + GL_R * Math.sin(deg * RAD), GZ0], [cx + GL_R * Math.cos(deg * RAD), cy + GL_R * Math.sin(deg * RAD), GZ1], P));
  return [
    `<path class="dd-water" d="${glass.fill}"/>`,
    L(shine.join(""), { tone: "faint" }),
    `<path class="iso-line" data-tone="lo" d="${glass.outline}"/>`,
  ].join("");
}

// The front tie rods, the upper flange with its nuts, and the gauge.
function chamberTop() {
  const out = [];
  const [cx, cy] = CH;
  for (const [x, y] of byDepth(RODS).slice(2)) out.push(rod(x, y));
  out.push(S(k.cylinder(cx, cy, FL_R, GZ1, FL_H, P, 72, 0.8), { tone: "mid" }));
  out.push(L(k.sideArc(cx, cy, FL_R, GZ1 + FL_H / 2, P, 48), { tone: "faint" }));
  for (const [x, y] of byDepth(RODS)) {
    out.push(S(k.cylinder(x, y, 2.9, LID, 2.4, P, 6), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, ROD_W, LID + 2.4, 1.6, P, 16), { tone: "mid" }));
  }
  // the gauge: a hex fitting, a stem and the dial
  out.push(S(k.cylinder(cx, cy, 4.4, LID, 2.4, P, 6), { tone: "mid" }));
  out.push(S(k.cylinder(cx, cy, 2.4, LID + 2.4, GA_Z - LID - 2.4, P, 20), { tone: "mid", crease: "none" }));
  out.push(L(k.sideArc(cx, cy, 2.4, LID + 5, P, 12), { tone: "faint" }));
  out.push(S(k.cylinder(cx, cy, GA_R, GA_Z, GA_TOP - GA_Z, P, 72, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(cx, cy, GA_R, GA_TOP - 3.2, GA_TOP, 96, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(cx, cy, GA_R, GA_TOP - 3.2, P, 56), { tone: "faint" }));
  out.push(L(k.ring(cx, cy, DIAL_TICK_R, GA_TOP, P, 80), { tone: "lo" }));
  const ticks = k.radialTicks(cx, cy, DIAL_TICK_R, 30, 5, GA_TOP, [1.3, 2.8], P, DIAL_FROM, DIAL_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const zero = [Math.sin(DIAL_FROM), -Math.cos(DIAL_FROM)];
  out.push(L(k.lineOnTop([cx + zero[0] * (DIAL_TICK_R - 3.8), cy + zero[1] * (DIAL_TICK_R - 3.8)], [cx + zero[0] * DIAL_TICK_R, cy + zero[1] * DIAL_TICK_R], GA_TOP, P), { tone: "hi" }));
  const gap = [Math.sin(DIAL_GAP), -Math.cos(DIAL_GAP)];
  out.push(k.faceTextSvg(k.topMatrix([cx + gap[0] * 6.8 - 0.3, cy + gap[1] * 6.8 + 1], GA_TOP, P, "x"), "atm", { size: 2.8, tone: "lo", anchor: "middle" }));
  return out.join("");
}

const DIAL = { cx: CH[0], cy: CH[1], r: DIAL_TICK_R, top: GA_TOP, from: DIAL_FROM, span: DIAL_SPAN, atm: DIAL_ATM };
function dialTop() {
  return [
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="both" d="${needleOf(START_M, P)}" style="stroke-width:1.2"/>`,
    L(k.ring(CH[0], CH[1], 1.7, GA_TOP + 0.2, P, 20), { tone: "mid" }),
    D([at([CH[0], CH[1], GA_TOP + 0.2])], { size: 0.65, tone: "hi" }),
  ].join("");
}

// ---------------------------------------------------------------------------
// The reservoirs. Each is a glass cylinder filled to its share of the oxygen, with a valve on top.
const CAP_Z1 = TK_Z1 + 4; // top of a reservoir's metal cap
const VALVE_Z1 = CAP_Z1 + 3.6; // top of its valve body
const LEVER_Z = VALVE_Z1 + 0.8; // the lever sits on a short stem
// A quarter-turn lever: along the outlet (pointing +x) when open, across it when shut.
const leverAngle = (shut) => (shut * Math.PI) / 2;
function leverOf(cx, cy, angle, P) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return K.extrude([[-1.2, -0.8], [8.5, -0.8], [8.5, 0.8], [-1.2, 0.8]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]), LEVER_Z, 1, P);
}

function tank(t) {
  const out = [];
  const cx = t.x;
  const cy = TANK_Y;
  out.push(S(k.cylinder(cx, cy, TK_FOOT, TRAY_H, TK_Z0 - TRAY_H, P, 40, 0.5), { tone: "mid" }));
  out.push(`<path class="dd-tank" d="${k.cylinder(cx, cy, TK_R, TK_Z0, TK_Z1 - TK_Z0, P, 44).fill}"/>`);
  const level = (TK_Z1 - TK_Z0 - 0.4) * t.share;
  out.push(`<g class="dd-${t.tone}">${S(k.cylinder(cx, cy, TK_R - 0.8, TK_Z0, level, P, 44), { tone: "hi", crease: "hi" })}</g>`);
  const glass = k.cylinder(cx, cy, TK_R, TK_Z0, TK_Z1 - TK_Z0, P, 44);
  const shine = [100, 110].map((deg) => k.segment([cx + TK_R * Math.cos(deg * RAD), cy + TK_R * Math.sin(deg * RAD), TK_Z0], [cx + TK_R * Math.cos(deg * RAD), cy + TK_R * Math.sin(deg * RAD), TK_Z1], P));
  // a printed scale on the glass, a tick for every tenth of the oxygen
  const onGlass = (deg, z) => [cx + TK_R * Math.cos(deg * RAD), cy + TK_R * Math.sin(deg * RAD), z];
  const arc = (from, to, z) => k.pathOf([0, 0.25, 0.5, 0.75, 1].map((t) => at(onGlass(from + (to - from) * t, z))));
  const scale = [k.pathOf([at(onGlass(32, TK_Z0)), at(onGlass(32, TK_Z1))])];
  for (let i = 1; i <= 9; i++) scale.push(arc(32, i === 5 ? 18 : 24, TK_Z0 + (TK_Z1 - TK_Z0 - 0.4) * (i / 10)));
  out.push(`<path class="dd-water" d="${glass.fill}"/>`, L(shine.join(""), { tone: "faint" }), L(scale.join(""), { tone: "lo" }), `<path class="iso-line" data-tone="lo" d="${glass.outline}"/>`);
  out.push(S(k.cylinder(cx, cy, TK_FOOT, TK_Z1, CAP_Z1 - TK_Z1, P, 40, 0.5), { tone: "mid" }));
  out.push(L(k.sideArc(cx, cy, TK_FOOT, TK_Z1 + 2, P, 32), { tone: "faint" }));
  out.push(slab({ x: cx - 2.6, y: cy - 2.6, w: 5.2, d: 5.2, r: 1 }, CAP_Z1, VALVE_Z1 - CAP_Z1, "mid", 3, 0.3));
  out.push(S(G.disc(0, 4.2, 1.3, G.frameAlong([cx + 2.6, cy, (CAP_Z1 + VALVE_Z1) / 2], [1, 0, 0]), P), { tone: "mid" }));
  out.push(cyl(cx, cy, 0.9, VALVE_Z1, LEVER_Z - VALVE_Z1, "mid", 12));
  return out.join("");
}

function leverSvg(t, angle, part) {
  const paths = leverOf(t.x, TANK_Y, angle, P);
  return part ? slotOf(part, paths, "hi", "lo") : S(paths, { tone: "hi", crease: "lo" });
}

// ---------------------------------------------------------------------------
// The metronome.
const MT_FACE = (() => {
  const ev = G.unit3([0, MT_HW1 - MT_HW0, MT_Z1 - MT_Z0]);
  const en = G.unit3([0, MT_Z1 - MT_Z0, MT_HW0 - MT_HW1]);
  const foot = [MT[0], MT[1] + MT_HW0, MT_Z0];
  const onFace = (u, s, n = 0) => G.add3(G.add3(G.add3(foot, [u, 0, 0]), G.mul3(ev, s)), G.mul3(en, n));
  return { ev, en, foot, onFace, pivot: onFace(0, 8, 1.4) };
})();

function metronomeBody() {
  const out = [];
  const body = frustumOf(MT, MT_Z0, MT_Z1, [MT_HW0, MT_HW0], [MT_HW1, MT_HW1]);
  // a recess on the face where the pendulum swings, and the tempo scale inside it
  const f = MT_FACE.onFace;
  const recess = [f(-7.5, 4), f(7.5, 4), f(3.6, 40), f(-3.6, 40)];
  out.push(S(body, { tone: "mid", inner: L(poly(recess), { tone: "lo" }) }));
  const strip = [f(-1.6, 12), f(1.6, 12), f(1.6, 37), f(-1.6, 37)];
  out.push(`<path class="iso-fill" d="${poly(strip)}"/>`, L(poly(strip), { tone: "lo" }));
  const ticks = [];
  for (let s = 13; s <= 36.01; s += 2) ticks.push(k.pathOf([f(-1.6, s), f(-1.6 + ((s - 13) % 6 === 0 ? 2.4 : 1.3), s)].map(at)));
  out.push(L(ticks.join(""), { tone: "lo" }));
  // the top, a finial, and the winding key on the right-hand face
  out.push(cyl(MT[0], MT[1], 2.2, MT_Z1, 1.6, "mid", 20));
  out.push(cyl(MT[0], MT[1], 1, MT_Z1 + 1.6, 2.2, "mid", 12));
  const side = G.unit3([MT_Z1 - MT_Z0, 0, MT_HW0 - MT_HW1]);
  const keyAt = G.add3([MT[0] + MT_HW0 - (MT_HW0 - MT_HW1) * (16 / (MT_Z1 - MT_Z0)), MT[1], MT_Z0 + 16], [0, 0, 0]);
  const F = G.frameOf(keyAt, side, [0, 1, 0], G.cross3(side, [0, 1, 0]));
  out.push(S(G.disc(0, 2.4, 1.1, F, P), { tone: "mid" }));
  out.push(S(G.prismOf(F, [[-3.4, -0.9], [-1, -1.4], [1, -1.4], [3.4, -0.9], [3.4, 0.9], [1, 1.4], [-1, 1.4], [-3.4, 0.9]], 2.4, 3.4, P), { tone: "mid" }));
  // the beat lamp on the plinth
  const lamp = [MT[0] + 9.5, MT[1] + MT_HW0 + 3.4];
  out.push(cyl(lamp[0], lamp[1], 2.2, PLINTH_H, 1, "mid", 24));
  out.push(cyl(lamp[0], lamp[1], 1.5, PLINTH_H + 1, 1.2, "hi", 20));
  out.push(`<path data-part="lamp" class="dd-flash" d="${k.cylinder(lamp[0], lamp[1], 1.5, PLINTH_H + 1, 1.2, P, 20).fill}" style="opacity:0"/>`);
  return out.join("");
}

// The pendulum: a rod from a pivot on the face and a weight that slides along it.
function pendulumOf(theta, sw, P) {
  const F = MT_FACE;
  const dir = [Math.sin(theta), 0, 0].map((v, i) => v + F.ev[i] * Math.cos(theta));
  const ex = [Math.cos(theta), 0, 0].map((v, i) => v - F.ev[i] * Math.sin(theta));
  const p = (s, u = 0, n = 0) => [0, 1, 2].map((i) => F.pivot[i] + dir[i] * s + ex[i] * u + F.en[i] * n);
  const rod = K.pathOf([K.iso(p(-3), P), K.iso(p(33), P)]);
  // the weight: a small block on the rod, its visible faces shaded
  const c = [[-2.4, -3, -0.7], [2.4, -3, -0.7], [2.4, 3, -0.7], [-2.4, 3, -0.7], [-2.4, -3, 1.7], [2.4, -3, 1.7], [2.4, 3, 1.7], [-2.4, 3, 1.7]].map(([s, u, n]) => p(sw + s, u, n));
  const flat = c.map((point) => K.iso(point, P));
  const faces = [
    [[4, 5, 6, 7], F.en],
    [[1, 2, 6, 5], dir],
    [[0, 3, 7, 4], dir.map((v) => -v)],
    [[2, 3, 7, 6], ex],
    [[0, 1, 5, 4], ex.map((v) => -v)],
  ];
  const view = PEND.view;
  const light = PEND.light;
  const shades = ["", "", "", "", ""];
  for (const [index, normal] of faces) {
    if (normal[0] * view[0] + normal[1] * view[1] + normal[2] * view[2] <= 1e-6) continue;
    const score = normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2];
    let band = 0;
    while (band < 4 && score >= [0, 0.2, 0.42, 0.62][band]) band++;
    shades[band] += K.pathOf(index.map((i) => flat[i]), true);
  }
  return { rod, weight: shades, hub: K.iso(F.pivot, P) };
}
const PEND = { view: V, light: LIGHT };

function pendulum() {
  const pose = pendulumOf(0, SW_FAST, P);
  return [
    `<path data-part="rod" class="iso-line" data-tone="hi" data-free="both" d="${pose.rod}" style="stroke-width:1.1"/>`,
    `<g data-part="weight" class="iso-solid">${pose.weight.slice(0, 4).map((d, shade) => `<path class="iso-shade" data-shade="${shade}" d="${d}"/>`).join("")}<path class="iso-top" d="${pose.weight[4]}"/></g>`,
    D([pose.hub], { size: 1, tone: "hi" }),
  ].join("");
}

// ---------------------------------------------------------------------------
// The depth regulator: a valve box bolted to the chamber, a rail marked at every doubling of pressure.
function regulatorBox() {
  const out = [];
  const neckF = G.frameAlong([CH[0] - 1, CH[1] + Math.sqrt(FL_R * FL_R - 2.4 * 2.4), 4.4], [0, 1, 0]);
  out.push(S(G.disc(0, BOX.y - neckF.o[1], 2.4, neckF, P), { tone: "mid" }));
  out.push(S(k.slabOf(BOX, 0, BOX_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(BOX, 9, P, 4), { tone: "faint" }) }));
  out.push(D(k.corners(BOX, 2.4).map(([x, y]) => at([x, y, BOX_H])), { size: 0.45 }));
  const knob = [BOX.x + 15, BOX.y + 7];
  out.push(cyl(knob[0], knob[1], 4.4, BOX_H, 4, "mid", 32));
  out.push(L(k.knurl(knob[0], knob[1], 4.4, BOX_H, BOX_H + 4, 30, P), { tone: "lo" }));
  out.push(L(k.lineOnTop(knob, [knob[0] + 4.4, knob[1]], BOX_H + 4, P), { tone: "hi" }));
  out.push(D([at([knob[0], knob[1], BOX_H + 4])], { size: 0.55, tone: "hi" }));
  return out.join("");
}

function regulator() {
  const out = [];
  out.push(slab(RAIL, 0, RAIL_H, "mid", 3, 0.5));
  out.push(L(k.planOutline({ x: RAIL_X0 - 3, y: 33.6, w: RAIL_X1 - RAIL_X0 + 6, d: 1.6, r: 0.8 }, RAIL_H, P, 3), { tone: "lo" }));
  out.push(slab(STOP, 0, 9, "mid", 3, 0.5));
  out.push(D([at([STOP.x + 2.5, STOP.y + 2.4, 9]), at([STOP.x + 2.5, STOP.y + STOP.d - 2.4, 9])], { size: 0.45 }));
  out.push(S(k.slabOf(STRIP, RAIL_H, 0.5, P, 3), { tone: "lo", crease: "none" }));
  const ticks = M.MARKS.map((m) => k.lineOnTop([railX(m), STRIP.y + 0.25], [railX(m), STRIP.y + 2.6], RAIL_H + 0.5, P)).join("");
  out.push(L(ticks, { tone: "mid" }));
  out.push(L(k.lineOnTop([railX(0), STRIP.y + 0.25], [railX(0), STRIP.y + 2.6], RAIL_H + 0.5, P), { tone: "hi" }));
  // the range in which the alveoli are thought to finish collapsing
  const band = { x: railX(M.COLLAPSE_M[0]), y: STRIP.y + 2.9, w: railX(M.COLLAPSE_M[1]) - railX(M.COLLAPSE_M[0]), d: 0.7, r: 0.3 };
  out.push(`<path class="dd-band" d="${k.planOutline(band, RAIL_H + 0.5, P, 2)}"/>`);
  return out.join("");
}

function slider() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CAR, 1), RAIL_H, 0.1, P)}" style="filter:blur(3px)"/>`);
  out.push(slab(CAR, RAIL_H, CAR_H, "mid", 3, 0.5, { inner: L(k.sideSeam(CAR, RAIL_H + 3, P, 3), { tone: "faint" }) }));
  out.push(D([[-5.6, 32.2], [5.6, 32.2]].map(([x, y]) => at([x, y, RAIL_H + CAR_H])), { size: 0.45 }));
  const pointer = { x: -1.5, y: CAR.y + CAR.d - 0.6, w: 3, d: 5.4, r: 0.5 };
  out.push(slab(pointer, RAIL_H + 0.6, 0.8, "hi", 2, 0, { crease: "lo" }));
  out.push(L(k.lineOnTop([0, pointer.y + 0.3], [0, pointer.y + pointer.d - 0.3], RAIL_H + 1.4, P), { tone: "hi" }));
  out.push(cyl(0, CAR.y + CAR.d / 2, 3.8, RAIL_H + CAR_H, 4.6, "hi", 32, { crease: "lo" }));
  out.push(L(k.knurl(0, CAR.y + CAR.d / 2, 3.8, RAIL_H + CAR_H, RAIL_H + CAR_H + 4.6, 30, P), { tone: "lo" }));
  out.push(D([at([0, CAR.y + CAR.d / 2, RAIL_H + CAR_H + 4.6])], { size: 0.55, tone: "hi" }));
  return `<g data-part="slider" transform="${k.translateAlong(P, [railX(START_M), 0, 0])}">${out.join("")}</g>`;
}

const label =
  "A pressure test bench. On the right, a clear chamber of seawater clamped between two flanges by four tie rods, with a pressure gauge on its lid. Inside stands a lung: a soft bellows wound with a coil spring and capped by a stiff ringed tube. To its left, three glass reservoirs filled to the shares of a sperm whale's oxygen kept in its lungs, blood and muscle, the first with a valve, and a metronome wired to a pressure switch on the chamber. A slider on a rail in front sets the depth.";

const PARTS = { base, chamberBack, glassBack, lungBody, lungTop, glassFront, chamberTop, dialTop, tanks: () => TANKS.map(tank).join(""), metronomeBody, pendulum, regulator, slider, regulatorBox };
if (argv.includes("--sizes")) for (const [name, fn] of Object.entries(PARTS)) console.log(name.padEnd(14), (fn().length / 1024).toFixed(1) + " KB");

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label,
  body: [
    `<defs>${deepGradient}</defs>`,
    base(),
    metronomeBody(),
    pendulum(),
    TANKS.map((t, i) => tank(t) + (i === 0 ? leverSvg(t, leverAngle(M.collapseOf(START_M)), "lever") : leverSvg(t, leverAngle(0)))).join(""),
    chamberBack(),
    glassBack(),
    lungBody(),
    lungTop(),
    glassFront(),
    chamberTop(),
    dialTop(),
    regulator(),
    slider(),
    regulatorBox(),
  ],
});

// ---------------------------------------------------------------------------
const fnSource = (fn) => fn.toString();
const live = `
{
const P = ${JSON.stringify(P)};
const K = { iso, depthOf, pathOf, cylinder, extrude, lineOnTop };
const M_PER_ATM = ${M.M_PER_ATM}, P_MAX = ${M.P_MAX}, AIRWAY_SHARE = ${M.AIRWAY_SHARE}, COLLAPSE_M = ${JSON.stringify(M.COLLAPSE_M)}, DIVING_M = ${M.DIVING_M};
const HEART_BPM = ${JSON.stringify(M.HEART_BPM)}, STOPS = ${JSON.stringify(M.STOPS)}, RECORD_M = ${M.RECORD_M};
const pressureAt = ${fnSource(M.pressureAt)}, lungShare = ${fnSource(M.lungShare)}, railOf = ${fnSource(M.railOf)}, depthOfRail = ${fnSource(M.depthOfRail)};
const alveolarShare = ${fnSource(M.alveolarShare)}, alveoliAt = ${fnSource(M.alveoliAt)}, collapseOf = ${fnSource(M.collapseOf)};
const fmtDepth = ${fnSource(M.fmtDepth)}, fmtAtm = ${fnSource(M.fmtAtm)}, fmtShare = ${fnSource(M.fmtShare)};
const readoutOf = ${fnSource(M.readoutOf)}, describeOf = ${fnSource(M.describeOf)};
const DIAL = ${JSON.stringify(DIAL)}, PEND = ${JSON.stringify(PEND)}, MT_FACE = { ev: ${JSON.stringify(MT_FACE.ev)}, en: ${JSON.stringify(MT_FACE.en)}, pivot: ${JSON.stringify(MT_FACE.pivot)} };
const H0 = ${H0}, H_MIN = ${H_MIN}, BZ = ${BZ}, CH = ${JSON.stringify(CH)}, COIL_R = ${COIL_R}, COIL_TURNS = ${COIL_TURNS};
const PLEATS = ${PLEATS}, B_IN = ${B_IN}, B_OUT = ${B_OUT}, LEVER_Z = ${LEVER_Z};
const RAIL_X0 = ${RAIL_X0}, RAIL_X1 = ${RAIL_X1}, RAIL_Y = ${CAR.y + CAR.d / 2}, RAIL_Z = ${RAIL_H};
const SW_FAST = ${SW_FAST}, SW_SLOW = ${SW_SLOW}, SWING = ${SWING}, LEVER_AT = ${JSON.stringify([TANKS[0].x, TANK_Y])};
const vcoil = ${fnSource(vcoil)};
const bellowsOf = ${fnSource(bellowsOf)};
const needleOf = ${fnSource(needleOf)};
const pendulumOf = ${fnSource(pendulumOf)};
const leverOf = ${fnSource(leverOf)};
const leverAngle = ${fnSource(leverAngle)};
const bellowsHeight = ${fnSource(bellowsHeight)};
const TOUR = [[0, 7], [10, 4.4], [30, 4.4], [70, 4.4], [100, 4.4], [1000, 4.2], [RECORD_M, 6]];

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const q = (name) => svg.querySelector('[data-part="' + name + '"]');
const slots = [...svg.querySelectorAll('[data-part="bellows"] [data-slot]')];
const lever = svg.querySelector('[data-slot="lever"]');
const coilBack = q("coil-back"), coilFront = q("coil-front"), lungTop = q("lung-top"), needle = q("needle"), slider = q("slider");
const rod = q("rod"), weight = q("weight"), lamp = q("lamp");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const flash = (age, rise, fall) => (age < 0 ? 0 : age < rise ? ease(age / rise) : Math.exp(-(age - rise) / fall));
const put = (el, name, value) => { const v = String(value); if (!el.__v) el.__v = {}; if (el.__v[name] !== v) { el.__v[name] = v; el.setAttribute(name, v); } };
const show = (el, alpha) => { const v = alpha < 0.004 ? "0" : alpha.toFixed(3); if (el.__o !== v) { el.__o = v; el.style.opacity = v; } };
const fillSlot = (g, paths) => {
  const c = g.children;
  put(c[0], "d", paths.fill);
  for (let i = 0; i < 4; i++) put(c[1 + i], "d", paths.shades[i]);
  put(c[5], "d", paths.top); put(c[6], "d", paths.crease); put(c[7], "d", paths.outline);
};
const weightPaths = [...weight.children];

let u = railOf(${START_M}), uTarget = u, depth = depthOfRail(u);
let dive = depth > DIVING_M ? 1 : 0, phase = 0, lastBeat = -9;
let clock = 0, last = 0, frame = 0, visible = false, shownDepth = -1;
let touring = !still.matches, tourClock = 0, idleTimer = 0, stop = 0;
const tourLength = TOUR.reduce((sum, [, dwell]) => sum + dwell, 0);
const tourAt = (t) => { let time = t % tourLength; for (let i = 0; i < TOUR.length; i++) { if (time < TOUR[i][1]) return i; time -= TOUR[i][1]; } return 0; };

function announce(m) {
  stage.setAttribute("aria-valuenow", String(Math.round(m)));
  stage.setAttribute("aria-valuetext", describeOf(m));
}

function draw(calm, theta, sw) {
  const h = bellowsHeight(depth);
  if (h !== draw.h) {
    draw.h = h;
    bellowsOf(h, P).forEach((paths, index) => fillSlot(slots[index], paths));
    const coil = vcoil(CH[0], CH[1], COIL_R, BZ, BZ + h, COIL_TURNS, P);
    put(coilBack, "d", coil.back); put(coilFront, "d", coil.front);
    put(lungTop, "transform", translateAlong(P, [0, 0, h - H0]));
  }
  put(needle, "d", needleOf(depth, P));
  put(slider, "transform", translateAlong(P, [RAIL_X0 + u * (RAIL_X1 - RAIL_X0), 0, 0]));
  const turn = leverAngle(collapseOf(depth));
  if (turn !== draw.turn) { draw.turn = turn; fillSlot(lever, leverOf(LEVER_AT[0], LEVER_AT[1], turn, P)); }
  const pose = pendulumOf(theta, sw, P);
  put(rod, "d", pose.rod);
  for (let i = 0; i < 4; i++) put(weightPaths[i], "d", pose.weight[i]);
  put(weightPaths[4], "d", pose.weight[4]);
  show(lamp, calm ? 0 : flash(clock - lastBeat, 0.04, 0.32));
  const text = readoutOf(depth);
  if (readout.textContent !== text) readout.textContent = text;
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  clock += dt;
  if (touring && !calm) {
    tourClock += dt;
    const next = tourAt(tourClock);
    if (next !== stop) { stop = next; uTarget = railOf(TOUR[stop][0]); announce(TOUR[stop][0]); }
  }
  u = calm ? uTarget : u + (uTarget - u) * (1 - Math.exp(-dt / 0.5));
  if (Math.abs(uTarget - u) < 2e-5) u = uTarget;
  depth = depthOfRail(u);
  const diving = depth > DIVING_M ? 1 : 0;
  dive = calm ? diving : dive + (diving - dive) * (1 - Math.exp(-dt / 1.2));
  const bpm = HEART_BPM.surface + (HEART_BPM.dive - HEART_BPM.surface) * dive;
  let theta = 0;
  if (!calm) {
    const before = Math.floor(phase / Math.PI + 0.5);
    phase += Math.PI * (bpm / 60) * dt;
    if (Math.floor(phase / Math.PI + 0.5) !== before) lastBeat = clock;
    theta = SWING * Math.sin(phase);
  }
  draw(calm, theta, SW_FAST + (SW_SLOW - SW_FAST) * dive);
  const settled = calm && u === uTarget;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}

const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function steer(next) {
  touring = false;
  uTarget = Math.min(1, Math.max(0, next));
  announce(depthOfRail(uTarget));
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; tourClock = 0; stop = -1; run(); }, 3600);
  run();
}
const rail0 = iso([RAIL_X0, RAIL_Y, RAIL_Z], P), rail1 = iso([RAIL_X1, RAIL_Y, RAIL_Z], P);
function railAt(event) {
  const box = svg.getBoundingClientRect();
  const view = svg.viewBox.baseVal;
  const px = view.x + ((event.clientX - box.left) / box.width) * view.width;
  const py = view.y + ((event.clientY - box.top) / box.height) * view.height;
  const dx = rail1[0] - rail0[0], dy = rail1[1] - rail0[1];
  return ((px - rail0[0]) * dx + (py - rail0[1]) * dy) / (dx * dx + dy * dy);
}
let dragging = false;
stage.addEventListener("pointerdown", (event) => {
  dragging = true;
  try { stage.setPointerCapture(event.pointerId); } catch (error) {}
  steer(railAt(event));
});
stage.addEventListener("pointermove", (event) => { if (dragging) steer(railAt(event)); });
const release = (event) => { dragging = false; try { stage.releasePointerCapture(event.pointerId); } catch (error) {} };
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const from = depthOfRail(touring ? u : uTarget);
  const step = event.shiftKey ? 3 : 1;
  const deeper = STOPS.findIndex((m) => m > from + 0.5);
  let shallower = -1;
  for (let i = STOPS.length - 1; i >= 0; i--) if (STOPS[i] < from - 0.5) { shallower = i; break; }
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") to = deeper < 0 ? RECORD_M : STOPS[Math.min(STOPS.length - 1, deeper + step - 1)];
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") to = shallower < 0 ? 0 : STOPS[Math.max(0, shallower - step + 1)];
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = RECORD_M;
  if (to === null) return;
  event.preventDefault();
  steer(railOf(to));
});
still.addEventListener?.("change", () => { touring = !still.matches; run(); });
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
draw(still.matches, 0, SW_FAST + (SW_SLOW - SW_FAST) * dive);
}
`;

const keys = [
  { mark: "blue", label: "Air: the lungs, and the oxygen kept in them" },
  { mark: "red", label: "Oxygen held in the blood and muscle, and each heartbeat" },
  { mark: "lit", label: "Needle: pressure, one atmosphere for every 10 m" },
];

const stage = `<div class="iso-stage" tabindex="0" role="slider" aria-label="Deep diving rig: right or down arrow to dive deeper, left or up to rise, Shift for bigger steps, Home for the surface, End for the record depth" aria-valuemin="0" aria-valuemax="${M.RECORD_M}" aria-valuenow="${START_M}" aria-valuetext="${M.describeOf(START_M).replace(/"/g, "&quot;")}">${svg}</div>`;

// The embed leaves the legend and caption to the host page, so they stay in its
// prerendered HTML (pages/anatomy.vue renders `keys` and `caption` from model.mjs).
const body = k.plateHtml({
  fig: "Fig 4",
  title: "Deep diving",
  hint: "Drag to dive · ← →",
  readout: M.readoutOf(START_M),
  keys: embed ? [] : keys,
  caption: embed ? undefined : M.page.caption,
  body: stage,
});

// Site palette, as in Fig 1: navy surfaces, cyan and magenta accents.
const DD_CSS = `
.iso{--anatomy-page:#061624;--anatomy-card:#0a223a;--anatomy-text:#9fb8cc;--anatomy-strong:#e0f2fe;--anatomy-muted:#6684a0;
  --anatomy-paper:#0a223a;--anatomy-face:#0e3052;--anatomy-top:#0f3255;
  --anatomy-shade-0:#081b2e;--anatomy-shade-1:#092037;--anatomy-shade-2:#0b2640;--anatomy-shade-3:#0d2b49;
  --anatomy-lit-top:#144474;--anatomy-lit-shade:#0f3458;
  --anatomy-hi:#cfe6f6;--anatomy-mid:#5e7f9c;--anatomy-lo:#37546f;--anatomy-faint:#1f3b57;--anatomy-lit:#ffffff;
  --anatomy-halo:#01060c;--anatomy-dot:#e0f2fe;--anatomy-blue:#00f0ff;--anatomy-red:#ff3ec8;
  --dd-deep-top:rgba(16,51,82,.86);--dd-deep-bottom:rgba(8,28,49,.9);--dd-water:rgba(96,176,240,.075);--dd-tank:rgba(8,28,49,.55);
  --dd-air-paper:#0b3343;--dd-air-0:#092a38;--dd-air-1:#0a3040;--dd-air-2:#0c3648;--dd-air-3:#0e3d51;--dd-air-top:#12506a;
  --dd-blood-paper:#33113a;--dd-blood-0:#290d2f;--dd-blood-1:#2f1036;--dd-blood-2:#36123d;--dd-blood-3:#3d1545;--dd-blood-top:#521a5a}
.iso[data-theme="light"]{--anatomy-blue:#0891b2;--anatomy-red:#d23a8f;
  --dd-deep-top:rgba(214,232,244,.9);--dd-deep-bottom:rgba(196,218,234,.92);--dd-water:rgba(40,120,190,.06);--dd-tank:rgba(220,234,244,.6);
  --dd-air-paper:#d3f1f7;--dd-air-0:#b9e6ef;--dd-air-1:#c4ebf3;--dd-air-2:#cdeff6;--dd-air-3:#d7f3f8;--dd-air-top:#e6f8fb;
  --dd-blood-paper:#f6d6ea;--dd-blood-0:#ecbdd9;--dd-blood-1:#f0c7df;--dd-blood-2:#f3d0e5;--dd-blood-3:#f6d9ea;--dd-blood-top:#fbe8f3}
.iso-plate{box-shadow:0 0 0 1px var(--anatomy-faint)}
.iso-stage{touch-action:pan-y;cursor:grab;outline:none}
.iso-stage:active{cursor:grabbing}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.dd-deep{fill:url(#dd-deep);stroke:none}
.dd-water{fill:var(--dd-water);stroke:none}
.dd-tank{fill:var(--dd-tank);stroke:none}
.dd-air{--anatomy-paper:var(--dd-air-paper);--anatomy-shade-0:var(--dd-air-0);--anatomy-shade-1:var(--dd-air-1);--anatomy-shade-2:var(--dd-air-2);--anatomy-shade-3:var(--dd-air-3);--anatomy-top:var(--dd-air-top);--anatomy-hi:var(--anatomy-blue)}
.dd-blood{--anatomy-paper:var(--dd-blood-paper);--anatomy-shade-0:var(--dd-blood-0);--anatomy-shade-1:var(--dd-blood-1);--anatomy-shade-2:var(--dd-blood-2);--anatomy-shade-3:var(--dd-blood-3);--anatomy-top:var(--dd-blood-top);--anatomy-hi:var(--anatomy-red)}
.dd-band{fill:var(--anatomy-blue);stroke:none;opacity:.75}
.dd-flash{fill:var(--anatomy-red);stroke:none}
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
  .pageHtml({ title: "Deep diving", theme, body, script: kitScript() + live + (embed ? EMBED_SCRIPT : "") })
  .replace('<meta charset="utf-8">', `<meta charset="utf-8">${MIT_NOTICE}`)
  .replace("</style></head>", `${DD_CSS}${embed ? EMBED_CSS : ""}</style></head>`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log("wrote", OUT, (Buffer.byteLength(html) / 1024).toFixed(1) + " KB");
