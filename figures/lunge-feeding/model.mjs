// The truth behind Fig 3. Every number the figure shows, in its readout, dials,
// ruler, aria text and caption, is computed from the constants here.
//
// Sources
//   SPECIES  Savoca et al. 2021, Nature 599:85, Extended Data Table 1: drone-measured median
//            length (m) of tagged feeding whales and their engulfment capacity (m3), from each
//            species' own allometry (Kahane-Rapport & Goldbogen 2018). Antarctic minke whales off
//            the West Antarctic Peninsula; humpback, fin and blue whales mainly off California.
//            The same table gives blue whales a median of 204 lunges and 15,904 kg of prey per
//            feeding day.
//   filter   Kahane-Rapport et al. 2020, J Exp Biol 223: jeb224196, Table 1: mean filter time
//            per lunge (s) from multi-sensor tags on the same four species.
//   SCALING  Same paper: across rorquals, engulfment volume scales with body length^3.57 and
//            filter time with body length^1.79 (95% CI 1.61 to 1.97).
//   GAPE_DEG Goldbogen, Pyenson & Shadwick 2007, Mar Ecol Prog Ser 349:289: fin whale mandibles
//            lowered to "approximately 80°" (85 to 90° in post-mortem tests); Pyenson et al. 2012,
//            Nature 485:498: a gape "that approaches 90 degrees".
//   GULP_S   Goldbogen et al. 2007: the fin whale's mouth opens and closes over about 6 s (about
//            3 s each way); Pyenson et al. 2012: "the entire process of a lunge occurs in a short
//            time span (~6 s)" in fin whales.
//   PLEAT    Shadwick et al. 2013, J Exp Biol 216:2691: in live whales the throat pleats reach a
//            mean transverse strain of 1.60, so they stretch to 2.6 times their resting width.
//   The mechanism: Goldbogen et al. 2017, Annu Rev Mar Sci 9:367 (the pouch contracts to force
//   water past the baleen; muscles in the pleated blubber are thought to power it); Pyenson
//   et al. 2012 (the tongue turns inside out into the pouch; the chin organ).

// The minke numbers are for the Antarctic minke (Balaenoptera bonaerensis), the minke whale both
// papers measured; the site's minke profile is the common minke, so the figure names it.
export const SPECIES = [
  { id: "minke-whale", name: "Antarctic minke whale", label: "Antarctic minke", length: 8.06, volume: 3.21, filter: 8.88 },
  { id: "humpback-whale", name: "humpback whale", label: "Humpback whale", length: 11.76, volume: 21.04, filter: 17.12 },
  { id: "fin-whale", name: "fin whale", label: "Fin whale", length: 18.15, volume: 41.03, filter: 31.3 },
  { id: "blue-whale", name: "blue whale", label: "Blue whale", length: 22.52, volume: 86.19, filter: 60.27 },
];
export const BLUE_DAY = { lunges: 204, preyKg: 15904 }; // per feeding day, median

export const VOLUME_POWER = 3.57; // engulfment volume ~ body length^3.57
export const FILTER_POWER = 1.79; // filter time ~ body length^1.79
export const GAPE_DEG = 80; // how far the lower jaw drops
export const GULP_S = 6; // a fin whale's lunge, mouth opening to closing
export const PLEAT_STRAIN = 1.6; // mean transverse strain of the throat pleats in live whales

// The figure, not the whale.
export const SPEEDUP = 10; // filtering plays this many times faster than real
export const RULER_M = 24; // the length ruler runs 0 to 24 m
export const DIAL_M3 = 100; // full scale of the water dial
export const DIAL_S = 80; // full scale of the stopwatch

const round1 = (value) => Math.round(value * 10 + 1e-6) / 10;
// "an 8.1 m whale", "a 22.5 m whale": 8, 11 and 18 are said with a vowel first.
const an = (number, capital = false) => (/^(8|11|18)(\D|$)/.test(number) ? (capital ? "An" : "an") : capital ? "A" : "a");
const fmt = (value, digits = 0) => value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
export const metres = (s) => fmt(round1(s.length), 1);
export const cubic = (s) => (s.volume < 10 ? fmt(round1(s.volume), 1) : fmt(Math.round(s.volume)));
export const seconds = (s) => fmt(Math.round(s.filter));
export const readoutOf = (s) => `${s.label} · ${metres(s)} m · ${cubic(s)} m³ · ${seconds(s)} s`;
export const describe = (s) =>
  `${s.name[0].toUpperCase()}${s.name.slice(1)}, ${metres(s)} metres long: one gulp holds about ${cubic(s)} cubic metres of water, which takes about ${seconds(s)} seconds to filter.`;

// ---------------------------------------------------------------------------
// Everything /anatomy shows around the figure (see data/figures.ts). The embed
// build leaves the legend and caption to the page, so they stay prerendered.
const minke = SPECIES[0];
const blue = SPECIES[SPECIES.length - 1];

export const page = {
  id: "lunge-feeding",
  fig: "Fig 3",
  heading: "Lunge feeding",
  src: "/figures/lunge-feeding.html",
  lead:
    "Rorquals, the baleen whales with pleated throats, feed in gulps. A whale speeds up, drops its jaw almost to a right angle and lets its throat balloon around a mouthful of water and krill, which in the biggest species can weigh more than the whale itself. Then it strains the water out through its baleen. Drag along the ruler to pick a whale, or focus the figure and use the arrow keys.",
  frameTitle:
    "Interactive figure: a gulp-and-sieve rig built like a rorqual’s mouth. Drag along the ruler, or focus the figure and use the arrow keys, to pick a whale.",
  keys: [
    { label: "Seawater, taken in and pushed out through the baleen", color: "#00f0ff" },
    { label: "Krill, held back by the baleen and swallowed", color: "#ff3ec8" },
    { label: "Needles: water held, and seconds of filtering", color: "#ffffff" },
  ],
  caption:
    `The lower jaw drops to about ${GAPE_DEG}°, nearly a right angle, and the pleated throat balloons around the gulp, which takes about ${GULP_S} s in a fin whale. ` +
    `Then the mouth closes, the throat squeezes, and the water leaves through the baleen, which keeps the krill. ` +
    `${an(metres(minke), true)} ${metres(minke)} m ${minke.name} of typical size gulps about ${cubic(minke)} m³ and filters it in about ${seconds(minke)} s; ` +
    `${an(metres(blue))} ${metres(blue)} m ${blue.name} gulps about ${cubic(blue)} m³ and needs about ${seconds(blue)} s. ` +
    `Across rorquals the gulp grows with body length to the power ${VOLUME_POWER} and the filtering time to the power ${FILTER_POWER}, ` +
    `so the biggest whales take the biggest gulps but lunge less often: off California, blue whales lunge about ${fmt(Math.round(BLUE_DAY.lunges / 10) * 10)} times on a feeding day ` +
    `and eat about ${fmt(Math.round(BLUE_DAY.preyKg / 1000))} tonnes of krill. ` +
    `In the figure, filtering runs ${SPEEDUP} times faster than real; the stopwatch shows real seconds.`,
  parts: [
    { rig: `A jaw frame hinged at the back that drops to ${GAPE_DEG}°`, whale: "The lower jaw: two separate, loosely jointed bones that open almost to a right angle" },
    { rig: "A pleated bellows hanging under the body", whale: `The throat pouch: grooved blubber that stretches to about ${fmt(1 + PLEAT_STRAIN, 1)} times its resting width around the body, with the tongue turned inside out into it` },
    { rig: "Two combs of fringed plates hanging from the top beam", whale: "The baleen: rows of plates hanging from the upper jaw, whose fringed inner edges act as a sieve" },
    { rig: "A ram that lifts the floor of the bellows", whale: "The muscles of the throat pouch, thought to squeeze the water back out" },
    { rig: "A sensor in the tip of the chin, wired to the head", whale: "A sensory organ between the two jaw bones at the chin, thought to sense the jaw opening and the throat stretching, and to help time the gulp" },
    { rig: "A tray behind the head", whale: "The stomach, where the swallowed krill go" },
    { rig: "A water dial and a stopwatch", whale: "How much one gulp holds, and how long it takes to filter" },
    { rig: "A rider on a ruler in metres", whale: "The whale’s length" },
  ],
  speciesNote:
    "All rorquals lunge-feed, including the blue, fin, sei, Bryde’s, minke and humpback whales on this site; sei whales also skim-feed. Other baleen whales feed differently: right whales and bowheads swim slowly with their mouths open, filtering all the time, and gray whales mostly suck up their prey from the seafloor.",
  species: ["blue-whale", "fin-whale", "humpback-whale", "minke-whale", "sei-whale", "brydes-whale"],
  callout: { title: "How rorquals gulp their food", body: "Try the interactive lunge-feeding figure." },
  sources: [
    { label: "Kahane-Rapport et al. 2020, Journal of Experimental Biology", href: "https://doi.org/10.1242/jeb.224196", note: "filter times, and how the gulp and the filtering time grow with length" },
    { label: "Savoca et al. 2021, Nature", href: "https://doi.org/10.1038/s41586-021-03991-5", note: "typical lengths, gulp sizes, lunges and krill eaten per day" },
    { label: "Goldbogen, Pyenson & Shadwick 2007, Marine Ecology Progress Series", href: "https://doi.org/10.3354/meps07066", note: "the 80° gape" },
    { label: "Pyenson et al. 2012, Nature", href: "https://doi.org/10.1038/nature11135", note: "the sensory organ in the chin, and the tongue turning inside out" },
    { label: "Shadwick et al. 2013, Journal of Experimental Biology", href: "https://doi.org/10.1242/jeb.081752", note: "how far the throat pleats stretch" },
    { label: "Goldbogen et al. 2017, Annual Review of Marine Science", href: "https://doi.org/10.1146/annurev-marine-122414-033905", note: "how the water is pushed out, and how other baleen whales feed" },
    { label: "Brodie & Vikingsson 2009, Journal of Northwest Atlantic Fishery Science", href: "https://journal.nafo.int/Portals/0/2009-2010/5-brodie.pdf", note: "sei whales skim-feeding" },
  ],
};
