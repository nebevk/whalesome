/**
 * Sourced copy for the body-plan section of /anatomy (“How Whales Work”) and
 * the baleen versus toothed comparison table.
 *
 * Every point lists the sources that support it. PMC, NOAA Fisheries,
 * university and museum links were read in full or in the relevant section.
 * Papers cited by DOI were checked against their published abstracts, and only
 * claims stated in those abstracts are used. Topic ids double as anchors, so
 * keep them clear of the figure anchors (#echolocation, #sperm-whale-clicks,
 * #lunge-feeding, #deep-diving).
 */
export interface AnatomySource { label: string, href: string }

export interface AnatomyTopic {
  /** Kebab-case anchor on /anatomy. */
  id: string
  title: string
  /** A Heroicons v2 outline component name, registered globally by plugins/heroicons.ts. */
  icon: string
  summary: string
  points: string[]
  link?: { label: string, href: string }
  sources: AnatomySource[]
}

export interface Contrast { trait: string, baleen: string, toothed: string }

export const anatomyIntro: string
  = 'Whales, dolphins and porpoises are mammals whose ancestors walked on land. They still breathe air, stay warm-blooded and feed their young on milk, but almost every part of the body has been reshaped for life in water. Here is how the main systems work, and how the two living groups, baleen whales and toothed whales, differ.'

export const bodyPlan: AnatomyTopic[] = [
  {
    id: 'land-to-sea',
    title: 'From land to sea',
    icon: 'GlobeAsiaAustraliaIcon',
    summary: 'Whales descend from four-legged land mammals. Fossils, genes and embryos all still record the move into the water.',
    points: [
      'The oldest whale fossils, from rocks in what is now Pakistan and India, are just over 50 million years old.',
      'One of the earliest whales, Pakicetus, was a wolf-sized animal that lived on land.',
      'Whales’ closest living relatives are hippos. Their closest known extinct relatives are raoellids such as Indohyus, which is thought to have waded in water.',
      'Dolphin embryos still begin to grow hind limb buds, which stop growing and disappear around the fifth week of pregnancy.',
      'Small pelvic bones remain inside the body. They are not useless leftovers: they anchor the muscles that control the penis, and in species where males compete harder for mates, males tend to have bigger pelvic bones for their size.',
    ],
    sources: [
      { label: 'Uhen 2010, Annual Review of Earth and Planetary Sciences', href: 'https://doi.org/10.1146/annurev-earth-040809-152453' },
      { label: 'Thewissen et al. 2001, Nature', href: 'https://doi.org/10.1038/35095005' },
      { label: 'Nikaido, Rooney & Okada 1999, PNAS', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC17876/' },
      { label: 'Geisler & Theodor 2009, Nature', href: 'https://doi.org/10.1038/nature07776' },
      { label: 'Thewissen et al. 2007, Nature', href: 'https://doi.org/10.1038/nature06343' },
      { label: 'Thewissen et al. 2006, PNAS', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1482506/' },
      { label: 'Dines et al. 2014, Evolution', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4213350/' },
    ],
  },
  {
    id: 'breathing',
    title: 'Breathing and the blowhole',
    icon: 'CloudIcon',
    summary: 'A whale’s nostrils sit on top of its head as the blowhole, so it can breathe at the surface while the rest of its body stays underwater.',
    points: [
      'The blowhole is the nostrils, which move to the top of the head as the embryo grows. Baleen whales keep two openings side by side; in toothed whales they fuse into a single blowhole.',
      'The spout, or “blow”, is the whale’s breath: a cloud of droplets breathed out at the surface, not a fountain of seawater.',
      'Whale lungs can empty almost completely, so a single breath can replace nearly all the air inside. Most everyday breaths are much smaller than that.',
      'Breathing is fast and forceful: resting bottlenose dolphins have been measured breathing out at more than 160 litres a second.',
      'Whales are often said to breathe only by conscious choice. Studies of dolphins found that breathing can run automatically or under conscious control, as in other mammals, and that dolphins keep breathing while half the brain sleeps.',
    ],
    link: { label: 'See how whales dive deep on one breath', href: '#deep-diving' },
    sources: [
      { label: 'Gavazzi et al. 2023, Journal of Morphology', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10107513/' },
      { label: 'Hunt et al. 2013, Conservation Physiology', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4806609/' },
      { label: 'Fahlman, Moore & Garcia-Parraga 2017, Journal of Experimental Biology', href: 'https://doi.org/10.1242/jeb.126870' },
      { label: 'Lyamin et al. 2008, Neuroscience & Biobehavioral Reviews', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8742503/' },
    ],
  },
  {
    id: 'blubber',
    title: 'Blubber and staying warm',
    icon: 'FireIcon',
    summary: 'Blubber keeps whales warm in the sea, and special blood vessels in the fins and flukes either save body heat or shed it.',
    points: [
      'Blubber is a thick layer of fatty tissue under the skin. Besides keeping the body warm, it stores energy, helps control buoyancy and streamlines the body.',
      'Bowhead whales, which live almost only in Arctic and subarctic waters, have the thickest blubber of any whale: up to about 50 cm.',
      'Blubber is not the same all the way through. In bottlenose dolphins, the middle and deep layers store and release fat, while the outer layer is thought to help keep the body streamlined.',
      'In the flukes and dorsal fin, arteries run inside a sleeve of veins. Warm blood flowing out heats the cooler blood flowing back, so less body heat escapes to the sea.',
      'To shed heat, blood can be sent through veins just under the skin instead. In dolphins, blood cooled this way is thought to help cool the reproductive organs.',
    ],
    sources: [
      { label: 'Struntz et al. 2004, Journal of Morphology', href: 'https://doi.org/10.1002/jmor.10154' },
      { label: 'NOAA Fisheries, Bowhead whale', href: 'https://www.fisheries.noaa.gov/species/bowhead-whale' },
      { label: 'Okamura et al. 2024, Ecology and Evolution', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11647330/' },
      { label: 'Meagher et al. 2002, Journal of Experimental Biology', href: 'https://doi.org/10.1242/jeb.205.22.3475' },
    ],
  },
  {
    id: 'flippers-and-flukes',
    title: 'Flippers, flukes and the skeleton',
    icon: 'HandRaisedIcon',
    summary: 'A flipper is a reshaped arm and hand. The tail flukes are something new: paddles with no bone in their blades, which evolved as the hind legs were lost.',
    points: [
      'Inside each flipper are the same bones as in a human arm and hand: the upper arm, forearm, wrist and finger bones, all wrapped in soft tissue.',
      'The fingers are long and carry extra bones, a trait called hyperphalangy. Toothed whales have five fingers; most baleen whales have four.',
      'The fluke blades contain no bone and no muscle. They are stiffened by dense layers of collagen fibres, and only the tail vertebrae run down the middle.',
      'Flukes are not reshaped legs. The hind limbs were lost, and the flukes grew from the tail as a new structure.',
      'Flukes beat up and down, while fish sweep their tails from side to side. Early whales such as Ambulocetus are thought to have swum like otters, paddling with the hind feet and undulating the tail up and down.',
    ],
    sources: [
      { label: 'Cooper et al. 2007, Anatomical Record', href: 'https://doi.org/10.1002/ar.20532' },
      { label: 'Barratclough et al. 2019, PLoS ONE', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6762177/' },
      { label: 'Gavazzi et al. 2024, Developmental Dynamics', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11656686/' },
      { label: 'Thewissen & Fish 1997, Paleobiology', href: 'https://doi.org/10.1017/S0094837300019850' },
    ],
  },
  {
    id: 'teeth-and-baleen',
    title: 'Teeth and baleen',
    icon: 'FunnelIcon',
    summary: 'What is in the mouth splits whales into two groups. Baleen whales strain their food through plates of baleen; toothed whales catch theirs with teeth.',
    points: [
      'Baleen is made of keratin, the same tough protein as hair and nails. It hangs from the upper jaw in rows of plates, whose hair-like fringes trap the food.',
      'A gray whale has 130 to 180 plates on each side of its upper jaw. Bowheads have the longest baleen of any whale.',
      'Baleen whales start out with teeth. Fetuses grow dozens of tooth buds, which are reabsorbed before birth, around the time the baleen starts to form.',
      'Toothed whales grow one set of simple, similar teeth for life, and use them to grab and hold prey, not to chew. A pantropical spotted dolphin has more than 30 in each half of each jaw.',
      'The narwhal’s tusk is a canine tooth. In males the left one usually grows out of the upper jaw from age two or three and can reach about 3 m, while in most females both teeth stay inside the jawbone.',
    ],
    link: { label: 'See how a rorqual gulps its food', href: '#lunge-feeding' },
    sources: [
      { label: 'Szewciw et al. 2010, Proceedings of the Royal Society B', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2982044/' },
      { label: 'NOAA Fisheries, Fin whale', href: 'https://www.fisheries.noaa.gov/species/fin-whale' },
      { label: 'NOAA Fisheries, North Atlantic right whale', href: 'https://www.fisheries.noaa.gov/species/north-atlantic-right-whale' },
      { label: 'NOAA Fisheries, Gray whale', href: 'https://www.fisheries.noaa.gov/species/gray-whale' },
      { label: 'NOAA Fisheries, Bowhead whale', href: 'https://www.fisheries.noaa.gov/species/bowhead-whale' },
      { label: 'Thewissen et al. 2017, Journal of Anatomy', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5345624/' },
      { label: 'Armfield et al. 2013, PeerJ', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3628747/' },
      { label: 'NOAA Fisheries, Narwhal', href: 'https://www.fisheries.noaa.gov/species/narwhal' },
      { label: 'Nweeia et al. 2012, Anatomical Record', href: 'https://doi.org/10.1002/ar.22449' },
    ],
  },
  {
    id: 'senses',
    title: 'Hearing, sight and smell',
    icon: 'EyeIcon',
    summary: 'In dark, murky water, whales depend most on sound. Sight, smell and taste have been pared back.',
    points: [
      'Toothed whales hear through the lower jaw: fat inside it carries sound back to the ear bones.',
      'A harbour porpoise hears best at 100 to 140 kHz, deep in the ultrasound range that people cannot hear.',
      'The first direct hearing tests on a baleen whale, on young minke whales in Norway in 2023, showed they can hear sounds above 45 kHz, higher than their anatomy had suggested.',
      'Every whale and dolphin studied has lost the blue-sensitive cones most mammals need for colour vision. Genes suggest sperm whales, right whales and rorquals have lost their remaining cones too, and see only with rods, the cells that work in dim light.',
      'Toothed whales have no sense of smell, but baleen whales keep a small one. About half of a bowhead’s smell genes still work, and it may use smell to find krill.',
    ],
    link: { label: 'See how echolocation works', href: '#echolocation' },
    sources: [
      { label: 'University of Southern Denmark, toothed whales and vocal fry (2023)', href: 'https://www.sdu.dk/en/om-sdu/institutter-centre/i_biologi/nyheder/tandhvalerslyde' },
      { label: 'Cranford, Krysl & Amundin 2010, PLoS ONE', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2915923/' },
      { label: 'Kastelein et al. 2002, Journal of the Acoustical Society of America', href: 'https://doi.org/10.1121/1.1480835' },
      { label: 'Houser et al. 2024, Science', href: 'https://doi.org/10.1126/science.ado7580' },
      { label: 'Houser, minke whale hearing, final report to the US Marine Mammal Commission', href: 'https://mmc.gov/wp-content/uploads/Final-Report_MMC_191671.pdf' },
      { label: 'Meredith et al. 2013, PLoS Genetics', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3630094/' },
      { label: 'Kishida et al. 2015, Zoological Letters', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4604112/' },
      { label: 'Thewissen et al. 2011, Marine Mammal Science', href: 'https://doi.org/10.1111/j.1748-7692.2010.00406.x' },
    ],
  },
  {
    id: 'baleen-whale-sound',
    title: 'How baleen whales make sound',
    icon: 'MusicalNoteIcon',
    summary: 'Toothed whales make their sounds in the nose. Baleen whales use the larynx, or voice box, rebuilt in a way found only in baleen whales.',
    points: [
      'Baleen whales were long thought to call with the larynx, but no one had shown how until 2024, when researchers tested the larynxes of a sei, a minke and a humpback whale from strandings.',
      'Two small cartilages that move our vocal folds have become long cylinders, fused at the base into a big U-shaped frame that runs nearly the length of the larynx.',
      'This frame presses against a large fatty cushion. Air pushed from the lungs past the cushion makes it vibrate, which produces very low-pitched sound.',
      'Experiments and a computer model predict that baleen whales can call only down to about 100 m, at the pitches and depths where ship noise is strongest, so they cannot escape it.',
      'Toothed whales instead push air past the phonic lips in the nose. Their echolocation clicks use so little air that they still work well over 1,000 m down.',
    ],
    link: { label: 'See how sperm whales make their clicks', href: '#sperm-whale-clicks' },
    sources: [
      { label: 'Elemans et al. 2024, Nature', href: 'https://doi.org/10.1038/s41586-024-07080-1' },
      { label: 'University of Southern Denmark, baleen whales evolved a unique larynx (2024)', href: 'https://www.sdu.dk/en/om-sdu/institutter-centre/i_biologi/nyheder/baleen-whales' },
      { label: 'Madsen, Siebert & Elemans 2023, Science', href: 'https://doi.org/10.1126/science.adc9570' },
      { label: 'University of Southern Denmark, toothed whales and vocal fry (2023)', href: 'https://www.sdu.dk/en/om-sdu/institutter-centre/i_biologi/nyheder/tandhvalerslyde' },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep',
    icon: 'MoonIcon',
    summary: 'Whale sleep looks very different from ours. Dolphins rest one half of the brain at a time, while sperm whales hang upright near the surface.',
    points: [
      'In every whale and dolphin whose brain waves have been recorded, sleep comes to one half of the brain at a time, while the other half stays awake.',
      'The eye linked to the sleeping half of the brain is usually closed, while the other eye stays open or half open.',
      'Dolphins spend about a third to over half of each day with one half of the brain asleep, and can keep swimming and surfacing to breathe meanwhile.',
      'Little or no REM sleep has been found in any whale or dolphin.',
      'Tagged sperm whales around the world make shallow, passive dives in which they hang upright just below the surface, for about 7% of the time. One group of drifting whales did not react to a passing boat until it touched them, a sign they may have been asleep.',
    ],
    sources: [
      { label: 'Lyamin et al. 2008, Neuroscience & Biobehavioral Reviews', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8742503/' },
      { label: 'Miller et al. 2008, Current Biology', href: 'https://research-portal.st-andrews.ac.uk/en/publications/stereotypical-resting-behavior-of-the-sperm-whale/' },
    ],
  },
]

export const baleenVsToothed: { rows: Contrast[], sources: AnatomySource[] } = {
  rows: [
    { trait: 'Blowholes', baleen: 'Two, side by side', toothed: 'One' },
    { trait: 'In the mouth', baleen: 'Plates of baleen, made of keratin, hanging from the upper jaw', toothed: 'Simple teeth, all alike: from two small teeth in male Cuvier’s beaked whales to more than 120 in some dolphins' },
    { trait: 'Teeth over a lifetime', baleen: 'Tooth buds form in the fetus, then vanish before birth', toothed: 'One set for life, never replaced' },
    { trait: 'How they feed', baleen: 'Filter feeding: they lunge, skim or suck in huge mouthfuls, then strain out the food', toothed: 'Catch prey by grabbing it or sucking it in, and swallow it without chewing' },
    { trait: 'Main food', baleen: 'Krill, copepods and small fish', toothed: 'Mostly fish and squid; some orcas also hunt seals and whales' },
    { trait: 'Echolocation', baleen: 'Not known to echolocate', toothed: 'Yes, from porpoises to sperm whales' },
    { trait: 'Where sounds are made', baleen: 'In the larynx, where air makes a fatty cushion vibrate', toothed: 'In the nose, where air makes the phonic lips vibrate' },
    { trait: 'Skull', baleen: 'Symmetrical', toothed: 'Lopsided around the nose and face' },
    { trait: 'Fingers in each flipper', baleen: 'Four in most species', toothed: 'Five' },
    { trait: 'Larger sex', baleen: 'Usually the female, by a little', toothed: 'Varies: male sperm whales are far bigger than females, but female porpoises are a little bigger than males' },
    { trait: 'Size range', baleen: 'From about 6 m (pygmy right whale) to the blue whale, the largest animal known to have lived', toothed: 'From about 1.5 m (vaquita) to about 16 m (male sperm whale)' },
    { trait: 'Species recognised', baleen: '15', toothed: '79, counting the baiji, which may be extinct' },
  ],
  sources: [
    { label: 'Gavazzi et al. 2023, Journal of Morphology', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10107513/' },
    { label: 'Szewciw et al. 2010, Proceedings of the Royal Society B', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2982044/' },
    { label: 'NOAA Fisheries, Fin whale', href: 'https://www.fisheries.noaa.gov/species/fin-whale' },
    { label: 'NOAA Fisheries, Cuvier’s beaked whale', href: 'https://www.fisheries.noaa.gov/species/cuviers-beaked-whale' },
    { label: 'Armfield et al. 2013, PeerJ', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3628747/' },
    { label: 'Thewissen et al. 2017, Journal of Anatomy', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5345624/' },
    { label: 'NOAA Fisheries, North Atlantic right whale', href: 'https://www.fisheries.noaa.gov/species/north-atlantic-right-whale' },
    { label: 'NOAA Fisheries, Gray whale', href: 'https://www.fisheries.noaa.gov/species/gray-whale' },
    { label: 'NOAA Fisheries, Humpback whale', href: 'https://www.fisheries.noaa.gov/species/humpback-whale' },
    { label: 'NOAA Fisheries, Sperm whale', href: 'https://www.fisheries.noaa.gov/species/sperm-whale' },
    { label: 'NOAA Fisheries, Killer whale', href: 'https://www.fisheries.noaa.gov/species/killer-whale' },
    { label: 'Stimpert et al. 2007, Biology Letters', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2391189/' },
    { label: 'Madsen, Siebert & Elemans 2023, Science', href: 'https://doi.org/10.1126/science.adc9570' },
    { label: 'University of Southern Denmark, toothed whales and vocal fry (2023)', href: 'https://www.sdu.dk/en/om-sdu/institutter-centre/i_biologi/nyheder/tandhvalerslyde' },
    { label: 'Elemans et al. 2024, Nature', href: 'https://doi.org/10.1038/s41586-024-07080-1' },
    { label: 'University of Southern Denmark, baleen whales evolved a unique larynx (2024)', href: 'https://www.sdu.dk/en/om-sdu/institutter-centre/i_biologi/nyheder/baleen-whales' },
    { label: 'Coombs et al. 2020, BMC Biology', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7350770/' },
    { label: 'Cooper et al. 2007, Anatomical Record', href: 'https://doi.org/10.1002/ar.20532' },
    { label: 'NOAA Fisheries, Blue whale', href: 'https://www.fisheries.noaa.gov/species/blue-whale' },
    { label: 'NOAA Fisheries, Harbor porpoise', href: 'https://www.fisheries.noaa.gov/species/harbor-porpoise' },
    { label: 'NOAA Fisheries, Vaquita', href: 'https://www.fisheries.noaa.gov/species/vaquita' },
    { label: 'Naturalis, Marine Mammals of the World: pygmy right whale', href: 'https://marine-mammals.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/taxon.php?id=58564' },
    { label: 'Society for Marine Mammalogy, list of marine mammal species and subspecies (April 2026)', href: 'https://marinemammalscience.org/science-and-publications/list-marine-mammal-species-subspecies/' },
  ],
}
