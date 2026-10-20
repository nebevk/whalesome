// The truth behind Fig 4. Every number the figure shows, in its readout, gauge, rail,
// reservoirs, metronome, aria text and caption, is computed from the constants here.
//
// Sources
//   M_PER_ATM    NOAA Ocean Service, "How does pressure change with ocean depth?": "For every 33 feet
//                (10.06 meters) you go down, the pressure increases by one atmosphere."
//   Boyle's law  At a constant temperature a gas's volume is inversely proportional to its pressure,
//                so the lungs' air at depth is its surface volume divided by the absolute pressure.
//   COLLAPSE_M   Bostrom, Fahlman & Jones 2008, Respir Physiol Neurobiol 161:298 (doi 10.1016/j.resp.2008.03.003):
//                "Marine mammals have very compliant alveoli and stiff upper airways"; alveolar collapse
//                "is thought [to] occur between 30 and 100 m".
//   DOLPHIN_M    Ridgway & Howard 1979, Science 206:1182 (doi 10.1126/science.505001), as summarised by
//                Kooyman & Ponganis 1998: in bottlenose dolphins diving to 100 m, muscle nitrogen never rose
//                above 213 kPa, and "lung collapse probably occurred at about 70 m".
//   CT_M         Moore et al. 2011, J Exp Biol 214:2390 (doi 10.1242/jeb.055020): CT scans of a harbour seal,
//                a grey seal, a common dolphin and a harbour porpoise, dead, in a pressure vessel: full lung
//                compression from 58 m (grey seal) to 133 m (harbour porpoise).
//   O2           Kooyman & Ponganis 1998, Annu Rev Physiol 60:19 (doi 10.1146/annurev.physiol.60.1.19), table 2:
//                sperm whale (10,000 kg), 77 ml O2 per kg, 10% respiratory, 58% blood, 34% muscle (rounded,
//                as printed); Atlantic bottlenose dolphin, 36 ml O2 per kg, 34%, 27%, 39%. Table 1: sperm whale
//                muscle myoglobin 5.4 g per 100 g (Scholander 1940).
//   MB_TIMES     Mirceta et al. 2013, Science 340:1234192: maximal muscle myoglobin of elite divers "may exceed
//                values in terrestrial mammals by factors of more than 30".
//   HEART        Goldbogen et al. 2019, PNAS 116:25329 (doi 10.1073/pnas.1914273116), one blue whale off
//                California: "Heart rates during dives were typically 4 to 8 beats min-1 (bpm) and as low as
//                2 bpm"; "after-dive surface heart rates were 25 to 37 bpm".
//   Dive response Panneton 2013, Physiology 28:284 (doi 10.1152/physiol.00020.2013): bradycardia, peripheral
//                vasoconstriction, flow kept to the brain and heart; ischaemic muscle uses its myoglobin oxygen.
//   Lung oxygen  McDonald & Ponganis 2012, Biol Lett 8:1047 (doi 10.1098/rsbl.2012.0743): lung collapse "is
//                considered the primary mechanism that limits nitrogen absorption"; in a sea lion it kept an
//                oxygen reservoir in the upper airways that was used on the way up.
//   RECORD_M     Schorr et al. 2014, PLoS ONE 9:e92633: a Cuvier's beaked whale dive to 2,992 m.
//   RECORD_MIN   Quick et al. 2020, J Exp Biol 223:jeb222109: a Cuvier's beaked whale dive of 222 min.

export const M_PER_ATM = 10.06; // metres of seawater per atmosphere
export const RECORD_M = 2992; // deepest dive recorded for a mammal (Cuvier's beaked whale)
export const RECORD_MIN = 222; // longest dive recorded for a mammal (Cuvier's beaked whale)
export const COLLAPSE_M = [30, 100]; // where the alveoli are thought to finish collapsing
export const DOLPHIN_M = 70; // the estimate for bottlenose dolphins
export const CT_M = [58, 133]; // full compression in the pressure-chamber scans
export const O2 = { total: 77, lungs: 10, blood: 58, muscle: 34 }; // sperm whale: ml O2 per kg, then % in each store
export const O2_DOLPHIN = { total: 36, lungs: 34, blood: 27, muscle: 39 }; // bottlenose dolphin, same table
export const MB = 5.4; // sperm whale muscle myoglobin, g per 100 g
export const MB_TIMES = 30; // elite divers' myoglobin can exceed land mammals' by more than this factor
export const HEART_DIVE = [4, 8]; // blue whale, beats a minute during dives
export const HEART_LOW = 2; // and the lowest
export const HEART_SURFACE = [25, 37]; // after dives, at the surface

export const pressureAt = (m) => 1 + m / M_PER_ATM; // absolute pressure, atmospheres
export const lungShare = (m) => 1 / pressureAt(m); // the lungs' air as a share of its surface volume
export const P_MAX = pressureAt(RECORD_M);

// The rail is marked at every doubling of pressure, where the lungs' air halves again.
export const MARKS = Array.from({ length: Math.floor(Math.log2(P_MAX)) + 1 }, (_, k) => (2 ** k - 1) * M_PER_ATM);
export const railOf = (m) => Math.log(pressureAt(m)) / Math.log(P_MAX); // 0 at the surface, 1 at the record
export const depthOfRail = (u) => (P_MAX ** Math.min(1, Math.max(0, u)) - 1) * M_PER_ATM;

// Drawing assumption, not a measured number: the bellows (the alveoli) is drawn flat by the deep end of
// COLLAPSE_M, so the stiff ringed tube (the airways) holds what is left there, and is drawn rigid.
export const AIRWAY_SHARE = lungShare(COLLAPSE_M[1]);
export const alveolarShare = (m) => Math.max(0, (lungShare(m) - AIRWAY_SHARE) / (1 - AIRWAY_SHARE));
export const alveoliAt = (m) => (m < COLLAPSE_M[0] ? "open" : m < COLLAPSE_M[1] ? "collapsing" : "collapsed");
export const collapseOf = (m) => {
  const t = Math.min(1, Math.max(0, (m - COLLAPSE_M[0]) / (COLLAPSE_M[1] - COLLAPSE_M[0])));
  return t * t * (3 - 2 * t);
};

// The metronome keeps the middle of each measured range, in real time.
export const HEART_BPM = { surface: (HEART_SURFACE[0] + HEART_SURFACE[1]) / 2, dive: (HEART_DIVE[0] + HEART_DIVE[1]) / 2 };
export const DIVING_M = 1; // below this the chamber counts as diving and the heart slows

// Keyboard stops, metres.
export const STOPS = [0, 5, 10, 20, 30, 40, 50, 70, 100, 150, 200, 300, 500, 700, 1000, 1500, 2000, 2500, RECORD_M];

// Words and numbers, shared by the build and the live page.
export const fmtDepth = (m) => Math.round(m).toLocaleString("en-US") + " m";
export const fmtAtm = (m) => { const p = pressureAt(m); return (p < 9.95 ? p.toFixed(1) : Math.round(p).toLocaleString("en-US")) + " atm"; };
export const fmtShare = (m) => { const s = lungShare(m) * 100; return (s >= 9.95 ? Math.round(s) : s.toFixed(1)) + "%"; };
// Every part of the readout comes from the one depth it prints, rounded to the metre.
export const readoutOf = (depth) => {
  const m = Math.round(depth);
  return fmtDepth(m) + " · " + fmtAtm(m) + " · lungs " + fmtShare(m) + (alveoliAt(m) === "open" ? "" : " · " + alveoliAt(m));
};
export const describeOf = (depth) => {
  const m = Math.round(depth);
  return (m < DIVING_M ? "At the surface the pressure is 1 atmosphere and the lungs hold a full breath" :
    "At " + m.toLocaleString("en-US") + " metres the pressure is " + fmtAtm(m).replace("atm", "atmospheres") +
    " and the lungs' air is squeezed to " + fmtShare(m).replace("%", " percent") + " of its volume at the surface") +
    "; the alveoli are " + alveoliAt(m) + ". " +
    (m < DIVING_M ? "The heart beats about " + HEART_BPM.surface + " times a minute." : "The heart has slowed to about " + HEART_BPM.dive + " beats a minute.");
};

// ---------------------------------------------------------------------------
// Everything /anatomy shows around the figure (see data/figures.ts). The embed
// build leaves the legend and caption to the page, so they stay prerendered.
const fmt = (value, digits = 0) => value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const pct = (share) => fmt(share * 100);

export const page = {
  id: "deep-diving",
  fig: "Fig 4",
  heading: "Deep diving",
  src: "/figures/deep-diving.html",
  lead:
    "Every 10 m of seawater adds another atmosphere of pressure. A diving whale does not fight it: its lungs squeeze nearly flat, it carries most of its oxygen in its blood and muscle, and its heart slows right down. Drag the slider, or focus the figure and use the arrow keys.",
  frameTitle:
    "Interactive figure: a pressure chamber with a lung inside, beside three oxygen reservoirs and a metronome. Drag the slider, or focus the figure and use the arrow keys, to change the depth.",
  keys: [
    { label: "Air: the lungs, and the oxygen kept in them", color: "#00f0ff" },
    { label: "Oxygen held in the blood and muscle, and each heartbeat", color: "#ff3ec8" },
    { label: "Needle: pressure, one atmosphere for every 10 m", color: "#ffffff" },
  ],
  caption:
    `Seawater adds one atmosphere of pressure for every ${fmt(M_PER_ATM, 2)} m, and by Boyle’s law the lungs’ air shrinks to match: ` +
    `to ${pct(lungShare(10))}% of its surface volume at 10 m and ${pct(lungShare(100))}% at 100 m. ` +
    `The soft alveoli (the bellows) are thought to finish collapsing between about ${COLLAPSE_M[0]} and ${COLLAPSE_M[1]} m, an estimated ${DOLPHIN_M} m in bottlenose dolphins, ` +
    `though scans of bodies in a pressure chamber put full compression as deep as ${CT_M[1]} m. ` +
    `The last air then sits in the stiff airways (the ringed tube), where little nitrogen crosses into the blood, which is thought to help whales avoid decompression sickness. ` +
    `A sperm whale keeps only about ${O2.lungs}% of its oxygen in its lungs, against ${O2.blood}% in its blood and ${O2.muscle}% in its muscle, held there by myoglobin (${fmt(MB, 1)} g in every 100 g of muscle); ` +
    `a bottlenose dolphin, a shallower diver, keeps about a third in its lungs. ` +
    `On a dive the heart slows: in the one blue whale measured it beat ${HEART_DIVE[0]} to ${HEART_DIVE[1]} times a minute, sometimes just ${HEART_LOW}, against ${HEART_SURFACE[0]} to ${HEART_SURFACE[1]} at the surface. ` +
    `The metronome keeps time at ${HEART_BPM.dive} and ${HEART_BPM.surface} beats a minute, in real time, and the slider runs to ${fmt(RECORD_M)} m, the deepest mammal dive on record.`,
  parts: [
    { rig: "A clear chamber of seawater, its gauge reading one atmosphere for every 10 m", whale: "The ocean pressing on a diving whale" },
    { rig: "A soft bellows", whale: "The alveoli, the lungs’ tiny air sacs, where gas passes into the blood" },
    { rig: "A coil spring wound round the bellows", whale: "The flexible ribcage, which lets the chest fold in as the lungs shrink" },
    { rig: "A stiff tube with rings, on top of the bellows", whale: "The airways, braced with cartilage: the last air ends up here, and little of it crosses into the blood" },
    { rig: "Three reservoirs, each filled to its share", whale: `Where a sperm whale keeps its oxygen: about ${O2.lungs}% in the lungs, ${O2.blood}% in the blood and ${O2.muscle}% in the muscle` },
    { rig: "The third reservoir, a third full", whale: `Muscle, packed with myoglobin, which holds oxygen: elite divers can have more than ${MB_TIMES} times as much as land mammals` },
    { rig: "The valve that shuts on the lung reservoir", whale: "Collapsed alveoli: the lungs’ oxygen is out of reach until they reopen on the way up" },
    { rig: "A metronome that slows as soon as the chamber dives", whale: "The heart, which slows on a dive while the blood goes mainly to the brain and heart" },
    { rig: "A cable from a pressure switch on the chamber to the metronome", whale: "The dive reflex, which slows the heart as soon as the whale goes under" },
    { rig: "A slider on a rail marked at every doubling of pressure", whale: "Depth: at each mark the lungs’ air halves again" },
  ],
  speciesNote:
    `The deepest divers are toothed whales. Cuvier’s beaked whale holds both mammal records, a dive to ${fmt(RECORD_M)} m and one of ${RECORD_MIN} minutes, and sperm whales, narwhals and pygmy sperm whales also hunt far below the surface. ` +
    "The oxygen budget comes from a sperm whale, the heart rates from a blue whale and the collapse depth from bottlenose dolphins.",
  species: ["cuviers-beaked-whale", "sperm-whale", "narwhal", "pygmy-sperm-whale", "blue-whale", "common-bottlenose-dolphin"],
  callout: { title: "How whales survive the deep", body: "Try the interactive deep diving figure." },
  sources: [
    { label: "NOAA Ocean Service, how pressure changes with ocean depth", href: "https://oceanservice.noaa.gov/facts/pressure.html", note: "one atmosphere for every 10.06 m" },
    { label: "Bostrom, Fahlman & Jones 2008, Respiratory Physiology & Neurobiology", href: "https://doi.org/10.1016/j.resp.2008.03.003", note: "compliant alveoli, stiff airways, and collapse between 30 and 100 m" },
    { label: "Ridgway & Howard 1979, Science", href: "https://doi.org/10.1126/science.505001", note: "lung collapse at about 70 m in bottlenose dolphins" },
    { label: "Moore et al. 2011, Journal of Experimental Biology", href: "https://doi.org/10.1242/jeb.055020", note: "lungs scanned under pressure, fully compressed by 58 to 133 m" },
    { label: "McDonald & Ponganis 2012, Biology Letters", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3497143/", note: "lung collapse limits nitrogen uptake and holds back oxygen for the ascent" },
    { label: "Kooyman & Ponganis 1998, Annual Review of Physiology", href: "https://doi.org/10.1146/annurev.physiol.60.1.19", note: "where sperm whales and dolphins keep their oxygen, and sperm whale myoglobin" },
    { label: "Mirceta et al. 2013, Science", href: "https://doi.org/10.1126/science.1234192", note: "myoglobin in elite divers, more than 30 times that of land mammals" },
    { label: "Panneton 2013, Physiology", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3768097/", note: "the dive response: a slower heart, and blood kept for the brain and heart" },
    { label: "Goldbogen et al. 2019, PNAS", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6911174/", note: "a blue whale’s heart rate on its dives and at the surface" },
    { label: "Schorr et al. 2014, PLoS ONE", href: "https://doi.org/10.1371/journal.pone.0092633", note: "a Cuvier’s beaked whale dive to 2,992 m" },
    { label: "Quick et al. 2020, Journal of Experimental Biology", href: "https://doi.org/10.1242/jeb.222109", note: "a Cuvier’s beaked whale dive of 222 minutes" },
    { label: "Laidre & Heide-Jørgensen 2007, Oceanography", href: "https://tos.org/oceanography/assets/docs/20-4_laidre.pdf", note: "narwhals diving past 1,800 m in winter" },
    { label: "Kielhorn et al. 2013, Journal of Morphology", href: "https://doi.org/10.1002/jmor.20124", note: "the pygmy sperm whale as a deep diver" },
  ],
};
