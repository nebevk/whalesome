// Fig 2 · Sperm whale clicks. An acoustic bench built like a sperm whale's nose.
//
//   ANATOMY_KIT=/path/to/anatomy node figures/sperm-whale-clicks/build.mjs [--standalone] [--light] [--out path.html]
//
// By default this writes the embed build the site uses, public/figures/sperm-whale-clicks.html:
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
    ? join(HERE, "..", "..", "public", "figures", "sperm-whale-clicks.html")
    : join(HERE, theme === "light" ? "sperm-whale-clicks-light.html" : "sperm-whale-clicks.html");

const WIDTH = 600;
const HEIGHT = 320;
const AZIMUTH = 120; // the bench runs left to right, front (the nose) on the left, seen from the front-left

// ---------------------------------------------------------------------------
// World. x runs from the front of the nose back along the bench, y across it (+y toward the
// reader), z up; 1 unit ~ 1 px. x = 0 is the front mirror (the distal air sac): the zero of the
// ruler, which reads the distance to the rear mirror (the frontal air sac) in metres.
const UPM = 36; // world units per metre of case
const ZC = 50; // axis of the oil-filled case
const ZJ = 21; // axis of the lens stack
const XF = 9; // the case leaves the clicker block here
const S = UPM * M.CASE_M[0] - XF; // each of the three telescope sections; fully nested at the shortest case
const RS = [6.2, 7.6, 9]; // section radii, front (inside) to rear (outside)
const WIPE = 0.7; // wiper ring at the front end of the middle and rear sections
const WIPE_L = 2.4;
const rearOf = (m) => UPM * m; // the rear mirror plane
const midOf = (xr) => (XF + xr - S) / 2; // the middle section's front end: equal overlaps both sides
const XR0 = rearOf(M.START_M);
const XM0 = midOf(XR0);
const XR_HI = rearOf(M.CASE_M[1]);

const BASE = { x: -126, y: -42, w: 354, d: 76, r: 8 }; // x -126..228, y -42..34
const BASE_H = 10;
const FOOT_H = 5;
const RAIL_X = [22, 220];
const RAIL_Y = [-20.5, 13.5]; // far and near rails, 3 wide
const RAIL_H = 2.6;
const RULER = { x: -3, y: 24, w: 207, d: 5, r: 0.8 };

const PED = { x: -16, y: -13, w: 26, d: 26, r: 2 }; // the nose pedestal, x -16..10
const PED_H = 36;
const CLICK = { x: 0, y: -9, w: 9, d: 18, r: 1.4 }; // clicker block on the pedestal, x 0..9
const CLICK_TOP = 62;
const FRONT_R = 10.5; // front mirror cell
const REAR_R = 13; // rear mirror cell
const CELL_T = 3; // mirror cell thickness

const N_LENS = 7;
const LENS_R = Array.from({ length: N_LENS }, (_, i) => 7 - (i * (7 - 3.8)) / (N_LENS - 1)); // front to rear: the junk tapers back
const LENS_H = 0.55; // half-thickness of a lens plate
const CELL_GAP = 1; // between a lens's rim and its cell
const CELL_W = 1.4; // lens cell ring, radial
const cellOut = (r) => r + CELL_GAP + CELL_W;
const HOLD = 2; // slider half-length
const SPRING_Z = 1.7;
const E_F = 13; // front spring anchor: the lug on the pedestal's back
const anchorRear = (xr) => xr - 11; // rear spring anchor: the lug under the carriage's front edge
const lensAt = (xr) => {
  const d = (anchorRear(xr) - E_F) / (N_LENS + 1);
  return Array.from({ length: N_LENS }, (_, i) => E_F + (i + 1) * d);
};
const C0 = lensAt(XR0);

const BELL_S = 14; // horn length, ahead of the pedestal's front face (x -16)
const bellR = (s) => 5 + 5.5 * (s / BELL_S) ** 2;
const bellSlope = (s) => (11 * s) / (BELL_S * BELL_S);
const MOUTH_X = PED.x - BELL_S; // -30
const HYD_X = -44; // hydrophone stalk
const HYD_TIP = -39.4;

const SCOPE = { x: -118, y: -36, w: 66, d: 20, r: 2 }; // x -118..-52, far side
const SCOPE_Z0 = 3;
const SCOPE_Z1 = 46;
const SCOPE_Y = SCOPE.y + SCOPE.d; // its face, toward the reader
const SCREEN = { x0: -113, x1: -71, z0: 14, z1: 40, r: 2, depth: 1.8 };
const BEZEL = { x0: -115.5, x1: -68.5, z0: 11.5, z1: 42.5, r: 3, depth: 0.7 };
const TRACE_Z = 27; // the trace's baseline
const TRACE_H = 9.5; // the tallest pulse
const KNOB_X = -61;

const TOWER = { dx: 3, w: 10, d: 24 }; // the rear block, behind the rear mirror cell
const TOWER_TOP = 64;
const WINDOW = { dx0: 5.2, dx1: 9.4, z0: 18, z1: 54, r: 2, depth: 1.2 }; // sight window down the rear block
const PORT_L = 4; // the port low on the block reaches 4 ahead of it, to x = xr - 1, where the lens stack begins

const P = k.fitProjection(
  [
    ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [XR_HI + TOWER.dx + TOWER.w, -12, TOWER_TOP + 6],
    [XR_HI + TOWER.dx, 12, TOWER_TOP + 6],
    [4, -4, CLICK_TOP + 9],
    ...k.boxCorners(SCOPE, 0, SCOPE_Z1),
  ],
  WIDTH,
  HEIGHT,
  { pad: 16, azimuth: AZIMUTH },
);

const { iso, pathOf } = k;
const at = (point) => k.iso(point, P);
const S_ = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const poly = (points) => k.pathOf(points.map(at), true);
const slab = (plan, z, h, tone = "mid", steps = 4, bevel = 0.5, extra = {}) => S_(k.slabOf(plan, z, h, P, steps, bevel), { tone, ...extra });
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const V = G.viewOf(P);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left"); // local (x, -z) on the vertical face at y
const flat = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const alongX = (x, z = ZC) => G.frameAlong([x, 0, z], [1, 0, 0]);
const alongY = (x, y, z) => G.frameAlong([x, y, z], [0, 1, 0]);

// Shared with the page (inlined with toString), so the static drawing and the live one agree.
const SCOPE_MS = M.SCOPE_MS;
const HEIGHTS = M.PULSE_HEIGHTS;
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [];
  const hi = [];
  for (const pt of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], pt) <= 0) lo.pop(); lo.push(pt); }
  for (let i = p.length - 1; i >= 0; i--) { const pt = p[i]; while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], pt) <= 0) hi.pop(); hi.push(pt); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}
// Everything of a tube along the case axis ahead of x (toward the nose): the hull of its
// section at x and far ahead. An inner telescope section is clipped to it, so it shows only
// where it has left the section around it.
function keepAhead(x, r) {
  const pts = [];
  for (const end of [x, x - 400]) for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push(iso([end, r * Math.cos(a), ZC + r * Math.sin(a)], P)); }
  return pathOf(hull(pts), true);
}
const traceU = (ms) => -110 + 2 * ms; // the scope's time axis, in the face's own units: -1 ms at the left, 19 ms at the right
// One click on the scope up to `upTo` ms: p0, p1 and p2, one IPI apart, each a short ringing burst.
function tracePath(ipi, upTo) {
  const knots = [[SCOPE_MS[0], 0]];
  [0, ipi, 2 * ipi].forEach((tc, n) => {
    const a = TRACE_H * HEIGHTS[n];
    for (const [dt, da] of [[-0.15, 0], [-0.05, a], [0.05, -0.75 * a], [0.15, 0.42 * a], [0.25, -0.18 * a], [0.35, 0]]) knots.push([tc + dt, da]);
  });
  knots.push([SCOPE_MS[1], 0]);
  const pts = [];
  let prev = knots[0];
  for (const knot of knots) {
    if (knot[0] > upTo) { const f = (upTo - prev[0]) / (knot[0] - prev[0] || 1); pts.push([upTo, prev[1] + (knot[1] - prev[1]) * f]); break; }
    pts.push(knot);
    prev = knot;
  }
  return { d: pts.map(([t, a], i) => (i ? "L" : "M") + traceU(t).toFixed(2) + " " + (-(TRACE_Z + a)).toFixed(2)).join(""), end: pts[pts.length - 1] };
}

// A rounded rectangle drawn on a vertical face that faces +y, as one closed outline.
function faceRect(x0, x1, y, z0, z1, r) {
  const points = [];
  const corner = (cx, cz, from) => { for (let i = 0; i <= 4; i++) { const a = from + (i / 4) * (Math.PI / 2); points.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); } };
  corner(x1 - r, z0 + r, -Math.PI / 2); corner(x1 - r, z1 - r, 0); corner(x0 + r, z1 - r, Math.PI / 2); corner(x0 + r, z0 + r, Math.PI);
  return poly(points);
}

// A rounded opening sunk into a face that faces +y: its inner walls, shaded by facing, its back
// (with `back` drawn on it in the face's own coordinates) and its rim.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "sw-dark") {
  const id = `sw-recess-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx * V[0] + nz * V[2] <= 0) return; // the wall faces away from the reader
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= Math.abs(nx)) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flat(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    tops.length ? `<path class="iso-top" d="${tops.join("")}"/>` : "",
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : "")),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    `</g>`,
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

// ---------------------------------------------------------------------------
function base() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`);
  for (const [x, y] of byDepth(k.corners(BASE, 22))) {
    out.push(S_(k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S_(k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S_(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(BASE, -BASE_H / 2, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(BASE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate, front left
  const label = { x: -104, y: 22.5, w: 30, d: 8.5, r: 1 };
  out.push(S_(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[25.1, 19], [26.9, 13], [28.7, 16]].map(([y, w]) => k.lineOnTop([label.x + 4, y], [label.x + 4 + w, y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 2.4, label.y + 4.25, 0.8]), at([label.x + label.w - 2.4, label.y + 4.25, 0.8])], { size: 0.45 }));
  // the slot the lens sliders run in
  out.push(L(k.planOutline({ x: 11, y: -3.8, w: 207, d: 7.6, r: 3.8 }, 0, P, 6), { tone: "lo" }));
  out.push(L(k.planOutline({ x: 12.4, y: -2.4, w: 204.2, d: 4.8, r: 2.4 }, 0, P, 6), { tone: "faint" }));
  // rails for the carriage, with end stops
  for (const y of RAIL_Y) {
    out.push(slab({ x: RAIL_X[0], y, w: RAIL_X[1] - RAIL_X[0], d: 3, r: 0.8 }, 0, RAIL_H, "mid", 3, 0.4));
  }
  for (const x of [RAIL_X[0] - 4.2, RAIL_X[1]]) {
    for (const y of RAIL_Y) {
      out.push(slab({ x, y: y - 1.2, w: 4.2, d: 5.4, r: 1 }, 0, 5.2, "mid", 3, 0.4));
      out.push(D([at([x + 2.1, y + 1.5, 5.2])], { size: 0.45 }));
    }
  }
  // the ruler: case length in metres from the front mirror; ticks every 0.1 m, longer at
  // every half metre and longest at whole metres
  out.push(S_(k.slabOf(RULER, 0, 0.5, P, 3), { tone: "lo", crease: "none" }));
  const minor = [];
  const half = [];
  const whole = [];
  const edge = RULER.y + 0.3;
  for (let i = 0; i <= 55; i++) {
    const x = (i / 10) * UPM;
    const [list, length] = i % 10 === 0 ? [whole, 3.4] : i % 5 === 0 ? [half, 2.3] : [minor, 1.2];
    list.push(k.lineOnTop([x, edge], [x, edge + length], 0.5, P));
  }
  out.push(L(minor.join(""), { tone: "lo" }), L(half.join(""), { tone: "mid" }), L(whole.join(""), { tone: "hi" }));
  out.push(D([at([RULER.x + 1.2, RULER.y + 3.9, 0.5]), at([RULER.x + RULER.w - 1.2, RULER.y + 3.9, 0.5])], { size: 0.42 }));
  return out.join("");
}

// The oscilloscope on the far side, its screen toward the reader.
function scope() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(SCOPE, 0, 4, P)}"/>`);
  for (const [x, y] of byDepth(k.corners(SCOPE, 5))) out.push(S_(k.cylinder(x, y, 2.4, 0, SCOPE_Z0, P, 20), { tone: "lo" }));
  const seam = k.sideSeam(SCOPE, SCOPE_Z1 - 5, P, 4);
  out.push(S_(k.slabOf(SCOPE, SCOPE_Z0, SCOPE_Z1 - SCOPE_Z0, P, 4, 0.8), { tone: "mid", inner: L(seam, { tone: "faint" }) }));
  // vents on the lid and down the side
  out.push(L(Array.from({ length: 6 }, (_, i) => k.planOutline({ x: -110 + i * 6.4, y: -31, w: 3.2, d: 10, r: 1.6 }, SCOPE_Z1, P, 3)).join(""), { tone: "faint" }));
  const sideSlot = (y) => k.pathOf(k.roundedPlan({ x: y - 0.7, y: 16, w: 1.4, d: 18, r: 0.7 }, 3).map(([v, z]) => at([SCOPE.x, v, z])), true);
  out.push(L([-32.5, -29.5, -26.5, -23.5, -20.5].map(sideSlot).join(""), { tone: "faint" }));
  out.push(D(k.corners(SCOPE, 3).map(([x, y]) => at([x, y, SCOPE_Z1])), { size: 0.45 }));
  // the screen in its bezel, with a grid; the trace is drawn live
  const grid = [];
  for (let t = 1; t < 19; t += 2) grid.push(`M${traceU(t)} ${-(SCREEN.z0 + 0.6)}V${-(SCREEN.z1 - 0.6)}`);
  for (const z of [17, 22, 32, 37]) grid.push(`M${SCREEN.x0 + 0.6} ${-z}H${SCREEN.x1 - 0.6}`);
  const still = tracePath(M.ipiMs(M.START_M), SCOPE_MS[1]).d; // the page redraws it live
  const back = [
    `<path class="iso-line" data-tone="faint" d="${grid.join("")}"/>`,
    `<path class="iso-line" data-tone="lo" d="M${SCREEN.x0 + 0.6} ${-TRACE_Z}H${SCREEN.x1 - 0.6}"/>`,
    `<path data-part="trace-glow" class="sw-trace-glow" d="${still}"/>`,
    `<path data-part="trace" class="iso-line" data-tone="lit" data-free="both" d="${still}" style="stroke-width:0.75"/>`,
    `<circle data-part="sweep" class="sw-sweep" cx="${traceU(-1)}" cy="${-TRACE_Z}" r="0.9" style="opacity:0"/>`,
  ].join("");
  out.push(recess(BEZEL, SCOPE_Y, "", "sw-bezel"));
  out.push(recess(SCREEN, SCOPE_Y - BEZEL.depth, back, "sw-screen"));
  out.push(D([[BEZEL.x0 + 1.4, BEZEL.z0 + 1.4], [BEZEL.x1 - 1.4, BEZEL.z0 + 1.4], [BEZEL.x0 + 1.4, BEZEL.z1 - 1.4], [BEZEL.x1 - 1.4, BEZEL.z1 - 1.4]].map(([x, z]) => at([x, SCOPE_Y, z])), { size: 0.42 }));
  // knobs, a power lamp and the input socket in the right-hand column
  for (const [z, turn] of [[33, 0.5], [22, -0.9]]) {
    const F = alongY(KNOB_X, SCOPE_Y, z);
    out.push(S_(G.disc(0, 1.2, 4.4, F, P), { tone: "lo" }));
    out.push(S_(G.disc(1.2, 3.6, 3.4, F, P), { tone: "mid", inner: L(G.arcOf(F, 2.4, 3.4, P), { tone: "faint" }) }));
    out.push(L(G.circleOf(F, 3.6, 3.4, P, 32), { tone: "lo" }));
    out.push(L(k.pathOf([at([KNOB_X + 0.8 * Math.cos(turn), SCOPE_Y + 3.6, z + 0.8 * Math.sin(turn)]), at([KNOB_X + 3.4 * Math.cos(turn), SCOPE_Y + 3.6, z + 3.4 * Math.sin(turn)])]), { tone: "hi", free: "start" }));
  }
  out.push(D([at([KNOB_X, SCOPE_Y + 0.2, 40.5])], { size: 0.8, tone: "hi" }));
  const bnc = alongY(KNOB_X, SCOPE_Y, 11);
  out.push(S_(G.disc(0, 1, 2.6, bnc, P), { tone: "lo" }));
  out.push(S_(G.disc(1, 3.2, 1.5, bnc, P), { tone: "mid" }));
  out.push(L(faceRect(SCOPE.x + 3, SCOPE.x + SCOPE.w - 3, SCOPE_Y, SCOPE_Z0 + 2, SCOPE_Z1 - 7, 1.6), { tone: "faint" }));
  out.push(k.faceTextSvg(planeOf(SCOPE_Y) + ` translate(${traceU(18)} ${-(BEZEL.z0 - 2.6)})`, "ms", { size: 2.6, tone: "lo", anchor: "end" }));
  return out.join("");
}

// ---------------------------------------------------------------------------
// The carriage (moved as one group): plate, bushings, the rear block with the rear mirror and
// the sight window down to the lens stack, the drag knob and the ruler pointer.
function carriage() {
  const out = [];
  const xr = XR0;
  const plate = { x: xr - 11, y: -23, w: 30, d: 44, r: 2 };
  out.push(`<path class="iso-halo" d="${k.haloOf(plate, 2, 4, P)}"/>`);
  for (const [bx, by] of byDepth([[xr - 9, RAIL_Y[0] - 1.5], [xr + 11, RAIL_Y[0] - 1.5], [xr - 9, RAIL_Y[1] - 1.5], [xr + 11, RAIL_Y[1] - 1.5]])) {
    out.push(slab({ x: bx, y: by, w: 6, d: 6, r: 1 }, 1.2, 1.8, "lo", 3, 0.3));
  }
  out.push(slab({ x: xr - 11, y: -2.5, w: 3, d: 5, r: 0.6 }, 0.6, 2.4, "mid", 3, 0.3)); // spring lug under the front edge
  out.push(D([at([xr - 11, 0, SPRING_Z])], { size: 0.5, tone: "mid" }));
  out.push(slab(plate, 3, 4, "mid", 4, 0.6));
  out.push(D(k.corners(plate, 2.6).map(([x, y]) => at([x, y, 7])), { size: 0.45 }));
  // pointer over the ruler, its index on the rear mirror plane
  out.push(slab({ x: xr - 1.4, y: 21, w: 2.8, d: 3.6, r: 0.6 }, 3, 1.2, "hi", 3, 0, { crease: "lo" }));
  out.push(L(k.lineOnTop([xr, 21], [xr, 24.6], 4.2, P), { tone: "hi" }));
  // the rear block (the back wall of the skull)
  const tower = { x: xr + TOWER.dx, y: -TOWER.d / 2, w: TOWER.w, d: TOWER.d, r: 1.2 };
  const towerY = tower.y + tower.d;
  out.push(S_(k.slabOf(tower, 7, TOWER_TOP - 7, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(tower, 13, P, 4), { tone: "faint" }) }));
  out.push(D([[tower.x + 1.6, 9.5], [tower.x + tower.w - 1.6, 9.5]].map(([x, z]) => at([x, towerY, z])), { size: 0.42 }));
  const back = [
    `<path data-part="window-blue" class="iso-line" data-tone="blue" d="M${xr + WINDOW.dx0 + 0.5} ${-ZC}H${xr + WINDOW.dx1 - 0.5}" style="opacity:0;stroke-width:1.6"/>`,
    `<path data-part="window-red" class="iso-line" data-tone="red" d="M${xr + WINDOW.dx0 + 0.5} ${-ZC}H${xr + WINDOW.dx1 - 0.5}" style="opacity:0;stroke-width:1.6"/>`,
  ].join("");
  out.push(recess({ x0: xr + WINDOW.dx0, x1: xr + WINDOW.dx1, z0: WINDOW.z0, z1: WINDOW.z1, r: WINDOW.r, depth: WINDOW.depth }, towerY, back, "sw-glass"));
  out.push(D([[xr + (WINDOW.dx0 + WINDOW.dx1) / 2, WINDOW.z1 + 2.2], [xr + (WINDOW.dx0 + WINDOW.dx1) / 2, WINDOW.z0 - 2.2]].map(([x, z]) => at([x, towerY, z])), { size: 0.42 }));
  // the drag knob on top
  const kx = xr + TOWER.dx + TOWER.w / 2;
  out.push(S_(k.cylinder(kx, 0, 2.2, TOWER_TOP, 1.6, P, 20), { tone: "mid" }));
  out.push(S_(k.cylinder(kx, 0, 4.4, TOWER_TOP + 1.6, 3.8, P, 36, 0.4), { tone: "mid" }));
  out.push(L(k.knurl(kx, 0, 4.4, TOWER_TOP + 1.6, TOWER_TOP + 5.4, 30, P), { tone: "lo" }));
  out.push(L(k.ring(kx, 0, 2.2, TOWER_TOP + 5.4, P, 24), { tone: "faint" }));
  // the port low on the block's front face, where the window delivers the sound to the lenses
  const port = G.frameAlong([xr + TOWER.dx, 0, ZJ], [-1, 0, 0]);
  out.push(S_(G.disc(0, PORT_L, 4.4, port, P), { tone: "mid" }));
  out.push(L(G.circleOf(port, PORT_L, 2.8, P, 32), { tone: "faint" }));
  // the rear mirror cell on the block's front face; the case's flange lands on it
  const F = alongX(xr);
  out.push(S_(G.disc(0, CELL_T, REAR_R, F, P, { bevel: 0.4 }), { tone: "mid" }));
  out.push(D(G.dotsOf(F, 0, REAR_R - 1.3, 8, P, { all: true, phase: Math.PI / 8 }), { size: 0.42, tone: "mid" }));
  out.push(`<path data-part="rear-flash" class="iso-line" data-tone="blue" d="${G.circleOf(F, 0, REAR_R - 0.6, P, 64)}" style="opacity:0;stroke-width:1.3"/>`);
  return out.join("");
}

// The case: three telescope sections. The rear one rides with the carriage, the middle one goes
// half as far, and the front one is fixed in the clicker block. Each inner section is clipped to
// where it leaves the one around it, so it is drawn over that section's front face.
// Each section is a plain tube with separate rings, so every outline is the tube's own: a
// flange at the rear section's back, and a wiper ring at the front of each outer section that
// closes the gap round the section inside it.
const tube = (F, r, inner = "") => S_(G.solidOf([[0, r], [S, r]], F, P), { tone: "hi", crease: "lo", inner });
const wiper = (F, rIn, rOut) => S_(G.ringBand(0, WIPE_L, rIn, rOut, F, P), { tone: "hi", crease: "lo" });
function caseRear() {
  const r = RS[2];
  const F = alongX(XR0 - S);
  const seams = [10, S - 9].map((s) => G.arcOf(F, s, r, P)).join("");
  return [
    S_(G.ringBand(S - 2.6, S, r, r + 1.4, F, P), { tone: "hi", crease: "lo" }),
    tube(F, r, L(seams, { tone: "faint" })),
    wiper(F, RS[1] + 0.1, r + WIPE),
  ].join("");
}
function caseMid() {
  const F = alongX(XM0);
  return tube(F, RS[1]) + wiper(F, RS[0] + 0.1, RS[1] + WIPE);
}
function caseFront() {
  const F = alongX(XF);
  return tube(F, RS[0]) + S_(G.ringBand(0, 2, RS[0], RS[0] + 1.2, F, P), { tone: "hi", crease: "lo" });
}

// The nose: a pedestal that carries the horn, and the clicker block with its lips, bellows and
// the front mirror.
function pedestal() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(PED, 0, 6, P)}"/>`);
  out.push(slab({ x: 10, y: -2.5, w: 3, d: 5, r: 0.6 }, 0.6, 2.4, "mid", 3, 0.3)); // spring lug at the back
  out.push(S_(k.slabOf(PED, 0, PED_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(PED, 6, P, 4), { tone: "faint" }) }));
  const py = PED.y + PED.d;
  out.push(L(faceRect(PED.x + 4, PED.x + PED.w - 4, py, 12, 31, 1.2), { tone: "lo" }));
  out.push(D([[PED.x + 5.6, 13.6], [PED.x + PED.w - 5.6, 13.6], [PED.x + 5.6, 29.4], [PED.x + PED.w - 5.6, 29.4]].map(([x, z]) => at([x, py, z])), { size: 0.42 }));
  out.push(D(k.corners(PED, 2.4).map(([x, y]) => at([x, y, PED_H])), { size: 0.45 }));
  // the plate the horn is mounted on, screwed to the front face
  out.push(L(k.pathOf(k.roundedPlan({ x: -11, y: 2.4, w: 22, d: 31.4, r: 1.6 }, 4).map(([y, z]) => at([PED.x, y, z])), true), { tone: "lo" }));
  out.push(D([[-9.5, 4], [9.5, 4], [-9.5, 32.2], [9.5, 32.2]].map(([y, z]) => at([PED.x, y, z])), { size: 0.42 }));
  return out.join("");
}

function clicker() {
  const out = [];
  const cy = CLICK.y + CLICK.d;
  out.push(S_(k.slabOf(CLICK, PED_H, CLICK_TOP - PED_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(CLICK, 42, P, 4), { tone: "faint" }) }));
  out.push(D(k.corners(CLICK, 1.8).map(([x, y]) => at([x, y, CLICK_TOP])), { size: 0.42 }));
  // the lips, and the slit between them that lights as they snap
  out.push(slab({ x: 2, y: cy, w: 5.4, d: 1.6, r: 0.6 }, 50.9, 1.8, "hi", 3, 0, { crease: "lo" }));
  out.push(slab({ x: 2, y: cy, w: 5.4, d: 1.6, r: 0.6 }, 47.3, 1.8, "hi", 3, 0, { crease: "lo" }));
  const slit = k.segment([2.5, cy + 1.6, 50], [6.9, cy + 1.6, 50], P);
  out.push(L(slit, { tone: "lo" }), `<path data-part="slit" class="iso-line" data-tone="blue" d="${slit}" style="opacity:0;stroke-width:1.4"/>`);
  out.push(D([[1.1, 53.6], [8, 53.6], [1.1, 45.8], [8, 45.8]].map(([x, z]) => at([x, cy, z])), { size: 0.4 }));
  // bellows: the air the lips run on; the top pleat and the cap sink a little at each click
  const B = { x: 1.5, y: -4, w: 6, d: 8, r: 1.3 };
  let z = CLICK_TOP;
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

function frontMirror() {
  const F = G.frameAlong([0, 0, ZC], [-1, 0, 0]);
  return [
    S_(G.disc(0, CELL_T, FRONT_R, F, P, { bevel: 0.4 }), { tone: "mid" }),
    L(G.circleOf(F, CELL_T, FRONT_R - 2.2, P, 56), { tone: "faint" }),
    D(G.dotsOf(F, CELL_T, FRONT_R - 1.1, 6, P, { all: true, phase: Math.PI / 6 }), { size: 0.42, tone: "mid" }),
    S_(G.disc(CELL_T, CELL_T + 1.2, 2.4, F, P), { tone: "mid" }),
    `<path data-part="front-flash" class="iso-line" data-tone="blue" d="${G.circleOf(F, CELL_T, FRONT_R - 0.6, P, 56)}" style="opacity:0;stroke-width:1.3"/>`,
  ].join("");
}

// The horn on the pedestal's front face: where the lens stack sends the forward pulse out.
function horn() {
  const out = [];
  const F = G.frameAlong([PED.x, 0, ZJ], [-1, 0, 0]);
  const knots = [[1.6, bellR(1.6), 1], [BELL_S, bellR(BELL_S), 1]]; // the surface itself comes from bellR
  out.push(S_(G.ringBand(0, 1.6, 4.2, 8, F, P), { tone: "mid" }));
  out.push(D(G.dotsOf(F, 1.6, 6.9, 6, P, { all: true }), { size: 0.4, tone: "mid" }));
  out.push(S_(G.lathe(knots, F, P, { smooth: { slope: bellSlope, radius: bellR }, rims: "none" }), { tone: "hi" }));
  const mouth = bellR(BELL_S);
  out.push(S_(G.ringBand(BELL_S - 0.8, BELL_S, mouth - 0.9, mouth + 0.5, F, P), { tone: "hi", crease: "lo" }));
  out.push(`<path class="sw-void" d="${G.circleOf(F, BELL_S, mouth - 0.9, P)}"/>`);
  out.push(L(G.arcOf(F, BELL_S, mouth - 0.9, P, { inward: true, least: -1 }), { tone: "lo" }));
  out.push(`<path data-part="mouth-flash" class="iso-line" data-tone="red" d="${G.circleOf(F, BELL_S, mouth - 0.2, P, 56)}" style="opacity:0;stroke-width:1.3"/>`);
  return out.join("");
}

// The listener: a hydrophone on a stalk, a little ahead of the horn, wired to the scope.
function hydrophone() {
  const out = [];
  out.push(S_(k.cylinder(HYD_X, 0, 3.4, 0, 1.4, P, 28), { tone: "mid" }));
  out.push(D([at([HYD_X - 2.2, 1.2, 1.4]), at([HYD_X + 2.2, 1.2, 1.4])], { size: 0.38 }));
  const top = ZJ - Math.sqrt(1.7 * 1.7 - 0.75 * 0.75);
  out.push(S_(k.cylinder(HYD_X, 0, 0.75, 1.4, 8, P, 16), { tone: "mid", crease: "none" }));
  out.push(S_(k.cylinder(HYD_X, 0, 1.4, 9.4, 2.4, P, 20), { tone: "mid" }));
  out.push(S_(k.cylinder(HYD_X, 0, 0.75, 11.8, top - 11.8, P, 16), { tone: "mid", crease: "none" }));
  const F = alongX(-47.6, ZJ);
  const tip = HYD_TIP + 47.6;
  // the capsule: a short body with a cable gland at the back and a rounded nose toward the horn
  out.push(S_(G.solidOf([[0, 1.1], [0.6, 1.1], [0.6, 1.7], [tip - 1.7, 1.7]], F, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, 2.2, 1.7, P), { tone: "faint" }) }));
  out.push(S_(G.sphereOf(G.pointOf(F, tip - 1.7, 0, 0), 1.7, P), { tone: "hi" }));
  out.push(`<path data-part="hyd-flash" class="iso-line" data-tone="red" d="${k.sideRing([HYD_TIP - 0.4, 0, ZJ], 2.6, "x", P, 28)}" style="opacity:0;stroke-width:1.1"/>`);
  return out.join("");
}

function cable() {
  return k.wireSvg(at([HYD_X - 1, -3.2, 0.7]), at([KNOB_X, SCOPE_Y + 3.2, 11]), { via: [at([HYD_X - 3, -8, 0.6]), at([KNOB_X + 1.5, SCOPE_Y + 6, 0.6])], tone: "mid", size: 1 });
}

// One lens on its slider: slider, post, the lens (a fat, lens-shaped body) and its cell.
function lensHolder(i) {
  const c = C0[i];
  const r = LENS_R[i];
  const out = [];
  out.push(slab({ x: c - HOLD, y: -3.2, w: HOLD * 2, d: 6.4, r: 0.8 }, 0, 3.4, "mid", 3, 0.3));
  out.push(D([at([c - HOLD, 0, SPRING_Z])], { size: 0.5, tone: "mid" })); // the pin the spring ahead hooks on
  const postTop = ZJ - Math.sqrt(cellOut(r) ** 2 - 1.1 * 1.1);
  out.push(S_(k.cylinder(c, 0, 1.1, 3.4, postTop - 3.4, P, 16), { tone: "mid", crease: "none" }));
  const F = alongX(c, ZJ);
  // the cell first; the lens plate sits in its bore, standing proud of both faces
  out.push(S_(G.ringBand(-0.8, 0.8, r + CELL_GAP, cellOut(r), F, P), { tone: "mid" }));
  out.push(S_(G.disc(-LENS_H, LENS_H, r, F, P), { tone: "hi", inner: L(G.circleOf(F, -LENS_H, r * 0.6, P, 36), { tone: "faint" }) }));
  return `<g data-part="lens" data-i="${i}" transform="translate(0 0)">${out.join("")}</g>`;
}

const coilOf = (from, to) => k.coil(from, to, [0, SPRING_Z], 1.25, 6, "x", P, 14);
function springPath(index, from, to) {
  const c = coilOf(from, to);
  return `<path data-part="spring-back" data-i="${index}" class="iso-line" data-tone="lo" d="${c.back}"/><path data-part="spring-front" data-i="${index}" class="iso-line" data-tone="mid" d="${c.front}"/>`;
}

// The lens stack, drawn far to near (from the carriage forward): spring, lens, slot, spring...
// Each slot holds the forward pulse's ring while it is between two lenses.
function junk() {
  const out = [];
  const ends = [E_F, ...C0.flatMap((c) => [c - HOLD, c + HOLD]), anchorRear(XR0)];
  const springs = [];
  for (let j = 0; j <= N_LENS; j++) springs.push([ends[2 * j], ends[2 * j + 1]]);
  out.push(`<g data-part="slot" data-i="${N_LENS}">${RING.junkRing}</g>`);
  for (let j = N_LENS; j >= 0; j--) {
    out.push(springPath(j, springs[j][0], springs[j][1]));
    if (j > 0) {
      out.push(lensHolder(j - 1));
      out.push(`<g data-part="slot" data-i="${j - 1}"></g>`);
    }
  }
  return out.join("");
}

function pulses() {
  return {
    caseRing: [
      `<path data-part="case-glow" class="sw-glow" data-tone="blue" d="" style="opacity:0"/>`,
      `<path data-part="case-ring" class="iso-line" data-tone="blue" d="" style="opacity:0;stroke-width:1.2"/>`,
    ].join(""),
    junkRing: [
      `<path data-part="junk-glow" class="sw-glow" data-tone="red" d="" style="opacity:0"/>`,
      `<path data-part="junk-ring" class="iso-line" data-tone="red" d="" style="opacity:0;stroke-width:1.2"/>`,
    ].join(""),
    hornRing: [
      `<path data-part="horn-glow" class="sw-glow" data-tone="red" d="" style="opacity:0"/>`,
      `<path data-part="horn-ring" class="iso-line" data-tone="red" d="" style="opacity:0;stroke-width:1.2"/>`,
    ].join(""),
    exitRing: [
      `<path data-part="exit-glow" class="sw-glow" data-tone="red" d="" style="opacity:0"/>`,
      `<path data-part="exit-ring" class="iso-line" data-tone="red" d="" style="opacity:0;stroke-width:1.2"/>`,
    ].join(""),
    leakRing: [
      `<path data-part="leak-glow" class="sw-glow" data-tone="blue" d="" style="opacity:0"/>`,
      `<path data-part="leak-ring" class="iso-line" data-tone="blue" d="" style="opacity:0;stroke-width:1"/>`,
    ].join(""),
  };
}

const move = (dx) => k.translateAlong(P, [dx, 0, 0]);
const RING = pulses();
const label =
  "An acoustic bench built like a sperm whale's nose. At the front, on the left, a pedestal carries a clicker with two lips and a small bellows, a round mirror ahead of the clicker, and below them a flared horn. From the clicker a telescopic, oil-filled tube runs back along the bench to a block on a carriage; a second round mirror closes the tube there, and a window in the block leads down to a row of lens plates on sliders, linked by springs, that runs forward under the tube to the horn. A hydrophone in front of the horn is wired to an oscilloscope on the far side, whose trace shows the pulses of each click. A ruler under the carriage reads the length of the tube in metres.";

const PARTS = { base, scope, carriage, junk, caseRear, caseMid, caseFront, pedestal, clicker, frontMirror, horn, hydrophone };
if (argv.includes("--sizes")) for (const [name, fn] of Object.entries(PARTS)) console.log(name.padEnd(12), (String(fn()).length / 1024).toFixed(1) + " KB");

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label,
  body: [
    `<defs><clipPath id="sw-clip-mid" clipPathUnits="userSpaceOnUse"><path data-part="clip-mid" d="${keepAhead(XR0 - S, RS[1] + WIPE + 0.6)}"/></clipPath><clipPath id="sw-clip-front" clipPathUnits="userSpaceOnUse"><path data-part="clip-front" d="${keepAhead(XM0, RS[0] + 1.8)}"/></clipPath></defs>`,
    base(),
    scope(),
    cable(),
    `<g data-part="carriage" transform="${move(0)}">${carriage()}</g>`,
    junk(),
    `<g data-part="carriage" transform="${move(0)}">${caseRear()}</g>`,
    `<g clip-path="url(#sw-clip-mid)"><g data-part="mid" transform="${move(0)}">${caseMid()}</g></g>`,
    `<g clip-path="url(#sw-clip-front)">${caseFront()}</g>`,
    RING.caseRing,
    pedestal(),
    clicker(),
    frontMirror(),
    RING.leakRing,
    horn(),
    RING.hornRing,
    RING.exitRing,
    hydrophone(),
  ],
});

// ---------------------------------------------------------------------------
const live = `
{
const P = ${JSON.stringify(P)};
const UPM = ${UPM}, ZC = ${ZC}, ZJ = ${ZJ}, XF = ${XF}, S = ${S}, RS = ${JSON.stringify(RS)}, WIPE = ${WIPE};
const CASE = ${JSON.stringify(M.CASE_M)}, C_OIL = ${M.C_OIL}, SLOW = ${M.SLOW};
const GORDON = ${JSON.stringify(M.GORDON)}, GROWCOTT = ${JSON.stringify(M.GROWCOTT)}, SPLIT = ${M.SPLIT_MS};
const XR0 = ${XR0}, XM0 = ${XM0}, C0 = ${JSON.stringify(C0)}, N = ${N_LENS}, LENS_R = ${JSON.stringify(LENS_R)};
const E_F = ${E_F}, HOLD = ${HOLD}, SPRING_Z = ${SPRING_Z}, PED_X = ${PED.x}, PED_BACK = ${PED.x + PED.w};
const BELL_S = ${BELL_S}, MOUTH_X = ${MOUTH_X}, HYD_TIP = ${HYD_TIP}, FRONT_X = ${-CELL_T};
const SCOPE_MS = ${JSON.stringify(M.SCOPE_MS)}, HEIGHTS = ${JSON.stringify(M.PULSE_HEIGHTS)}, TRACE_Z = ${TRACE_Z}, TRACE_H = ${TRACE_H};
const WIN_Z = [${WINDOW.z0 + 1.6}, ${WINDOW.z1 - 1.6}], WIN_X = [${WINDOW.dx0 + 0.6}, ${WINDOW.dx1 - 0.6}];
const SPEED = UPM * C_OIL / SLOW; // world units per second, slowed
const PAUSE = 0.7, CLICKS_PER_STOP = 2;
const STOPS = [3.4, 2.4, 5.2, 2.8, 4.4];
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const q = (name) => svg.querySelector('[data-part="' + name + '"]');
const all = (name) => [...svg.querySelectorAll('[data-part="' + name + '"]')];
const carriages = all("carriage"), mid = q("mid"), clipMid = q("clip-mid"), clipFront = q("clip-front");
const lenses = all("lens"), slots = all("slot"), springBack = all("spring-back"), springFront = all("spring-front");
const caseRing = q("case-ring"), caseGlow = q("case-glow"), junkRing = q("junk-ring"), junkGlow = q("junk-glow");
const hornRing = q("horn-ring"), hornGlow = q("horn-glow"), exitRing = q("exit-ring"), exitGlow = q("exit-glow");
const leakRing = q("leak-ring"), leakGlow = q("leak-glow");
const slit = q("slit"), bellows = q("bellows"), frontFlash = q("front-flash"), rearFlash = q("rear-flash");
const mouthFlash = q("mouth-flash"), hydFlash = q("hyd-flash"), winBlue = q("window-blue"), winRed = q("window-red");
const trace = q("trace"), traceGlow = q("trace-glow"), sweep = q("sweep");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const cam = cameraOf(P);
const VIEW = [cam.cosA * cam.cosE, cam.sinA * cam.cosE, cam.sinE];
const FACING = Math.atan2(VIEW[2], VIEW[1]); // the side of a tube along x that faces the reader

const ipiOf = (m) => (2 * m / C_OIL) * 1000;
const bodyOf = (ms) => ms <= SPLIT ? GORDON[0] + GORDON[1] * ms + GORDON[2] * ms * ms : GROWCOTT[0] + GROWCOTT[1] * ms;
const say = (m) => { const ms = ipiOf(m); return "IPI " + ms.toFixed(1) + " ms · whale " + bodyOf(ms).toFixed(1) + " m"; };
const describe = (m) => { const ms = ipiOf(m); return "The case is " + m.toFixed(1) + " metres long. Its pulses come " + ms.toFixed(1) + " milliseconds apart, which points to a whale about " + bodyOf(ms).toFixed(1) + " metres long."; };
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const flash = (age, rise, fall) => (age < 0 ? 0 : age < rise ? ease(age / rise) : Math.exp(-(age - rise) / fall));
const put = (el, name, value) => { const v = String(value); if (!el.__v) el.__v = {}; if (el.__v[name] !== v) { el.__v[name] = v; el.setAttribute(name, v); } };
const show = (el, alpha) => { const v = alpha < 0.004 ? "0" : alpha.toFixed(3); if (el.__o !== v) { el.__o = v; el.style.opacity = v; } };
const rearOf = (m) => UPM * m;
const midOf = (xr) => (XF + xr - S) / 2;
const anchorRear = (xr) => xr - 11;
const lensAt = (xr) => { const d = (anchorRear(xr) - E_F) / (N + 1); return Array.from({ length: N }, (_, i) => E_F + (i + 1) * d); };

// A ring on the side of a tube along x that faces the reader, and a whole ring in open air.
const arcAt = (x, r, z) => { const pts = []; for (let i = 0; i <= 24; i++) { const a = FACING - Math.PI / 2 + (i / 24) * Math.PI; pts.push(iso([x, r * Math.cos(a), z + r * Math.sin(a)], P)); } return pathOf(pts); };
const ringAt = (x, r, z) => sideRing([x, 0, z], r, "x", P, 40);
${hull.toString()}
${keepAhead.toString()}
const traceU = ${traceU.toString()};
${tracePath.toString()}

let caseM = ${M.START_M}, target = caseM, shown = -1;
let clock = 0, last = 0, frame = 0, visible = false;
let touring = !still.matches, stop = 0, stopClicks = 0, idleTimer = 0;
let click = null, nextAt = 0.6, record = null;
let lens = C0.slice();

function place() {
  const xr = rearOf(caseM), xm = midOf(xr);
  for (const g of carriages) put(g, "transform", translateAlong(P, [xr - XR0, 0, 0]));
  put(mid, "transform", translateAlong(P, [xm - XM0, 0, 0]));
  put(clipMid, "d", keepAhead(xr - S, RS[1] + WIPE + 0.6));
  put(clipFront, "d", keepAhead(xm, RS[0] + 1.8));
  lens = lensAt(xr);
  lenses.forEach((g) => { const i = +g.dataset.i; put(g, "transform", translateAlong(P, [lens[i] - C0[i], 0, 0])); });
  const ends = [E_F, ...lens.flatMap((c) => [c - HOLD, c + HOLD]), anchorRear(xr)];
  springBack.forEach((el, n) => { const j = +el.dataset.i; const c = coil(ends[2 * j], ends[2 * j + 1], [0, SPRING_Z], 1.25, 6, "x", P, 14); put(el, "d", c.back); put(springFront[n], "d", c.front); });
}

// Where the outermost tube is at x, so a ring around the case sits on its skin.
function caseRadius(x, xr, xm) { return x >= xr - S ? RS[2] : x >= xm ? RS[1] : RS[0]; }
// The slot that draws a ring at x between the lenses: after every lens behind it, before those ahead.
function slotFor(x) { for (let i = 0; i < N; i++) if (lens[i] > x) return slots.find((s) => +s.dataset.i === i); return slots.find((s) => +s.dataset.i === N); }
function moveTo(el, parent) { if (el.parentNode !== parent) parent.appendChild(el); }
const lensRadius = (x) => { if (x <= lens[0]) return LENS_R[0]; for (let i = 1; i < N; i++) if (x <= lens[i]) { const f = (x - lens[i - 1]) / (lens[i] - lens[i - 1]); return LENS_R[i - 1] + (LENS_R[i] - LENS_R[i - 1]) * f; } return LENS_R[N - 1]; };

function draw(calm) {
  if (Math.abs(caseM - shown) > 1e-5) { place(); shown = caseM; }
  const xr = rearOf(caseM), xm = midOf(xr);
  let c = 0, j = 0, h = 0, e = 0, lk = 0, wb = 0, wr = 0, ff = 0, rf = 0, mf = 0, hf = 0, sl = 0, breath = 0;
  if (!calm && click) {
    const age = clock - click.t0, T = click.T, D = 0.12 * T, x0 = 0;
    // the sound in the case: back, forward, back again, each time weaker
    const legs = [[0, 1, 1], [1, -1, 0.55], [2, 1, 0.42]];
    for (const [n, dir, strength] of legs) {
      const f = (age - n * T) / T;
      if (f >= 0 && f <= 1) {
        const x = dir > 0 ? x0 + (xr - x0) * f : xr - (xr - x0) * f;
        if (x >= XF + 0.5) { const r = caseRadius(x, xr, xm) + 0.5; put(caseRing, "d", arcAt(x, r, ZC)); put(caseGlow, "d", caseRing.getAttribute("d")); c = strength * Math.min(1, f * 12, (1 - f) * 12 + 0.25); }
      }
    }
    // down the window, then forward through the lenses, the horn and out
    for (const [n, strength] of [[1, 1], [3, 0.42]]) {
      const w = (age - n * T) / D;
      if (w >= 0 && w <= 1) {
        const z = WIN_Z[1] + (WIN_Z[0] - WIN_Z[1]) * w;
        const d = "M" + (XR0 + WIN_X[0]) + " " + (-z).toFixed(2) + "H" + (XR0 + WIN_X[1]); // in the carriage's own frame
        put(winBlue, "d", d); put(winRed, "d", d);
        wb = strength * (1 - w) * Math.min(1, w * 8 + 0.3); wr = strength * w * Math.min(1, (1 - w) * 8 + 0.3);
      }
      const f = (age - n * T - D) / (T - D);
      if (f >= 0 && f <= 1) {
        const x = xr - 1 + (MOUTH_X - xr + 1) * f;
        if (x >= PED_BACK) { put(junkRing, "d", ringAt(x, lensRadius(x) + 3, ZJ)); put(junkGlow, "d", junkRing.getAttribute("d")); moveTo(junkGlow, slotFor(x)); moveTo(junkRing, slotFor(x)); j = strength; }
        else if (x <= PED_X) { const s = PED_X - x; put(hornRing, "d", arcAt(x, 5 + 5.5 * (s / BELL_S) ** 2 + 0.5, ZJ)); put(hornGlow, "d", hornRing.getAttribute("d")); h = strength; }
      }
      const out = age - (n + 1) * T, travel = (MOUTH_X - HYD_TIP) / SPEED;
      if (out >= 0 && out <= travel + 0.25) {
        const f = Math.min(1, out / travel);
        put(exitRing, "d", ringAt(MOUTH_X - (MOUTH_X - HYD_TIP) * f, 10.5 + f, ZJ)); put(exitGlow, "d", exitRing.getAttribute("d"));
        e = strength * (out <= travel ? 1 : Math.exp(-(out - travel) / 0.08));
      }
      mf = Math.max(mf, strength * flash(age - (n + 1) * T, 0.03, 0.2));
      hf = Math.max(hf, strength * flash(age - (n + 1) * T - travel, 0.03, 0.25));
    }
    rf = Math.max(flash(age - T, 0.03, 0.18), 0.42 * flash(age - 3 * T, 0.03, 0.18));
    ff = 0.55 * flash(age - 2 * T, 0.03, 0.18);
    // the weak first pulse, leaking straight out ahead of the front mirror
    const leak = age / (17 / SPEED);
    if (leak >= 0 && leak <= 1) { put(leakRing, "d", ringAt(FRONT_X - 17 * leak, 10.5 + 3 * leak, ZC)); put(leakGlow, "d", leakRing.getAttribute("d")); lk = 0.42 * (1 - leak); }
    hf = Math.max(hf, 0.25 * flash(age, 0.03, 0.2));
    sl = flash(age, 0.03, 0.14);
    breath = flash(age + 0.05, 0.05, 0.22);
  }
  show(caseRing, c); show(caseGlow, c * 0.28); show(junkRing, j); show(junkGlow, j * 0.26);
  show(hornRing, h); show(hornGlow, h * 0.26); show(exitRing, e); show(exitGlow, e * 0.26);
  show(leakRing, lk); show(leakGlow, lk * 0.3); show(winBlue, wb); show(winRed, wr);
  show(frontFlash, ff); show(rearFlash, rf); show(mouthFlash, mf); show(hydFlash, hf); show(slit, sl);
  put(bellows, "transform", breath < 0.004 ? "translate(0 0)" : translateAlong(P, [0, 0, -1.2 * breath]));
  // the scope: the sweep follows the click; the last trace stays until the next one
  let ipi = ipiOf(caseM), upTo = SCOPE_MS[1], dot = 0, fresh = 1;
  if (!calm) {
    if (click) { ipi = click.ipi; upTo = Math.min(SCOPE_MS[1], SCOPE_MS[0] + ((clock - click.t0) / SLOW) * 1000 + 1); dot = upTo < SCOPE_MS[1] ? 1 : 0; }
    else if (record) { ipi = record; fresh = Math.abs(ipiOf(caseM) - record) > 0.05 ? 0.35 : 1; } // a resized case dims the last click's trace
    else upTo = SCOPE_MS[0];
  }
  const t = tracePath(ipi, upTo);
  put(trace, "d", t.d); put(traceGlow, "d", t.d); show(trace, fresh); show(traceGlow, fresh);
  put(sweep, "cx", traceU(t.end[0]).toFixed(2)); put(sweep, "cy", (-(TRACE_Z + t.end[1])).toFixed(2)); show(sweep, dot);
  const text = say(caseM);
  if (readout.textContent !== text) readout.textContent = text;
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  clock += dt;
  caseM = calm ? target : caseM + (target - caseM) * (1 - Math.exp(-dt / 0.45));
  if (Math.abs(target - caseM) < 0.0005) caseM = target;
  if (calm) { click = null; }
  else {
    if (click && clock - click.t0 >= click.end) { record = click.ipi; click = null; nextAt = clock + PAUSE; stopClicks++; if (touring && stopClicks >= CLICKS_PER_STOP) { stop = (stop + 1) % STOPS.length; stopClicks = 0; aim(STOPS[stop]); } }
    if (!click && clock >= nextAt && Math.abs(target - caseM) < 0.03) {
      const T = (caseM / C_OIL) * SLOW;
      click = { t0: clock, T, ipi: ipiOf(caseM), end: Math.max(4 * T + 0.3, ((SCOPE_MS[1] - SCOPE_MS[0]) / 1000) * SLOW) };
    }
  }
  draw(calm);
  const settled = calm && caseM === target;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}

function aim(m) {
  target = Math.min(CASE[1], Math.max(CASE[0], m));
  stage.setAttribute("aria-valuenow", target.toFixed(1));
  stage.setAttribute("aria-valuetext", describe(target));
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function steer(m) {
  touring = false;
  aim(m);
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; stopClicks = 0; run(); }, 3600);
  run();
}
const railA = iso([rearOf(CASE[0]), 0, ZC], P), railB = iso([rearOf(CASE[1]), 0, ZC], P);
function caseAt(event) {
  const box = svg.getBoundingClientRect();
  const view = svg.viewBox.baseVal;
  const px = view.x + ((event.clientX - box.left) / box.width) * view.width;
  const py = view.y + ((event.clientY - box.top) / box.height) * view.height;
  const dx = railB[0] - railA[0], dy = railB[1] - railA[1];
  const t = Math.min(1, Math.max(0, ((px - railA[0]) * dx + (py - railA[1]) * dy) / (dx * dx + dy * dy)));
  return CASE[0] + t * (CASE[1] - CASE[0]);
}
let dragging = false;
stage.addEventListener("pointerdown", (event) => {
  dragging = true;
  try { stage.setPointerCapture(event.pointerId); } catch (error) {}
  steer(caseAt(event));
});
stage.addEventListener("pointermove", (event) => { if (dragging) steer(caseAt(event)); });
const release = (event) => { dragging = false; try { stage.releasePointerCapture(event.pointerId); } catch (error) {} };
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 0.5 : 0.1;
  const from = touring ? caseM : target;
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = Math.round(from * 10) / 10 + step;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = Math.round(from * 10) / 10 - step;
  if (event.key === "Home") to = CASE[0];
  if (event.key === "End") to = CASE[1];
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
  { mark: "blue", label: M.page.keys[0].label },
  { mark: "red", label: M.page.keys[1].label },
  { mark: "lit", label: M.page.keys[2].label },
];

const fmt1 = (v) => v.toFixed(1);
const startIpi = M.ipiMs(M.START_M);
const stage = `<div class="iso-stage" tabindex="0" role="slider" aria-label="Sperm whale click bench: arrow keys lengthen or shorten the oil-filled case, Shift for half-metre steps" aria-valuemin="${M.CASE_M[0]}" aria-valuemax="${M.CASE_M[1]}" aria-valuenow="${fmt1(M.START_M)}" aria-valuetext="The case is ${fmt1(M.START_M)} metres long. Its pulses come ${fmt1(startIpi)} milliseconds apart, which points to a whale about ${fmt1(M.bodyLengthM(startIpi))} metres long.">${svg}</div>`;

// The embed leaves the legend and caption to the host page, so they stay in its
// prerendered HTML (pages/anatomy.vue renders `keys` and `caption` from model.mjs).
const body = k.plateHtml({
  fig: M.page.fig,
  title: M.page.heading,
  hint: "Drag the rear block · ← →",
  readout: `IPI ${fmt1(startIpi)} ms · whale ${fmt1(M.bodyLengthM(startIpi))} m`,
  keys: embed ? [] : keys,
  caption: embed ? undefined : M.page.caption,
  body: stage,
});

// The site palette, shared with Fig 1: navy surfaces, cyan and magenta accents.
const SW_CSS = `
.iso{--anatomy-page:#061624;--anatomy-card:#0a223a;--anatomy-text:#9fb8cc;--anatomy-strong:#e0f2fe;--anatomy-muted:#6684a0;
  --anatomy-paper:#0a223a;--anatomy-face:#0e3052;--anatomy-top:#0f3255;
  --anatomy-shade-0:#081b2e;--anatomy-shade-1:#092037;--anatomy-shade-2:#0b2640;--anatomy-shade-3:#0d2b49;
  --anatomy-lit-top:#144474;--anatomy-lit-shade:#0f3458;
  --anatomy-hi:#cfe6f6;--anatomy-mid:#5e7f9c;--anatomy-lo:#37546f;--anatomy-faint:#1f3b57;--anatomy-lit:#ffffff;
  --anatomy-halo:#01060c;--anatomy-dot:#e0f2fe;--anatomy-blue:#00f0ff;--anatomy-red:#ff3ec8;
  --sw-void:#030d18;--sw-screen:#04111d;--sw-bezel:#071a2c;--sw-glass:#071c30;--sw-dark:#061727;--sw-trace:#ffffff}
.iso[data-theme="light"]{--anatomy-blue:#0891b2;--anatomy-red:#d23a8f;--sw-void:#c7d3dc;--sw-screen:#e3ebf0;--sw-bezel:#d6dee4;--sw-glass:#dde6ec;--sw-dark:#d6dee4;--sw-trace:#000000}
.iso-plate{box-shadow:0 0 0 1px var(--anatomy-faint)}
.iso-stage{touch-action:pan-y;cursor:grab;outline:none}
.iso-stage:active{cursor:grabbing}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.sw-void{fill:var(--sw-void);stroke:none}
.sw-screen{fill:var(--sw-screen);stroke:none}
.sw-bezel{fill:var(--sw-bezel);stroke:none}
.sw-glass{fill:var(--sw-glass);stroke:none}
.sw-dark{fill:var(--sw-dark);stroke:none}
.sw-glow{fill:none;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.sw-glow[data-tone="blue"]{stroke:var(--anatomy-blue)}
.sw-glow[data-tone="red"]{stroke:var(--anatomy-red)}
.sw-trace-glow{fill:none;stroke:var(--sw-trace);stroke-width:2;opacity:.16;stroke-linecap:round;stroke-linejoin:round}
.sw-sweep{fill:var(--sw-trace);stroke:none}
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
  .pageHtml({ title: M.page.heading, theme, body, script: kitScript() + live + (embed ? EMBED_SCRIPT : "") })
  .replace('<meta charset="utf-8">', `<meta charset="utf-8">${MIT_NOTICE}`)
  .replace("</style></head>", `${SW_CSS}${embed ? EMBED_CSS : ""}</style></head>`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log("wrote", OUT, (Buffer.byteLength(html) / 1024).toFixed(1) + " KB");
