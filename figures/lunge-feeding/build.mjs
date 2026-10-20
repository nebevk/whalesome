// Fig 3 · Lunge feeding. A gulp-and-sieve rig built like a rorqual's mouth.
//
//   ANATOMY_KIT=/path/to/anatomy node figures/lunge-feeding/build.mjs [--standalone] [--light] [--out path.html]
//
// By default this writes the embed build the site uses, public/figures/lunge-feeding.html:
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
const T = await fromKit("kit/tube.mjs");
const { kitScript } = await fromKit("scripts/inline-kit.mjs");
// The shared geometry below runs here and, serialized, in the page, where the kit's
// functions are globals: give them the same names here.
const { iso, pathOf, cameraOf, cylinder, roundedPlan, insetPlan, lineOnTop } = k;

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const theme = argv.includes("--light") ? "light" : "dark";
const embed = !argv.includes("--standalone");
const outAt = argv.indexOf("--out");
const OUT = outAt >= 0
  ? argv[outAt + 1]
  : embed
    ? join(HERE, "..", "..", "public", "figures", "lunge-feeding.html")
    : join(HERE, theme === "light" ? "lunge-feeding-light.html" : "lunge-feeding.html");

const WIDTH = 600;
const HEIGHT = 380;
const RAD = Math.PI / 180;
const AZIMUTH = 60;

// ---------------------------------------------------------------------------
// World. x runs along the rig from the back (−x) to the snout (+x), y across it toward
// the viewer, z up; 1 unit ~ 1 px. The jaw joint is at (HX, ZP); the jaw drops in the x-z plane.
const W = {
  HX: -6, // jaw joint
  ZP: 84,
  RJ: 72, // joint to chin
  BAR_IN: 15.5, // the two jaw bones, y from BAR_IN to BAR_OUT on each side
  BAR_OUT: 19.5,
  BAR_BACK: 5.2, // half-depth at the joint (the boss) and at the chin
  BAR_FRONT: 2.7,
  CHIN_L: 7,
  CHIN_H: 2.6,
  SENSOR_R: 2.1,
  SENSOR_H: 1.3,
  CAP_Y: 21.6, // outer face of the hinge caps
  GAPE: M.GAPE_DEG * RAD,
  BELLOWS: { x: -94, y: -13, w: 68, d: 26, r: 5 },
  FOLD: 2.8, // how far the inner folds sit inside the outer ones
  FOLDS: 6,
  FLANGE_Z: 63, // the bellows hang from here
  D_MIN: 6, // bellows height, empty and full
  D_MAX: 38,
  FLOOR_H: 3,
  RAM: [-60, 0],
  SLEEVE_TOP: 16,
  PAD_H: 1.6,
  CONTROLLER: { x: -14, y: 14, w: 10, d: 9.6, r: 1 },
  CONTROLLER_Z: 91,
  CONTROLLER_TOP: 98.5,
};

const PLATE = { x: -128, y: -34, w: 172, d: 68, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;
const RULER_X0 = -100; // 0 m on the length ruler (a multiple of 5 ticks, so 0 m is a major tick)
const UPM = 5; // world units per metre of whale
const lengthX = (m) => RULER_X0 + m * UPM;
const STRIP = { x: RULER_X0 - 4, y: 24.4, w: M.RULER_M * UPM + 8, d: 4, r: 0.7 };
const RIDER = { x: -4.6, y: 22.2, w: 9.2, d: 8.6, r: 1.2 };
const RIDER_H = 2.6;

const COLUMN = { x: -15, y: -8, w: 12, d: 16, r: 1.5 };
const SKULL = { x: -18, y: -14, w: 18, d: 28, r: 2 };
const SKULL_Z0 = 62;
const SKULL_Z1 = 110;
const ZU = 100; // underside of the upper jaw
const ZU1 = 107;
const SNOUT = 74;
const halfWidth = (x) => 18 - (6 * x) / SNOUT;
const GUM = 1.4;
const PLATES = 17;
const plateX = (i) => 6 + i * 3.6;
// Rorqual baleen is shortest at the tip of the snout and longest toward the back of the mouth.
const plateDepth = (i) => { const u = 1 - i / (PLATES - 1); return 4 + 10 * (Math.sin((Math.PI / 2) * Math.min(1, u / 0.72)) - Math.max(0, u - 0.72) * 1.1); };

const HOUSING = { x: -102, y: -15, w: 84, d: 30, r: 3 };
const HOUSING_Z0 = 66;
const HOUSING_Z1 = 80;
const DIAL_R = 11.5;
const DIAL_TOP = 86;
const DIALS = { volume: [-82, 0], watch: [-50, 0] };
const DIAL_GAP = Math.atan2(Math.cos(AZIMUTH * RAD), -Math.sin(AZIMUTH * RAD)); // plan direction toward the viewer
const DIAL_SPAN = 270 * RAD;
const DIAL_FROM = DIAL_GAP + (360 * RAD - DIAL_SPAN) / 2;
const TICK_R = DIAL_R - 2.4;

const POSTS = [[-101, -12.5], [-101, 9.5]];
const TRAY = { x: -127, y: -10, w: 22, d: 26, r: 1.5 };
const TRAY_H = 5;

const SWARM = { x: [78, 96], y: [-10, 10], z: [72, 98] };

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...k.boxCorners(SKULL, SKULL_Z0, SKULL_Z1),
    [SNOUT, halfWidth(SNOUT), ZU1],
    [SWARM.x[1], SWARM.y[1], SWARM.z[1]],
    [DIALS.volume[0], -DIAL_R, DIAL_TOP],
  ],
  WIDTH,
  HEIGHT,
  { pad: 18, azimuth: AZIMUTH },
);

const at = (point) => iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const poly = (points) => pathOf(points.map(at), true);
const slab = (plan, z, h, tone = "mid", steps = 4, bevel = 0.5, extra = {}) => S(k.slabOf(plan, z, h, P, steps, bevel), { tone, ...extra });
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
// A rounded rectangle on a vertical face that faces +y, as one closed outline.
function faceRect(x0, x1, y, z0, z1, r) {
  const points = [];
  const corner = (cx, cz, from) => { for (let i = 0; i <= 4; i++) { const a = from + (i / 4) * (Math.PI / 2); points.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); } };
  corner(x1 - r, z0 + r, -Math.PI / 2); corner(x1 - r, z1 - r, 0); corner(x0 + r, z1 - r, Math.PI / 2); corner(x0 + r, z0 + r, Math.PI);
  return poly(points);
}
const along = (axis, o) => G.frameAlong(o, axis);

// ---------------------------------------------------------------------------
// Shared geometry: these run at build time for the first frame and in the page every
// frame. They use only the kit's globals, P and W.
// The kit's iso() and pathOf(), without recomputing the camera for every point: these run
// thousands of times a frame.
function fastIso(p) {
  const c = fastIso.c || (fastIso.c = cameraOf(P));
  return [P.origin[0] + (p[0] * c.sinA - p[1] * c.cosA) * c.k, P.origin[1] + ((p[0] * c.cosA + p[1] * c.sinA) * c.sinE - p[2] * c.cosE) * c.k];
}
function fastPath(points, closed) {
  let out = "";
  for (let i = 0; i < points.length; i++) out += (i ? "L" : "M") + Math.round(points[i][0] * 10) / 10 + " " + Math.round(points[i][1] * 10) / 10;
  return closed ? out + "Z" : out;
}
function viewDir() {
  const { sinA, cosA, sinE, cosE } = cameraOf(P);
  return [cosA * cosE, sinA * cosE, sinE];
}
// The kit's cylinder() (extrude of a circle), on the fast projection.
function vcyl(cx, cy, r, z, h, steps) {
  const c = fastIso.c || (fastIso.c = cameraOf(P));
  const ring = [];
  for (let i = 0; i < steps; i++) { const a = (i / steps) * Math.PI * 2; ring.push([Math.cos(a), Math.sin(a)]); }
  const top = ring.map(([x, y]) => fastIso([cx + r * x, cy + r * y, z + h]));
  const bottom = ring.map(([x, y]) => fastIso([cx + r * x, cy + r * y, z]));
  // the facet between point i and i + 1 faces along the mid-angle
  const normals = ring.map((_, i) => { const a = ((i + 0.5) / steps) * Math.PI * 2; return [Math.cos(a), Math.sin(a)]; });
  const facing = normals.map(([nx, ny]) => nx * c.cosA + ny * c.sinA > 1e-9);
  const runs = (want) => {
    const out = [];
    const start = facing.findIndex((f, i) => f !== facing[(i + steps - 1) % steps]);
    let run = null;
    for (let s = 0; s < steps; s++) {
      const i = (start + s) % steps;
      if (facing[i] === want) { if (!run) run = [i]; run.push((i + 1) % steps); } else if (run) { out.push(run); run = null; }
    }
    if (run) out.push(run);
    return out;
  };
  const outline = [];
  const crease = [];
  for (const run of runs(false)) outline.push(fastPath(run.map((i) => top[i])));
  for (const run of runs(true)) { crease.push(fastPath(run.map((i) => top[i]))); outline.push(fastPath(run.map((i) => bottom[i]))); }
  for (let i = 0; i < steps; i++) if (facing[(i + steps - 1) % steps] !== facing[i]) outline.push(fastPath([top[i], bottom[i]]));
  const shades = [[], [], [], []];
  for (let i = 0; i < steps; i++) {
    if (!facing[i]) continue;
    const [nx, ny] = normals[i];
    const lit = (nx * -c.sinA + ny * c.cosA + 1) / 2;
    const next = (i + 1) % steps;
    shades[Math.min(3, Math.max(0, Math.floor(lit * 4)))].push(fastPath([top[i], top[next], bottom[next], bottom[i]], true));
  }
  return { fill: fastPath(hull2([...top, ...bottom]), true), outline: outline.join(""), crease: crease.join(""), top: fastPath(top, true), shades: shades.map((list) => list.join("")) };
}
function lightDir() {
  const { sinA, cosA } = cameraOf(P);
  const n = Math.hypot(sinA, cosA, 1.2);
  return [-sinA / n, cosA / n, 1.2 / n];
}
// The kit's four shades plus the top, by how a face meets the light.
function toneBand(score) {
  const bands = [0, 0.2, 0.42, 0.62];
  let tone = 0;
  while (tone < 4 && score >= bands[tone]) tone++;
  return tone;
}
function hull2(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length < 3) return sorted;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 1e-9) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 1e-9) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
// A convex polygon in a frame's (u, v) plane, extruded along a: the kit's prismOf.
function prism(F, polygon, s0, s1) {
  const V = viewDir();
  const Lg = lightDir();
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  let area = 0;
  for (let j = 0; j < polygon.length; j++) {
    const [x0, y0] = polygon[j];
    const [x1, y1] = polygon[(j + 1) % polygon.length];
    area += x0 * y1 - x1 * y0;
  }
  const ring = area < 0 ? [...polygon].reverse() : polygon;
  const n = ring.length;
  const at3 = (s, [x, y]) => [0, 1, 2].map((i) => F.o[i] + F.a[i] * s + F.u[i] * x + F.v[i] * y);
  const low = ring.map((p) => fastIso(at3(s0, p)));
  const high = ring.map((p) => fastIso(at3(s1, p)));
  const buckets = [[], [], [], [], []];
  const seen = [];
  for (let j = 0; j < n; j++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[(j + 1) % n];
    const raw = [0, 1, 2].map((i) => F.u[i] * (y1 - y0) - F.v[i] * (x1 - x0));
    const length = Math.hypot(raw[0], raw[1], raw[2]) || 1;
    const normal = raw.map((c) => c / length);
    const visible = dot(normal, V) > 1e-6;
    seen.push(visible);
    if (visible) buckets[toneBand(dot(normal, Lg))].push(fastPath([low[j], low[(j + 1) % n], high[(j + 1) % n], high[j]], true));
  }
  const caps = [[low, -1], [high, 1]];
  const capSeen = caps.map(([, sign]) => sign * dot(F.a, V) > 1e-6);
  caps.forEach(([points, sign], index) => capSeen[index] && buckets[toneBand(sign * dot(F.a, Lg))].push(fastPath(points, true)));
  const creases = [];
  for (let j = 0; j < n; j++) {
    const prev = (j - 1 + n) % n;
    const a = [ring[j][0] - ring[prev][0], ring[j][1] - ring[prev][1]];
    const b = [ring[(j + 1) % n][0] - ring[j][0], ring[(j + 1) % n][1] - ring[j][1]];
    const sharp = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) || 1) < Math.cos(0.35);
    if (sharp && seen[j] && seen[prev]) creases.push(fastPath([low[j], high[j]]));
    caps.forEach(([points], index) => capSeen[index] && seen[j] && creases.push(fastPath([points[j], points[(j + 1) % n]])));
  }
  const outline = fastPath(hull2([...low, ...high]), true);
  return { fill: outline, outline, crease: creases.join(""), top: buckets[4].join(""), shades: buckets.slice(0, 4).map((list) => list.join("")) };
}
// One fold of the bellows: the band between two floor rings at two heights.
function loft(ringA, zA, ringB, zB) {
  const V = viewDir();
  const Lg = lightDir();
  const n = ringA.length;
  let cx = 0;
  let cy = 0;
  for (const [x, y] of ringA) { cx += x / n; cy += y / n; }
  const A = ringA.map(([x, y]) => [x, y, zA]);
  const B = ringB.map(([x, y]) => [x, y, zB]);
  const a2 = A.map((p) => fastIso(p));
  const b2 = B.map((p) => fastIso(p));
  const buckets = [[], [], [], [], []];
  for (let j = 0; j < n; j++) {
    const next = (j + 1) % n;
    const t = [A[next][0] - A[j][0], A[next][1] - A[j][1], 0];
    const s = [B[j][0] - A[j][0], B[j][1] - A[j][1], B[j][2] - A[j][2]];
    let normal = [t[1] * s[2] - t[2] * s[1], t[2] * s[0] - t[0] * s[2], t[0] * s[1] - t[1] * s[0]];
    const length = Math.hypot(normal[0], normal[1], normal[2]) || 1;
    normal = normal.map((c) => c / length);
    const mx = (A[j][0] + A[next][0]) / 2 - cx;
    const my = (A[j][1] + A[next][1]) / 2 - cy;
    if (normal[0] * mx + normal[1] * my < 0) normal = normal.map((c) => -c);
    if (normal[0] * V[0] + normal[1] * V[1] + normal[2] * V[2] <= 1e-6) continue;
    buckets[toneBand(normal[0] * Lg[0] + normal[1] * Lg[1] + normal[2] * Lg[2])].push(fastPath([a2[j], a2[next], b2[next], b2[j]], true));
  }
  const outline = fastPath(hull2([...a2, ...b2]), true);
  return { fill: outline, outline, crease: "", top: buckets[4].join(""), shades: buckets.slice(0, 4).map((list) => list.join("")) };
}
// The jaw turns about the joint: u runs along the bone toward the chin, v is its "up".
function jawFrame(theta) {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return { o: [W.HX, 0, W.ZP], a: [0, 1, 0], u: [c, 0, -s], v: [s, 0, c] };
}
function jawPoint(theta, u, y, v) {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [W.HX + c * u + s * v, y, W.ZP - s * u + c * v];
}
// A jaw bone in side view: a round boss on the joint, a top edge that curves down to the
// chin and a straight lower edge. Convex, so prism() can turn it into a solid.
const barTop = (u) => W.BAR_BACK - (W.BAR_BACK - W.BAR_FRONT) * Math.min(1, Math.max(0, u / W.RJ)) ** 2;
function barPolygon() {
  const out = [];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / 12;
    out.push([W.BAR_BACK * Math.cos(a), W.BAR_BACK * Math.sin(a)]);
  }
  out.push([W.RJ, -W.BAR_FRONT]);
  for (let i = 10; i >= 1; i--) { const u = (W.RJ * i) / 10; out.push([u, barTop(u)]); }
  return out;
}
function mandible(theta, side) {
  return side > 0 ? prism(jawFrame(theta), barPolygon(), W.BAR_IN, W.BAR_OUT) : prism(jawFrame(theta), barPolygon(), -W.BAR_OUT, -W.BAR_IN);
}
function chinBlock(theta) {
  const u0 = W.RJ - W.CHIN_L;
  return prism(jawFrame(theta), [[u0, -W.CHIN_H], [W.RJ, -W.CHIN_H], [W.RJ, W.CHIN_H], [u0, W.CHIN_H]], -W.BAR_IN, W.BAR_IN);
}
function sensorFrame(theta) {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return { o: jawPoint(theta, W.RJ - W.CHIN_L / 2, 0, W.CHIN_H), a: [s, 0, c], u: [c, 0, -s], v: [0, 1, 0] };
}
function sensor(theta) {
  const ring = [];
  for (let i = 0; i < 20; i++) ring.push([W.SENSOR_R * Math.cos((i / 20) * Math.PI * 2), W.SENSOR_R * Math.sin((i / 20) * Math.PI * 2)]);
  return prism(sensorFrame(theta), ring, 0, W.SENSOR_H);
}
// The nerve: from the chin sensor over the chin and the near jaw bone, back along the bone's
// outer face, onto the hinge cap.
function jawWire(theta) {
  const u = W.RJ - W.CHIN_L / 2;
  const top = (x) => barTop(x) + 0.3;
  const face = W.BAR_OUT + 0.1;
  const points = [
    [u, W.SENSOR_R, W.CHIN_H + 0.55],
    [u, W.BAR_IN, W.CHIN_H + 0.3],
    [u - 0.6, (W.BAR_IN + W.BAR_OUT) / 2, top(u - 0.6)],
    [u - 1.2, face, barTop(u - 1.2) - 0.6],
    [u - 3, face, 0.9],
    [5, face, 0.9],
    [3.6, face, 1.1],
    [3.2, W.CAP_Y, 1.05],
    [0, W.CAP_Y, 0],
  ];
  return points.map(([pu, y, pv]) => jawPoint(theta, pu, y, pv));
}
// The bellows at height d: rings from the flange down, inner and outer by turns.
function bellowsRings(d) {
  const outer = roundedPlan(W.BELLOWS, 4);
  const inner = roundedPlan(insetPlan(W.BELLOWS, W.FOLD), 4);
  const count = W.FOLDS * 2;
  const rings = [];
  for (let i = 0; i <= count; i++) rings.push({ ring: i % 2 ? outer : inner, z: W.FLANGE_Z - (d * i) / count });
  return rings;
}
function bellows(d) {
  const rings = bellowsRings(d);
  const out = [];
  for (let i = rings.length - 2; i >= 0; i--) out.push(loft(rings[i + 1].ring, rings[i + 1].z, rings[i].ring, rings[i].z));
  return out;
}
// The ram under the floor plate: a sleeve (static), two telescoping stages and a pad.
function ram(floorBottom) {
  const [cx, cy] = W.RAM;
  const reach = Math.max(0, floorBottom - W.PAD_H - W.SLEEVE_TOP);
  const z2 = W.SLEEVE_TOP;
  const top2 = z2 + reach / 2;
  return {
    stage2: vcyl(cx, cy, 4.6, z2, Math.max(0.01, top2 - z2 - 1.4), 28),
    collar2: vcyl(cx, cy, 5.4, top2 - 1.4, 1.4, 28),
    stage3: vcyl(cx, cy, 3.2, top2, Math.max(0.01, floorBottom - W.PAD_H - top2), 24),
    pad: vcyl(cx, cy, 5.2, floorBottom - W.PAD_H, W.PAD_H, 28),
  };
}

const SHARED = [fastIso, fastPath, vcyl, viewDir, lightDir, toneBand, hull2, prism, loft, jawFrame, jawPoint, barPolygon, mandible, chinBlock, sensorFrame, sensor, jawWire, bellowsRings, bellows, ram];
const SHARED_SRC = `const barTop = ${barTop.toString()};\n` + SHARED.map((fn) => fn.toString()).join("\n");

// ---------------------------------------------------------------------------
// Pieces that move are drawn into fixed slots; the page rewrites their paths each frame.
function liveSolid(part, paths, { tone = "hi", crease = "faint", lit = false } = {}) {
  const shades = [0, 1, 2, 3].map((index) => `<path class="iso-shade" data-shade="${index}" d="${paths.shades[index] || ""}"/>`).join("");
  return `<g class="iso-solid" data-part="${part}"${lit ? " data-lit" : ""}><path class="iso-fill" d="${paths.fill}"/>${shades}<path class="iso-top" d="${paths.top || ""}"/><path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease || ""}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/></g>`;
}

const START = 3; // the figure opens on the blue whale
const theta0 = 0; // the page draws its first frame over this one
const D0 = W.D_MIN;
const floorTop = (d) => W.FLANGE_Z - d;
const FLOOR_PLAN = insetPlan(W.BELLOWS, -1.6);

// ---------------------------------------------------------------------------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // the length ruler along the front edge, in metres of whale, with a detent at each species
  out.push(S(k.slabOf(STRIP, 0, 0.5, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(lengthX(0), lengthX(M.RULER_M), UPM, 5, STRIP.y + 0.25, 0.5, [1.1, 2.3], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(lineOnTop([lengthX(0), STRIP.y + 0.25], [lengthX(0), STRIP.y + 3.6], 0.5, P), { tone: "hi" }));
  out.push(L(M.SPECIES.map((s) => k.ring(lengthX(s.length), STRIP.y + 3.2, 0.55, 0.5, P, 12)).join(""), { tone: "mid" }));
  out.push(D([at([STRIP.x + 1.6, STRIP.y + 2, 0.5]), at([STRIP.x + STRIP.w - 1.6, STRIP.y + 2, 0.5])], { size: 0.45 }));
  // a foot plate under the pedestal and under each support
  out.push(slab(insetPlan(COLUMN, -3), 0, 1.4, "lo", 4, 0.3));
  out.push(D(k.corners(insetPlan(COLUMN, -3), 1.4).map(([x, y]) => at([x, y, 1.4])), { size: 0.42 }));
  return out.join("");
}

function trayBack() {
  const out = [];
  out.push(slab(TRAY, 0, 1.2, "lo", 3, 0.3));
  out.push(slab({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 1.4, r: 0.5 }, 1.2, TRAY_H - 1.2, "mid", 2, 0.3));
  out.push(slab({ x: TRAY.x, y: TRAY.y, w: 1.4, d: TRAY.d, r: 0.5 }, 1.2, TRAY_H - 1.2, "mid", 2, 0.3));
  return out.join("");
}

// The heap of swallowed krill: dots the page shows one lunge at a time.
const HEAP = (() => {
  const out = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 42; i++) {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * (5.5 - i * 0.07);
    const x = -116 + r * Math.cos(a) * 1.25;
    const y = 3 + r * Math.sin(a);
    const z = 1.6 + (5.5 - r) * 0.42 + i * 0.03;
    out.push([x, y, z]);
  }
  return out.sort((a, b) => a[2] - b[2]);
})();
function heap() {
  return `<g class="lf-heap" data-part="heap">${HEAP.map((p) => { const [x, y] = at(p); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.75" style="opacity:0"/>`; }).join("")}</g>`;
}

// The gullet: a chute from the back of the body into the stomach tray.
const CHUTE_R = 1.7;
const CHUTE_END = 11;
const CHUTE = G.fillet([[HOUSING.x - 1.2, 3, 72], [-112, 3, 72], [-116, 3, 66], [-116, 3, CHUTE_END]], 4.5, 7, { P, tube: CHUTE_R });
function chute() {
  const out = [];
  out.push(S(G.disc(-1.2, 0, 3.4, along([1, 0, 0], [HOUSING.x, 3, 72]), P), { tone: "mid" }));
  for (const piece of T.tubePieces(CHUTE, CHUTE_R, P, { maxLength: 400 })) out.push(T.tubeSvg(piece, { tone: "mid" }));
  // a spout collar where the chute ends over the tray
  out.push(S(G.disc(0, 1.6, CHUTE_R + 0.8, along([0, 0, 1], [-116, 3, CHUTE_END - 0.4]), P), { tone: "mid" }));
  return out.join("");
}

function trayFront() {
  const out = [];
  out.push(slab({ x: TRAY.x + TRAY.w - 1.4, y: TRAY.y, w: 1.4, d: TRAY.d, r: 0.5 }, 1.2, TRAY_H - 1.2, "mid", 2, 0.3));
  out.push(slab({ x: TRAY.x, y: TRAY.y + TRAY.d - 1.4, w: TRAY.w, d: 1.4, r: 0.5 }, 1.2, TRAY_H - 1.2, "mid", 2, 0.3));
  out.push(D([[TRAY.x + 0.7, TRAY.y + TRAY.d - 0.7], [TRAY.x + TRAY.w - 0.7, TRAY.y + TRAY.d - 0.7], [TRAY.x + TRAY.w - 0.7, TRAY.y + 0.7]].map(([x, y]) => at([x, y, TRAY_H])), { size: 0.4 }));
  return out.join("");
}

function posts() {
  const out = [];
  for (const [x, y] of byDepth(POSTS)) {
    out.push(slab({ x: x - 2.5, y: y - 2.5, w: 8, d: 8, r: 1 }, 0, 1.4, "lo", 3, 0.3));
    out.push(slab({ x, y, w: 3, d: 3, r: 0.6 }, 1.4, HOUSING_Z0 - 1.4, "mid", 2, 0.3));
  }
  return out.join("");
}

function ramBase() {
  const [cx, cy] = W.RAM;
  const out = [];
  out.push(S(k.cylinder(cx, cy, 9, 0, 1.6, P, 40), { tone: "lo" }));
  out.push(D([0, 90, 180, 270].map((deg) => at([cx + 7.6 * Math.cos((deg + 45) * RAD), cy + 7.6 * Math.sin((deg + 45) * RAD), 1.6])), { size: 0.42 }));
  out.push(S(k.cylinder(cx, cy, 6.4, 1.6, W.SLEEVE_TOP - 1.6 - 1.8, P, 36), { tone: "mid", inner: L(k.sideArc(cx, cy, 6.4, 6.5, P, 28), { tone: "faint" }) }));
  out.push(S(k.cylinder(cx, cy, 7.2, W.SLEEVE_TOP - 1.8, 1.8, P, 36), { tone: "mid" }));
  out.push(L(k.ring(cx, cy, 4.9, W.SLEEVE_TOP, P, 32), { tone: "faint" }));
  return out.join("");
}

function ramLive(floorBottom) {
  const parts = ram(floorBottom);
  return [
    liveSolid("stage2", parts.stage2, { tone: "mid" }),
    liveSolid("collar2", parts.collar2, { tone: "mid" }),
    liveSolid("stage3", parts.stage3, { tone: "mid", crease: "none" }),
    liveSolid("pad", parts.pad, { tone: "mid" }),
  ].join("");
}

function floorPlate() {
  const out = [];
  out.push(S(k.slabOf(FLOOR_PLAN, 0, W.FLOOR_H, P, 5, 0.6), { tone: "mid" }));
  out.push(D(k.corners(FLOOR_PLAN, 2.4).map(([x, y]) => at([x, y, W.FLOOR_H])), { size: 0.42 }));
  const z = floorTop(D0) - W.FLOOR_H;
  return `<g data-part="floor" transform="${k.translateAlong(P, [0, 0, z])}">${out.join("")}</g>`;
}

function bellowsLive() {
  return bellows(D0).map((paths, index) => liveSolid(`fold-${index}`, paths, { tone: "hi", crease: "none" })).join("");
}

function flange() {
  const plan = insetPlan(W.BELLOWS, -1.6);
  const out = [S(k.slabOf(plan, W.FLANGE_Z, 3, P, 5, 0.5), { tone: "mid" })];
  // bolts along the visible edge of the flange
  const bolts = [];
  for (let x = plan.x + 4; x <= plan.x + plan.w - 4 + 1e-9; x += 8) bolts.push([x, plan.y + plan.d - 0.9, W.FLANGE_Z + 1.5]);
  for (let y = plan.y + plan.d - 4; y >= plan.y + 4 - 1e-9; y -= 7.4) bolts.push([plan.x + plan.w - 0.9, y, W.FLANGE_Z + 1.5]);
  out.push(D(bolts.map(at), { size: 0.42 }));
  return out.join("");
}

function housing() {
  const out = [];
  const seam = k.sideSeam(HOUSING, HOUSING_Z0 + 7, P, 4);
  out.push(S(k.slabOf(HOUSING, HOUSING_Z0, HOUSING_Z1 - HOUSING_Z0, P, 4, 0.6), { tone: "mid", inner: L(seam, { tone: "faint" }) }));
  out.push(D(k.corners(HOUSING, 2.4).map(([x, y]) => at([x, y, HOUSING_Z1])), { size: 0.45 }));
  // a label plate on the near face: three rule lines stand for its text
  const yf = HOUSING.y + HOUSING.d;
  out.push(L(faceRect(-97, -77, yf, 68.4, 78, 1), { tone: "lo" }));
  out.push(L([[76, 16], [74.2, 13], [72.4, 15]].map(([z, w]) => k.segment([-94.5, yf, z], [-94.5 + w, yf, z], P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([-95.4, yf, 69.6]), at([-78.6, yf, 69.6])], { size: 0.4 }));
  // an access hatch with four screws
  out.push(L(faceRect(-70, -34, yf, 68.6, 77.8, 1.2), { tone: "lo" }));
  out.push(D([[-68.6, 70], [-35.4, 70], [-68.6, 76.4], [-35.4, 76.4]].map(([x, z]) => at([x, yf, z])), { size: 0.4 }));
  return out.join("");
}

// A face-up dial: puck, knurled bezel, ticks, and later its needle.
function dialBody([cx, cy], minorCount, majorEvery) {
  const out = [];
  out.push(S(k.cylinder(cx, cy, DIAL_R + 1.4, HOUSING_Z1, 1.2, P, 56), { tone: "lo" }));
  out.push(S(k.cylinder(cx, cy, DIAL_R, HOUSING_Z1 + 1.2, DIAL_TOP - HOUSING_Z1 - 1.2, P, 72, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(cx, cy, DIAL_R, DIAL_TOP - 3, DIAL_TOP, 88, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(cx, cy, DIAL_R, DIAL_TOP - 3, P, 56), { tone: "faint" }));
  out.push(L(k.ring(cx, cy, TICK_R, DIAL_TOP, P, 72), { tone: "lo" }));
  const ticks = k.radialTicks(cx, cy, TICK_R, minorCount, majorEvery, DIAL_TOP, [1.3, 2.7], P, DIAL_FROM, DIAL_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  return out.join("");
}

const needleAt = ([cx, cy], share) => {
  const angle = DIAL_FROM + Math.min(1, Math.max(0, share)) * DIAL_SPAN;
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  return lineOnTop([cx - sx * 2.6, cy - sy * 2.6], [cx + sx * (TICK_R - 1.2), cy + sy * (TICK_R - 1.2)], DIAL_TOP + 0.2, P);
};

function dials() {
  const out = [];
  const [vx, vy] = DIALS.volume;
  const [wx, wy] = DIALS.watch;
  out.push(dialBody(DIALS.volume, 20, 4));
  const gap = [Math.sin(DIAL_GAP), -Math.cos(DIAL_GAP)];
  out.push(k.faceTextSvg(k.topMatrix([vx + gap[0] * 5.4 - 0.3, vy + gap[1] * 5.4 + 1.3], DIAL_TOP, P, "x"), "m³", { size: 3, tone: "lo", anchor: "middle" }));
  out.push(dialBody(DIALS.watch, 16, 4));
  // the stopwatch: crown and pusher on its side
  out.push(S(G.disc(0, 2.2, 1.7, along([1, 0, 0], [wx + DIAL_R - 0.2, wy - 3.6, HOUSING_Z1 + 3.2]), P), { tone: "mid" }));
  out.push(S(G.disc(0, 1.2, 1.3, along([1, 0, 0], [wx + DIAL_R + 2.0, wy - 3.6, HOUSING_Z1 + 3.2]), P), { tone: "mid" }));
  return out.join("");
}

function dialTops() {
  const out = [];
  out.push(`<path data-part="needle-volume" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(DIALS.volume, 0)}" style="stroke-width:1.2"/>`);
  out.push(`<path data-part="needle-watch" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(DIALS.watch, 0)}" style="stroke-width:1.2"/>`);
  for (const [cx, cy] of [DIALS.volume, DIALS.watch]) {
    out.push(L(k.ring(cx, cy, 1.6, DIAL_TOP + 0.2, P, 20), { tone: "mid" }));
    out.push(D([at([cx, cy, DIAL_TOP + 0.2])], { size: 0.6, tone: "hi" }));
  }
  return out.join("");
}

function column() {
  const out = [];
  const seams = [18, 40].map((z) => k.sideSeam(COLUMN, z, P, 3)).join("");
  out.push(S(k.slabOf(COLUMN, 1.4, SKULL_Z0 - 1.4, P, 3, 0.5), { tone: "mid", inner: L(seams, { tone: "faint" }) }));
  return out.join("");
}

// The hinge: a shaft through the head, capped on both sides.
const capFrame = (y) => G.frameOf([W.HX, y, W.ZP], [0, Math.sign(y), 0], [1, 0, 0], [0, 0, 1]);
function farCap() {
  return S(G.disc(0, W.CAP_Y - W.BAR_OUT, 3.4, capFrame(-W.BAR_OUT), P), { tone: "mid" });
}
function nearShaft() {
  return S(G.disc(0, W.BAR_IN - SKULL.d / 2, 2.2, capFrame(SKULL.d / 2), P), { tone: "mid" });
}
function nearCap() {
  const F = capFrame(W.BAR_OUT);
  const out = [S(G.disc(0, W.CAP_Y - W.BAR_OUT, 3.4, F, P), { tone: "mid" })];
  out.push(D(G.dotsOf(F, W.CAP_Y - W.BAR_OUT, 2.3, 6, P, { all: true, phase: Math.PI / 6 }), { size: 0.4, tone: "mid" }));
  return out.join("");
}

function skull() {
  const out = [];
  const seam = k.sideSeam(SKULL, 92, P, 4);
  out.push(S(k.slabOf(SKULL, SKULL_Z0, SKULL_Z1 - SKULL_Z0, P, 4, 0.6), { tone: "mid", inner: L(seam, { tone: "faint" }) }));
  out.push(D(k.corners(SKULL, 2.2).map(([x, y]) => at([x, y, SKULL_Z1])), { size: 0.45 }));
  // a cover plate on the near face, below the jaw joint
  const yf = SKULL.y + SKULL.d;
  out.push(L(faceRect(-16.4, -1.6, yf, 64.4, 76.4, 1), { tone: "lo" }));
  out.push(D([[-15.2, 65.6], [-2.8, 65.6], [-15.2, 75.2], [-2.8, 75.2]].map(([x, z]) => at([x, yf, z])), { size: 0.4 }));
  return out.join("");
}

// The upper jaw: a tapered beam with the baleen gums underneath.
const ROSTRUM = (() => {
  const ring = [];
  const tip = SNOUT - 6;
  for (let i = 0; i <= 8; i++) { const x = (tip * i) / 8; ring.push([x, halfWidth(x)]); }
  const r = halfWidth(tip);
  for (let i = 1; i < 12; i++) { const a = Math.PI / 2 - (Math.PI * i) / 12; ring.push([tip + 6 * Math.cos(a), r * Math.sin(a)]); }
  for (let i = 8; i >= 0; i--) { const x = (tip * i) / 8; ring.push([x, -halfWidth(x)]); }
  return ring;
})();
function gum(side) {
  const ring = [];
  const x0 = plateX(0) - 1.6;
  const x1 = plateX(PLATES - 1) + 2.4;
  for (const x of [x0, x1]) ring.push([x, side * (halfWidth(x) - 0.6)]);
  for (const x of [x1, x0]) ring.push([x, side * (halfWidth(x) - 7)]);
  return S(k.extrude(side > 0 ? ring : ring.reverse(), ZU - GUM, GUM, P), { tone: "mid" });
}
// One row of baleen plates. Each plate is a thin triangle hanging from the gum, its fringed
// inner edge toward the middle of the mouth.
function comb(side) {
  const plates = [];
  for (let i = 0; i < PLATES; i++) {
    const x = plateX(i);
    const yOut = side * (halfWidth(x) - 1.2);
    const yIn = side * (halfWidth(x) - 6.6);
    const h = plateDepth(i);
    const F = G.frameOf([x, 0, ZU - GUM], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    const paths = G.prismOf(F, [[yOut, 0], [yIn, 0], [yOut - side * 1.6, -h]], -0.4, 0.4, P);
    plates.push({ x, svg: S(paths, { tone: "hi", crease: "lo" }), tip: [x, yOut - side * 1.6, ZU - GUM - h], inner: [x + 0.4, yIn, ZU - GUM], h });
  }
  // nearer plates paint later: with the viewer on +x, +y that is the front end
  plates.sort((a, b) => a.x - b.x);
  const out = plates.map((p) => p.svg);
  // the fringe: bristle tips along each plate's inner edge
  const fringe = [];
  for (const p of plates) for (let t = 0.25; t <= 0.8; t += 0.18) fringe.push(at([p.inner[0], p.inner[1] + (p.tip[1] - p.inner[1]) * t + side * 0.5, p.inner[2] + (p.tip[2] - p.inner[2]) * t]));
  out.push(D(fringe, { size: 0.32, tone: "mid" }));
  return out.join("");
}

function beam() {
  const out = [];
  const seam = k.ringSeam(ROSTRUM, ZU + 3.4, P);
  out.push(S(k.extrude(ROSTRUM, ZU, ZU1 - ZU, P, { bevel: 0.6 }), { tone: "mid", inner: L(seam, { tone: "faint" }) }));
  out.push(D([[6, 12], [6, -12], [36, 9], [36, -9], [60, 6.4], [60, -6.4]].map(([x, y]) => at([x, y, ZU1])), { size: 0.45 }));
  // a stiffening rib along the top of the long upper jaw
  const rib = { x: 3, y: -1.3, w: 56, d: 2.6, r: 1.1 };
  out.push(slab(rib, ZU1, 1.1, "mid", 3, 0.3));
  out.push(D([rib.x + 2, rib.x + rib.w / 2, rib.x + rib.w - 2].map((x) => at([x, 0, ZU1 + 1.1])), { size: 0.4 }));
  return out.join("");
}

function controller() {
  const out = [];
  const C = W.CONTROLLER;
  out.push(slab(C, W.CONTROLLER_Z, W.CONTROLLER_TOP - W.CONTROLLER_Z, "mid", 3, 0.4));
  out.push(D(k.corners(C, 1.4).map(([x, y]) => at([x, y, W.CONTROLLER_TOP])), { size: 0.4 }));
  out.push(S(k.cylinder(C.x + 3, C.y + C.d / 2 + 1.2, 1.7, W.CONTROLLER_TOP, 1.1, P, 24), { tone: "mid" }));
  // the fixed half of the nerve: from the hinge cap up to the controller
  out.push(k.wireSvg(at([W.HX, W.CAP_Y, W.ZP]), at([W.HX, W.CAP_Y, W.CONTROLLER_Z]), { tone: "mid", size: 0.9 }));
  out.push(`<circle data-part="lamp" class="lf-glow" cx="${at([C.x + 3, C.y + C.d / 2 + 1.2, W.CONTROLLER_TOP + 1.1])[0].toFixed(1)}" cy="${at([C.x + 3, C.y + C.d / 2 + 1.2, W.CONTROLLER_TOP + 1.1])[1].toFixed(1)}" r="1.3" style="opacity:0"/>`);
  return out.join("");
}

function jawLive(theta, side) {
  if (side < 0) return liveSolid("far-bar", mandible(theta, -1), { tone: "hi", crease: "lo" });
  const wire = jawWire(theta).map(at);
  return [
    liveSolid("near-bar", mandible(theta, 1), { tone: "hi", crease: "lo" }),
  ].join("") + `<g data-part="nerve" class="iso-wire" data-tone="mid"><path class="iso-line" data-tone="mid" d="${pathOf(wire)}"/><circle class="iso-wire-end" cx="${wire[0][0].toFixed(1)}" cy="${wire[0][1].toFixed(1)}" r="0.9"/></g>`;
}

function chinLive(theta) {
  return liveSolid("chin", chinBlock(theta), { tone: "hi", crease: "lo" }) + liveSolid("sensor", sensor(theta), { tone: "hi", crease: "lo" }) +
    `<circle data-part="sensor-glow" class="lf-glow" cx="0" cy="0" r="1.5" style="opacity:0"/>`;
}

function rider() {
  const out = [];
  out.push(S(k.slabOf(RIDER, 0, RIDER_H, P, 3, 0.4), { tone: "mid" }));
  out.push(L(lineOnTop([0, RIDER.y + 0.5], [0, RIDER.y + RIDER.d - 0.5], RIDER_H, P), { tone: "hi" }));
  out.push(D([at([RIDER.x + 1.2, RIDER.y + 1.2, RIDER_H]), at([RIDER.x + RIDER.w - 1.2, RIDER.y + 1.2, RIDER_H])], { size: 0.42 }));
  // a knurled thumb wheel on the front face
  const F = along([0, 1, 0], [0, RIDER.y + RIDER.d, 1.3]);
  out.push(S(G.disc(0, 1.6, 1.1, F, P), { tone: "mid" }));
  const x = lengthX(M.SPECIES[START].length);
  return `<g data-part="rider" transform="${k.translateAlong(P, [x, 0, 0])}">${out.join("")}</g>`;
}

const KRILL_COUNT = 30;
function krillLayer(part) {
  return `<g class="lf-krill" data-part="${part}">${Array.from({ length: KRILL_COUNT }, () => `<circle cx="0" cy="0" r="1" style="opacity:0"/>`).join("")}</g>`;
}
const jetPool = (part, count) => `<g data-part="${part}">${Array.from({ length: count }, () => `<path class="lf-jet" d="M0 0" style="opacity:0"/>`).join("")}</g>`;

const label =
  "A gulp-and-sieve rig built like a rorqual's mouth. A long top beam, the upper jaw, carries two combs of fringed plates, the baleen. Below it a jaw frame hinged at the back drops open, with a sensor at its chin wired to the head. Behind the head a pleated bellows hangs under the body on a ram, with a dial for the water held and a stopwatch on top, and a chute runs from the back to a tray. A rider on a ruler in metres sets the whale's length.";

const floorBottom0 = floorTop(D0) - W.FLOOR_H;
const body = [
  base(),
  trayBack(),
  heap(),
  chute(),
  trayFront(),
  posts(),
  ramBase(),
  ramLive(floorBottom0),
  floorPlate(),
  bellowsLive(),
  flange(),
  housing(),
  dials(),
  dialTops(),
  column(),
  farCap(),
  jawLive(theta0, -1),
  skull(),
  gum(-1),
  comb(-1),
  krillLayer("krill-in"),
  comb(1),
  gum(1),
  krillLayer("krill-comb"),
  chinLive(theta0),
  beam(),
  nearShaft(),
  jawLive(theta0, 1),
  nearCap(),
  controller(),
  krillLayer("krill-out"),
  jetPool("jets", 26),
  jetPool("inflow", 12),
  `<circle data-part="pulse" class="lf-glow" cx="0" cy="0" r="1.2" style="opacity:0"/>`,
  rider(),
];
const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label, body });

// ---------------------------------------------------------------------------
// Krill: where each one starts in the swarm, where it ends up in the mouth and on the comb.
const KRILL = (() => {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: KRILL_COUNT }, (_, i) => {
    const swarm = [SWARM.x[0] + rnd() * (SWARM.x[1] - SWARM.x[0]), SWARM.y[0] + rnd() * (SWARM.y[1] - SWARM.y[0]), SWARM.z[0] + rnd() * (SWARM.z[1] - SWARM.z[0])];
    const x = 12 + rnd() * 48;
    const near = i % 2 === 1;
    const mouth = [x, -6 + rnd() * 12, 89 + rnd() * 7];
    // caught on the fringe: on the inner edge of a plate of the near comb, or out of sight on the far one
    const j = 2 + Math.floor(rnd() * (PLATES - 5));
    const t = 0.15 + rnd() * 0.4;
    const px = plateX(j);
    const yIn = halfWidth(px) - 6.6;
    const yTip = halfWidth(px) - 2.8;
    const combPoint = near ? [px + 0.5, yIn + (yTip - yIn) * t + 0.3, ZU - GUM - plateDepth(j) * t] : [x, -(halfWidth(x) - 7.4), 88.5 + rnd() * 8];
    return { swarm, mouth, comb: combPoint, near, delay: 0.08 + rnd() * 0.3, phase: rnd() * Math.PI * 2 };
  });
})();

const DATA = {
  W,
  species: M.SPECIES.map((s) => ({ ...s, readout: M.readoutOf(s), text: M.describe(s), x: lengthX(s.length), shown: Math.round(s.length * 10 + 1e-6) / 10 })),
  speedup: M.SPEEDUP,
  dialM3: M.DIAL_M3,
  dialS: M.DIAL_S,
  dials: DIALS,
  dial: { from: DIAL_FROM, span: DIAL_SPAN, tickR: TICK_R, top: DIAL_TOP },
  ruler: { x0: lengthX(0), x1: lengthX(M.RULER_M), y: STRIP.y + 2 },
  floorH: W.FLOOR_H,
  krill: KRILL,
  heap: HEAP.length,
  gullet: [2, 0, 92],
  plateXs: Array.from({ length: PLATES }, (_, i) => plateX(i)),
  zu: ZU - GUM,
  start: START,
  tour: [3, 0, 1, 2],
};

const live = `
{
const P = ${JSON.stringify(P)};
const W = ${JSON.stringify(W)};
const DATA = ${JSON.stringify(DATA)};
${SHARED_SRC}
const halfWidth = ${halfWidth.toString()};
const SNOUT = ${SNOUT};
const SPECIES = DATA.species;
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const q = (name) => svg.querySelector('[data-part="' + name + '"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const put = (el, name, value) => { const v = String(value); if (!el.__v) el.__v = {}; if (el.__v[name] !== v) { el.__v[name] = v; el.setAttribute(name, v); } };
const show = (el, alpha) => { const v = alpha < 0.004 ? "0" : alpha.toFixed(3); if (el.__o !== v) { el.__o = v; el.style.opacity = v; } };
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const clamp = (t) => Math.min(1, Math.max(0, t));
const flash = (age, rise, fall) => (age < 0 ? 0 : age < rise ? ease(age / rise) : Math.exp(-(age - rise) / fall));
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function paint(g, paths) {
  const c = g.children;
  put(c[0], "d", paths.fill);
  for (let i = 0; i < 4; i++) put(c[1 + i], "d", paths.shades[i] || "");
  put(c[5], "d", paths.top || "");
  put(c[6], "d", paths.crease || "");
  put(c[7], "d", paths.outline);
}
const folds = [...svg.querySelectorAll('[data-part^="fold-"]')];
const parts = { farBar: q("far-bar"), nearBar: q("near-bar"), chin: q("chin"), sensor: q("sensor"), stage2: q("stage2"), collar2: q("collar2"), stage3: q("stage3"), pad: q("pad") };
const nerve = q("nerve").children;
const floor = q("floor"), rider = q("rider"), lamp = q("lamp"), sensorGlow = q("sensor-glow"), pulse = q("pulse");
const needleV = q("needle-volume"), needleW = q("needle-watch");
const krillIn = [...q("krill-in").children], krillComb = [...q("krill-comb").children], krillOut = [...q("krill-out").children];
const heapDots = [...q("heap").children];
const jets = [...q("jets").children].map((el) => ({ el, born: -9, from: null, to: null }));
const inflow = [...q("inflow").children].map((el) => ({ el, born: -9, from: null, to: null }));
const needleAt = (center, share) => {
  const angle = DATA.dial.from + clamp(share) * DATA.dial.span;
  const sx = Math.sin(angle), sy = -Math.cos(angle);
  return lineOnTop([center[0] - sx * 2.6, center[1] - sy * 2.6], [center[0] + sx * (DATA.dial.tickR - 1.2), center[1] + sy * (DATA.dial.tickR - 1.2)], DATA.dial.top + 0.2, P);
};
const OPEN = 1.5, CLOSE = 1.5, REST = 0.8, SWALLOW = 0.9;

let current = DATA.start, shownX = SPECIES[current].x, targetX = shownX;
let phase = "rest", phaseT = 0, clock = 0, last = 0, frame = 0, visible = false;
let touring = !still.matches, tourStep = 0, idleTimer = 0, dragging = false;
let held = 0, heldShown = 0, watch = 0, watchShown = 0, flashAt = -9, heapCount = 0, heapShown = 0, krillAlpha = 1;
let filterElapsed = 0, lastSpawn = 0;

function describeTo(index) {
  stage.setAttribute("aria-valuenow", String(SPECIES[index].shown));
  stage.setAttribute("aria-valuetext", SPECIES[index].text);
}
function select(index, settle) {
  index = Math.min(SPECIES.length - 1, Math.max(0, index));
  if (index !== current) { current = index; describeTo(index); }
  if (settle) targetX = SPECIES[index].x;
}

function pose(calm) {
  const s = SPECIES[current];
  // the jaw and the fill of the throat, from the phase
  let theta = 0, fill = 0, gulp = 0;
  const p = phase === "filter" ? clamp(filterElapsed / s.filter) : clamp(phaseT / (phase === "open" ? OPEN : phase === "close" ? CLOSE : phase === "swallow" ? SWALLOW : REST));
  if (calm) { theta = W.GAPE; fill = 1; gulp = 0.55; }
  else if (phase === "open") { theta = W.GAPE * ease(p); gulp = (p * OPEN) / (OPEN + CLOSE); fill = ease(gulp); }
  else if (phase === "close") { theta = W.GAPE * (1 - ease(p)); gulp = (OPEN + p * CLOSE) / (OPEN + CLOSE); fill = ease(gulp); }
  else if (phase === "filter") { fill = 1 - ease(p); gulp = 1; }
  return { s, p, theta, fill, gulp };
}

let drawnTheta = null, drawnD = null, wire = null;
function draw(calm) {
  const { s, p, theta, fill, gulp } = pose(calm);
  // rebuild the jaw and the throat only when they move
  if (drawnTheta === null || Math.abs(theta - drawnTheta) > 1e-5) {
    drawnTheta = theta;
    paint(parts.farBar, mandible(theta, -1));
    paint(parts.nearBar, mandible(theta, 1));
    paint(parts.chin, chinBlock(theta));
    paint(parts.sensor, sensor(theta));
    wire = jawWire(theta).map((point) => iso(point, P));
    put(nerve[0], "d", pathOf(wire));
    put(nerve[1], "cx", wire[0][0].toFixed(1)); put(nerve[1], "cy", wire[0][1].toFixed(1));
  }
  const d = W.D_MIN + (W.D_MAX - W.D_MIN) * fill;
  if (drawnD === null || Math.abs(d - drawnD) > 1e-4) {
    drawnD = d;
    const plates = bellows(d);
    for (let i = 0; i < folds.length; i++) paint(folds[i], plates[i]);
    const floorBottom = W.FLANGE_Z - d - DATA.floorH;
    put(floor, "transform", translateAlong(P, [0, 0, floorBottom]));
    const r = ram(floorBottom);
    paint(parts.stage2, r.stage2); paint(parts.collar2, r.collar2); paint(parts.stage3, r.stage3); paint(parts.pad, r.pad);
  }
  // needles
  put(needleV, "d", needleAt(DATA.dials.volume, heldShown / DATA.dialM3));
  put(needleW, "d", needleAt(DATA.dials.watch, watchShown / DATA.dialS));
  // the chin organ fires at full gape; the signal runs up the nerve to the head
  const age = clock - flashAt;
  const glow = calm ? 0 : flash(age, 0.05, 0.35);
  const top = sensorFrame(theta);
  const tip = iso([top.o[0] + top.a[0] * W.SENSOR_H, top.o[1], top.o[2] + top.a[2] * W.SENSOR_H], P);
  put(sensorGlow, "cx", tip[0].toFixed(1)); put(sensorGlow, "cy", tip[1].toFixed(1)); show(sensorGlow, glow);
  const run = calm ? -1 : (age - 0.05) / 0.45;
  if (run >= 0 && run <= 1) {
    const path = [...wire, iso([W.HX, W.CAP_Y, W.CONTROLLER_Z], P)];
    const lengths = [0];
    for (let i = 1; i < path.length; i++) lengths.push(lengths[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    const want = run * lengths[lengths.length - 1];
    let i = 1; while (i < path.length - 1 && lengths[i] < want) i++;
    const t = (want - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1);
    put(pulse, "cx", (path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t).toFixed(1));
    put(pulse, "cy", (path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t).toFixed(1));
    show(pulse, Math.min(1, run * 8, (1 - run) * 8));
  } else show(pulse, 0);
  show(lamp, calm ? 0 : flash(age - 0.5, 0.05, 0.6));
  // krill
  for (let i = 0; i < DATA.krill.length; i++) {
    const k = DATA.krill[i];
    let point = k.swarm, alpha = krillAlpha, caught = false;
    const drift = calm ? 0 : Math.sin(clock * 1.3 + k.phase) * 0.8;
    if (calm) point = lerp3(k.swarm, k.mouth, ease(clamp((gulp - k.delay) / 0.55)));
    else if (phase === "rest") point = [k.swarm[0] + drift, k.swarm[1], k.swarm[2] + drift * 0.6];
    else if (phase === "open" || phase === "close") point = lerp3([k.swarm[0] + drift, k.swarm[1], k.swarm[2] + drift * 0.6], k.mouth, ease(clamp((gulp - k.delay) / 0.55)));
    else if (phase === "filter") { const e = ease(clamp(p * 2.6)); point = lerp3(k.mouth, k.comb, e); caught = e > 0.92; }
    else if (phase === "swallow") { const e = ease(clamp(p * 1.25 - (i % 5) * 0.04)); point = lerp3(k.comb, DATA.gullet, e); caught = e < 0.08; alpha = 1 - ease(clamp((p - 0.55) / 0.35)); }
    const [x, y] = iso(point, P);
    // swarm in front of the mouth, inside the mouth, or caught on the near comb's fringe
    const layer = point[0] >= SNOUT - 4 ? 2 : caught && k.near ? 1 : 0;
    const dots = [krillIn[i], krillComb[i], krillOut[i]];
    for (let n = 0; n < 3; n++) {
      if (n !== layer) { show(dots[n], 0); continue; }
      put(dots[n], "cx", x.toFixed(1)); put(dots[n], "cy", y.toFixed(1)); show(dots[n], alpha);
    }
  }
  for (let i = 0; i < heapDots.length; i++) show(heapDots[i], clamp(heapShown - i));
  // water: in through the mouth while it is open, out through the comb while the throat squeezes
  for (const pool of [jets, inflow]) for (const j of pool) {
    const out = pool === jets;
    const life = out ? 0.75 : 0.7;
    const age2 = clock - j.born;
    if (calm || age2 < 0 || age2 > life || !j.from) { show(j.el, 0); continue; }
    const t = age2 / life;
    // squeezed water leaves the comb sideways and falls away; inflow streams straight into the mouth
    const at = (u) => (out ? [j.from[0] + (j.to[0] - j.from[0]) * u, j.from[1] + (j.to[1] - j.from[1]) * u, j.from[2] + (j.to[2] - j.from[2]) * u * u] : lerp3(j.from, j.to, ease(u)));
    const trail = out ? [t, Math.max(0, t - 0.09), Math.max(0, t - 0.18)] : [t, Math.max(0, t - 0.22)];
    put(j.el, "d", pathOf(trail.map((u) => iso(at(u), P))));
    show(j.el, 0.9 * Math.min(1, t * 6, (1 - t) * 3));
  }
  put(rider, "transform", translateAlong(P, [shownX, 0, 0]));
  if (readout.textContent !== s.readout) readout.textContent = s.readout;
}

function spawn(pool, from, to) {
  let pick = pool[0];
  for (const j of pool) if (j.born < pick.born) pick = j;
  pick.born = clock; pick.from = from; pick.to = to;
}

function step(dt) {
  const s = SPECIES[current];
  phaseT += dt;
  if (phase === "rest" && phaseT >= REST) { phase = "open"; phaseT = 0; }
  else if (phase === "open" && phaseT >= OPEN) { phase = "close"; phaseT = 0; flashAt = clock; }
  else if (phase === "close" && phaseT >= CLOSE) { phase = "filter"; phaseT = 0; filterElapsed = 0; }
  else if (phase === "filter" && filterElapsed >= s.filter) { phase = "swallow"; phaseT = 0; }
  else if (phase === "swallow" && phaseT >= SWALLOW) {
    phase = "rest"; phaseT = 0; heapCount = heapCount + 6 > DATA.heap ? 6 : heapCount + 6; krillAlpha = 0;
    if (touring) { tourStep = (tourStep + 1) % DATA.tour.length; select(DATA.tour[tourStep], true); }
  }
  if (phase === "filter") filterElapsed += dt * DATA.speedup;
  if (phase === "rest") krillAlpha = Math.min(1, krillAlpha + dt / 0.5);
  const { fill } = pose(false);
  held = fill * s.volume;
  if (phase === "filter") watch = filterElapsed;
  else if (phase === "open" && phaseT < 0.4) watch = 0;
  heldShown += (held - heldShown) * (1 - Math.exp(-dt / 0.06));
  watchShown += (watch - watchShown) * (1 - Math.exp(-dt / (phase === "open" ? 0.12 : 0.05)));
  heapShown += (heapCount - heapShown) * (1 - Math.exp(-dt / 0.25));
  // water
  if (phase === "filter" && clock - lastSpawn > 0.035) { lastSpawn = clock; jetOut(0); }
  if ((phase === "open" && phaseT > 0.35) || (phase === "close" && phaseT < 0.9)) {
    if (clock - lastSpawn > 0.06) { lastSpawn = clock; jetIn(0); }
  }
}
// Water squeezed out between two baleen plates, out past the lip.
function jetOut(age) {
  const j = 1 + Math.floor(Math.random() * (DATA.plateXs.length - 2));
  const x = DATA.plateXs[j] + 1.8;
  const hw = halfWidth(x);
  const z = DATA.zu - 2.4 - Math.random() * 6.6;
  spawn(jets, [x, hw - 1.2, z], [x + 1.5, hw + 14 + Math.random() * 5, z - 9]);
  jets.reduce((a, b) => (a.born > b.born ? a : b)).born -= age;
}
function jetIn(age) {
  const y = -7 + Math.random() * 14, z = 74 + Math.random() * 24;
  spawn(inflow, [SNOUT + 22, y, z], [SNOUT + 1, y * 0.7, Math.min(z, 96)]);
  inflow.reduce((a, b) => (a.born > b.born ? a : b)).born -= age;
}

let frozen = false;

function tick(now) {
  if (frozen) { frame = 0; return; }
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  clock += dt;
  shownX = calm ? targetX : shownX + (targetX - shownX) * (1 - Math.exp(-dt / 0.3));
  if (Math.abs(targetX - shownX) < 0.01) shownX = targetX;
  if (calm) {
    const s = SPECIES[current];
    heldShown = s.volume; watchShown = s.filter; heapShown = 0;
  } else step(dt);
  draw(calm);
  const settled = calm && shownX === targetX;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}

const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function steer(x, settle) {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; tourStep = Math.max(0, DATA.tour.indexOf(current)); run(); }, 3600);
  targetX = Math.min(DATA.ruler.x1, Math.max(DATA.ruler.x0, x));
  let best = 0;
  for (let i = 1; i < SPECIES.length; i++) if (Math.abs(SPECIES[i].x - targetX) < Math.abs(SPECIES[best].x - targetX)) best = i;
  select(best, settle);
  run();
}
const rail0 = iso([DATA.ruler.x0, DATA.ruler.y, 0], P), rail1 = iso([DATA.ruler.x1, DATA.ruler.y, 0], P);
function railAt(event) {
  const box = svg.getBoundingClientRect();
  const view = svg.viewBox.baseVal;
  const px = view.x + ((event.clientX - box.left) / box.width) * view.width;
  const py = view.y + ((event.clientY - box.top) / box.height) * view.height;
  const dx = rail1[0] - rail0[0], dy = rail1[1] - rail0[1];
  const t = clamp(((px - rail0[0]) * dx + (py - rail0[1]) * dy) / (dx * dx + dy * dy));
  return DATA.ruler.x0 + t * (DATA.ruler.x1 - DATA.ruler.x0);
}
stage.addEventListener("pointerdown", (event) => {
  dragging = true;
  try { stage.setPointerCapture(event.pointerId); } catch (error) {}
  steer(railAt(event), false);
});
stage.addEventListener("pointermove", (event) => { if (dragging) steer(railAt(event), false); });
const release = (event) => { if (!dragging) return; dragging = false; try { stage.releasePointerCapture(event.pointerId); } catch (error) {} steer(SPECIES[current].x, true); };
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = current + 1;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = current - 1;
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = SPECIES.length - 1;
  if (to === null) return;
  event.preventDefault();
  to = Math.min(SPECIES.length - 1, Math.max(0, to));
  steer(SPECIES[to].x, true);
});
still.addEventListener?.("change", () => { touring = !still.matches; run(); });
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
describeTo(current);
draw(still.matches);
}
`;

const keys = [
  { mark: "blue", label: M.page.keys[0].label },
  { mark: "red", label: M.page.keys[1].label },
  { mark: "lit", label: M.page.keys[2].label },
];

const first = M.SPECIES[START];
const stage = `<div class="iso-stage" tabindex="0" role="slider" aria-label="Lunge-feeding rig: arrow keys pick a whale, from the smallest to the largest" aria-valuemin="${Math.round(M.SPECIES[0].length * 10 + 1e-6) / 10}" aria-valuemax="${Math.round(M.SPECIES[M.SPECIES.length - 1].length * 10 + 1e-6) / 10}" aria-valuenow="${Math.round(first.length * 10 + 1e-6) / 10}" aria-valuetext="${M.describe(first)}">${svg}</div>`;

// The embed leaves the legend and caption to the host page, so they stay in its
// prerendered HTML (pages/anatomy.vue mirrors `keys` and `caption`).
const body2 = k.plateHtml({
  fig: M.page.fig,
  title: "Lunge feeding",
  hint: "Drag to pick a whale · ← →",
  readout: M.readoutOf(first),
  keys: embed ? [] : keys,
  caption: embed ? undefined : M.page.caption,
  body: stage,
});

const LF_CSS = `
.iso{--anatomy-page:#061624;--anatomy-card:#0a223a;--anatomy-text:#9fb8cc;--anatomy-strong:#e0f2fe;--anatomy-muted:#6684a0;
  --anatomy-paper:#0a223a;--anatomy-face:#0e3052;--anatomy-top:#0f3255;
  --anatomy-shade-0:#081b2e;--anatomy-shade-1:#092037;--anatomy-shade-2:#0b2640;--anatomy-shade-3:#0d2b49;
  --anatomy-lit-top:#144474;--anatomy-lit-shade:#0f3458;
  --anatomy-hi:#cfe6f6;--anatomy-mid:#5e7f9c;--anatomy-lo:#37546f;--anatomy-faint:#1f3b57;--anatomy-lit:#ffffff;
  --anatomy-halo:#01060c;--anatomy-dot:#e0f2fe;--anatomy-blue:#00f0ff;--anatomy-red:#ff3ec8}
.iso[data-theme="light"]{--anatomy-blue:#0891b2;--anatomy-red:#d23a8f}
.iso-plate{box-shadow:0 0 0 1px var(--anatomy-faint)}
.iso-stage{touch-action:pan-y;cursor:grab;outline:none}
.iso-stage:active{cursor:grabbing}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.lf-jet{fill:none;stroke:var(--anatomy-blue);stroke-width:1;stroke-linecap:round;stroke-linejoin:round}
.lf-krill circle,.lf-heap circle{fill:var(--anatomy-red);stroke:none}
.lf-glow{fill:var(--anatomy-lit);stroke:none}
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
  .pageHtml({ title: "Lunge feeding", theme, body: body2, script: kitScript() + live + (embed ? EMBED_SCRIPT : "") })
  .replace('<meta charset="utf-8">', `<meta charset="utf-8">${MIT_NOTICE}`)
  .replace("</style></head>", `${LF_CSS}${embed ? EMBED_CSS : ""}</style></head>`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log("wrote", OUT, (Buffer.byteLength(html) / 1024).toFixed(1) + " KB");
