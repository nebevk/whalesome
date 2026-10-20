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
