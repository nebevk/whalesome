// The truth behind Fig 1. Every number the figure shows, in its readout, dial,
// ruler, aria text and caption, is computed from the constants here.
//
// Sources
//   C            DOSITS (URI), "How fast does sound travel?" and NASA JPL: about 1,500 m/s
//                in seawater, varying from about 1,450 to 1,570 m/s with temperature,
//                salinity and depth.
//   CLICK_US     Wahlberg et al. 2011, JASA 130(4):2263, wild Tursiops aduncus and
//   CENTROID_KHZ T. truncatus: click durations 8 to 72 us, centroid frequencies 33 to 109 kHz.
//   BEAM_DEG     Au, Moore & Pawloski 1986, JASA 80:688, and Au's DTIC review (ADA265945):
//                the -3 dB transmit beam is about 10 degrees wide in both planes.
//   Click, echo, click: the next click normally waits for the echo (Ladegaard et al. 2019,
//                J Exp Biol 222: jeb189217, for targets within about 100 m).

export const C = 1500; // m/s, speed of sound in seawater (nominal)
export const CLICK_US = [8, 72]; // click duration range, microseconds
export const CENTROID_KHZ = [33, 109]; // centroid frequency range, kHz
export const BEAM_DEG = 10; // full -3 dB beam width, degrees
export const RANGE = [2, 30]; // metres the target carriage travels on the rail
export const SLOW = 50; // the figure plays sound this many times slower than real

export const echoMs = (range) => ((2 * range) / C) * 1000; // round-trip delay
export const rangeOf = (ms) => ((ms / 1000) * C) / 2; // the inverse: delay to range
export const metresPerMs = rangeOf(1); // 0.75 m of range per ms of delay
export const wavelengthMm = (kHz) => (C / (kHz * 1000)) * 1000;
export const clickLengthMm = (us) => C * us * 1e-6 * 1000; // how long a click is in water

// Dial scale: full scale is the round trip at the far end of the rail.
export const DIAL_MS = echoMs(RANGE[1]); // 40 ms

// ---------------------------------------------------------------------------
// Everything /anatomy shows around the figure (see data/figures.ts). The embed
// build leaves the legend and caption to the page, so they stay prerendered.
const fmt = (value, digits = 0) => value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const page = {
  id: "echolocation",
  fig: "Fig 1",
  heading: "Echolocation",
  src: "/figures/echolocation.html",
  lead:
    "Toothed whales see with sound. A click made in the nose is focused by the fatty melon, bounces off prey, and travels back through the lower jaw to the ear. The delay tells the whale how far away the fish is. Drag the fish, or focus the figure and use the arrow keys.",
  frameTitle:
    "Interactive figure: a sonar test tank built like a dolphin’s head. Drag the fish, or focus the figure and use the arrow keys, to change its distance.",
  keys: [
    { label: "Click, focused by the lens (the melon)", color: "#00f0ff" },
    { label: "Echo, carried by the jaw fat to the ear", color: "#ff3ec8" },
    { label: "Needle: time from click to echo", color: "#ffffff" },
  ],
  caption:
    `Each click lasts ${CLICK_US[0]} to ${CLICK_US[1]} µs in wild bottlenose dolphins and centres on ` +
    `${CENTROID_KHZ[0]} to ${CENTROID_KHZ[1]} kHz, so its waves are ${fmt(wavelengthMm(CENTROID_KHZ[1]))} ` +
    `to ${fmt(wavelengthMm(CENTROID_KHZ[0]))} mm long. The melon focuses it into a beam about ${BEAM_DEG}° wide. ` +
    `Sound crosses seawater at about ${fmt(C)} m/s, so every millisecond of round trip means ` +
    `${fmt(metresPerMs, 2)} m of range. The next click usually waits for the echo. ` +
    `In the figure, sound runs ${SLOW} times slower than real so you can follow it.`,
  parts: [
    { rig: "A clicker whose two “lips” snap at each click", whale: "The phonic lips, deep in the nasal passages below the blowhole" },
    { rig: "A bellows that dips with every click", whale: "The nasal air sacs: air pushed past the phonic lips drives each click" },
    { rig: "A lens dome reaching through the tank’s glass end", whale: "The melon, a fatty acoustic lens in the forehead that focuses clicks into a beam" },
    { rig: "A fat-filled channel running back from the water", whale: "Fat bodies in the lower jaw, which carry echoes in through a thin bony window" },
    { rig: "An ear capsule on four soft springs", whale: "The ear bones, hung on soft tissue and isolated from the skull" },
    { rig: "A dial timing click to echo", whale: "The brain, reading distance from the delay" },
    { rig: "A fish on a carriage over a ruler in metres", whale: "The prey, and how far away it is" },
  ],
  speciesNote: "Every toothed whale echolocates, from the vaquita to the sperm whale. Baleen whales are not known to.",
  species: [
    "orca", "beluga-whale", "sperm-whale", "narwhal", "long-finned-pilot-whale", "cuviers-beaked-whale",
    "pygmy-sperm-whale", "common-bottlenose-dolphin", "vaquita", "harbour-porpoise", "dalls-porpoise",
  ],
  callout: { title: "How toothed whales find prey in the dark", body: "Try the interactive echolocation figure." },
  sources: [
    { label: "NASA JPL, the speed of sound in seawater", href: "https://sealevel.jpl.nasa.gov/files/archive/activities/ts2ssac5.pdf", note: "about 1,500 m/s" },
    { label: "Wahlberg et al. 2011, Journal of the Acoustical Society of America", href: "https://doi.org/10.1121/1.3624822", note: "click duration and frequency in wild bottlenose dolphins" },
    { label: "Au, Moore & Pawloski 1986, Journal of the Acoustical Society of America", href: "https://doi.org/10.1121/1.394012", note: "the width of the transmitted beam" },
    { label: "Ladegaard et al. 2019, Journal of Experimental Biology", href: "https://doi.org/10.1242/jeb.189217", note: "the next click waiting for the echo" },
    { label: "Cranford, Amundin & Norris 1996, Journal of Morphology", href: "https://marineinfo.org/id/publication/260941", note: "the phonic lips as the sound source" },
    { label: "Cranford, Krysl & Amundin 2010, PLoS ONE", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2915923/", note: "how the fats of the lower jaw pass sound into the ear bones" },
  ],
};
