// The truth behind Fig 2. Every number the figure shows, in its readout, ruler, scope,
// aria text and caption, is computed from the constants here.
//
// Sources
//   The bent horn  Huggenberger, André & Oelschläger 2016, J Mar Biol Assoc UK 96(4):783
//                  (doi 10.1017/S0025315414001118): the phonic lips (museau de singe) at the
//                  front of the spermaceti organ, the distal air sac ahead of them and the
//                  frontal air sac against the skull's back wall; the inter-pulse interval is
//                  the two-way travel time between those two air sacs; in the "bent horn"
//                  part of the sound leaves through the junk on every cycle; the junk's fat
//                  lenses "may" focus it; the head reaches nearly a third of body length in
//                  adult males; the loudest sounds in the animal kingdom, up to 236 dB.
//                  Zimmer, Madsen, Teloni, Johnson & Tyack 2005, JASA 118(5):3337: most of
//                  the backward sound reflects off the frontal sac into the junk and leaves
//                  as the p1 pulse, first shown in a live whale; the IPI can be read p0 to p1
//                  or p1 to p2.
//   P1_OVER_P0_DB  Zimmer et al. 2005 (JASA 118:3337): on axis, p1 is "some 40 dB" above p0.
//   BEAM_DEG       same paper: a -3 dB beam about 8.3 degrees wide (directivity index 27 dB),
//                  citing Møhl et al. 2003 and Zimmer, Tyack, Johnson & Madsen 2005.
//   SOURCE_DB      Møhl, Wahlberg, Madsen, Heerfordt & Lund 2003, JASA 114(2):1143: on-axis
//   CLICK_US       clicks are monopulsed, about 100 µs long, up to 236 dB re 1 µPa rms and
//   CENTROID_KHZ   centred near 15 kHz.
//   C_OIL          Zimmer et al. 2005 (JASA 118:3337): Gordon (1991) built his IPI to length
//                  relation "using a sound speed in spermaceti oil of some 1350 m/sec"
//                  (Flewellen & Morris 1978; Goold et al. 1996). Lab measurements of the oil
//                  run a little higher, 1,390 to 1,530 m/s between 22 and 38 °C and 0 to
//                  9.1 MPa, falling as it warms (Goold 1998, PhD thesis, Bangor University).
//   GORDON         Gordon 1991, J Zool 224:301, as given by Caruso et al. 2015, PLoS ONE
//                  10:e0144503: L = 4.833 + 1.453 IPI - 0.001 IPI², L in m and IPI in ms.
//   GROWCOTT       Growcott, Miller, Sirguey, Slooten & Dawson 2011, JASA 130(1):568:
//                  L = 1.258 IPI + 5.736 (r² 0.77), from 33 males off Kaikōura.
//   SPLIT_MS       Caruso et al. 2015: Gordon's relation is reliable up to about 11 m, so it
//                  is used for IPIs up to 4 ms and Growcott's above.

export const C_OIL = 1350; // m/s, sound in spermaceti oil, as Gordon's relation assumes
export const CASE_M = [2.2, 5.4]; // case length on the bench (distance between the air sacs), metres
export const START_M = 3.4;
export const SLOW = 250; // the figure plays sound this many times slower than real

export const GORDON = [4.833, 1.453, -0.001]; // L = a + b·IPI + c·IPI²
export const GROWCOTT = [5.736, 1.258]; // L = a + b·IPI
export const SPLIT_MS = 4;

export const SOURCE_DB = 236; // dB re 1 µPa rms, on axis
export const CLICK_US = 100; // on-axis click length, µs
export const CENTROID_KHZ = 15;
export const P1_OVER_P0_DB = 40;
export const BEAM_DEG = 8.3; // -3 dB beam width

export const ipiMs = (caseM) => ((2 * caseM) / C_OIL) * 1000; // the round trip between the air sacs
export const caseOf = (ms) => ((ms / 1000) * C_OIL) / 2; // the inverse: IPI to case length
export const metresPerMs = caseOf(1); // 0.675 m of case per ms of IPI
export const bodyLengthM = (ms) =>
  ms <= SPLIT_MS ? GORDON[0] + GORDON[1] * ms + GORDON[2] * ms * ms : GROWCOTT[0] + GROWCOTT[1] * ms;

// The scope: one click's pulses as heard ahead of the whale, p0 (leaked straight out), then p1
// and p2 through the junk, one IPI apart. Heights are schematic: on axis p1 is about 40 dB,
// a hundred times in pressure, above p0, which no linear trace could show.
export const SCOPE_MS = [-1, 19];
export const PULSE_HEIGHTS = [0.22, 1, 0.45];

// ---------------------------------------------------------------------------
// Everything /anatomy shows around the figure (see data/figures.ts). The embed
// build leaves the legend and caption to the page, so they stay prerendered.
const fmt = (value, digits = 0) => value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const page = {
  id: "sperm-whale-clicks",
  fig: "Fig 2",
  heading: "Sperm whale clicks",
  src: "/figures/sperm-whale-clicks.html",
  lead:
    "A sperm whale clicks with its nose, and its clicks are the loudest known sounds made by any animal. The phonic lips at the front snap; most of the sound runs back through the oil of the spermaceti organ, bounces off an air sac against the skull and leaves forward through the fatty junk below. Some keeps bouncing between two air sacs, so every click is a train of pulses, and their spacing gives away the whale’s size. Drag the rear block, or focus the figure and use the arrow keys.",
  frameTitle:
    "Interactive figure: an acoustic bench built like a sperm whale’s nose. Drag the rear block, or focus the figure and use the arrow keys, to change the length of the oil-filled case.",
  keys: [
    { label: "Sound in the oil-filled case (the spermaceti organ)", color: "#00f0ff" },
    { label: "The forward pulse, out through the lenses (the junk)", color: "#ff3ec8" },
    { label: "Trace: one click’s pulses, an IPI apart", color: "#ffffff" },
  ],
  caption:
    `The clicker is the phonic lips at the front of the nose, driven by air from the bellows. Most of each snap runs back through the oil-filled case, ` +
    `the spermaceti organ, to the rear mirror, the frontal air sac against the skull, which turns it down into the stack of fat lenses below, the junk. ` +
    `It leaves the head as the forward pulse: up to ${SOURCE_DB} dB re 1 µPa, about ${CLICK_US} µs long and centred near ${CENTROID_KHZ} kHz, in a beam about ${fmt(BEAM_DEG)}° wide, ` +
    `some ${P1_OVER_P0_DB} dB louder head-on than the weak first pulse that leaks straight out. ` +
    `Part of the sound keeps bouncing between the two air sacs, so a click is a train of pulses, one round trip apart. ` +
    `Sound crosses the oil at about ${fmt(C_OIL)} m/s, so each millisecond of inter-pulse interval (IPI) means ${fmt(metresPerMs, 2)} m of case length. ` +
    `Body length comes from the IPI by Gordon’s relation up to ${SPLIT_MS} ms and Growcott’s above. ` +
    `Trace heights are not to scale, and sound here runs ${SLOW} times slower than real.`,
  parts: [
    { rig: "A clicker whose two “lips” snap at each click", whale: "The phonic lips, or museau de singe (“monkey’s muzzle”), at the front of the nose" },
    { rig: "A bellows that dips with every click", whale: "Air pushed through the lips from the right nasal passage" },
    { rig: "A round mirror ahead of the clicker", whale: "The distal air sac, at the tip of the nose" },
    { rig: "A telescopic tube full of oil", whale: "The spermaceti organ in its tough case, longer in a bigger whale" },
    { rig: "A mirror on the rear block, and a window leading down", whale: "The frontal air sac against the back wall of the skull, which turns the sound down into the junk" },
    { rig: "Lens plates on sliders, kept evenly spread by springs, ending in a flared horn", whale: "The junk: lens-shaped bodies of fat in connective tissue, which carry the sound forward and out at the front of the head" },
    { rig: "A hydrophone and an oscilloscope", whale: "A listener ahead of the whale: the pulses of each click arrive one IPI apart" },
    { rig: "The ruler under the carriage, in metres", whale: "The distance between the two air sacs" },
  ],
  speciesNote:
    "The giant, bent-horn nose is unique to the sperm whale. Other toothed whales click with phonic lips too (see Fig 1), but in an adult male sperm whale the head reaches nearly a third of the body’s length.",
  species: ["sperm-whale"],
  callout: { title: "How the biggest nose makes the loudest click", body: "Try the interactive figure of the sperm whale’s clicks." },
  sources: [
    { label: "Møhl et al. 2003, Journal of the Acoustical Society of America", href: "https://doi.org/10.1121/1.1586258", note: "clicks heard head-on: up to 236 dB re 1 µPa, about 100 µs long, centred near 15 kHz" },
    { label: "Zimmer, Madsen, Teloni, Johnson & Tyack 2005, Journal of the Acoustical Society of America", href: "https://www.marinebioacoustics.com/files/2005/Zimmer_et_al_2005.pdf", note: "the bent horn tested on a live whale, the 40 dB step from the first pulse to the forward one, and the sound speed behind Gordon’s relation" },
    { label: "Zimmer, Tyack, Johnson & Madsen 2005, Journal of the Acoustical Society of America", href: "https://doi.org/10.1121/1.1828501", note: "the narrow forward beam of regular clicks" },
    { label: "Huggenberger, André & Oelschläger 2016, Journal of the Marine Biological Association of the UK", href: "https://doi.org/10.1017/S0025315414001118", note: "the anatomy of the nose, and the IPI as the round trip between the air sacs" },
    { label: "Gordon 1991, Journal of Zoology", href: "https://doi.org/10.1111/j.1469-7998.1991.tb04807.x", note: "IPI to body length, reliable up to about 11 m" },
    { label: "Growcott et al. 2011, Journal of the Acoustical Society of America", href: "https://doi.org/10.1121/1.3578455", note: "IPI to body length for males over 11 m" },
    { label: "Caruso et al. 2015, PLoS ONE", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4682957/", note: "both relations, and where to switch from one to the other" },
  ],
};
