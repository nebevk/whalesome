// Photo credits for the Wikimedia Commons images used by the 11 toothed whale profiles in
// data/species.ts. Keys are Commons file names exactly as they appear in the image URL
// (after the NNNpx- thumbnail prefix or Special:FilePath/), URL-decoded, underscores kept.
// Licence short names and file pages come from the Commons API; authors are the credited
// photographer or source. Unsplash images need no entry.

export interface PhotoCredit { author: string, license: string, page: string }

export const credits: Record<string, PhotoCredit> = {
  // Orca
  'J-50_orca.jpg': { author: 'NOAA Fisheries and Vancouver Aquarium', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:J-50_orca.jpg' },
  'Killerwhales_jumping.jpg': { author: 'Robert Pitman, NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Killerwhales_jumping.jpg' },
  'Orca_porpoising.jpg': { author: 'Minette Layne', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Orca_porpoising.jpg' },
  'Orcinus_orca_(Vestfjord).jpg': { author: 'Yathin S Krishnappa', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Orcinus_orca_(Vestfjord).jpg' },
  'Killer_Whale_chasing_Chinook.jpg': { author: 'John Durban, Holly Fearnbach and Lance Barrett-Lennard, via Oregon State University', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Killer_Whale_chasing_Chinook.jpg' },
  'Type_C_Orcas_2.jpg': { author: 'Robert Pitman, NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Type_C_Orcas_2.jpg' },
  'Killer_Whales_Hunting_a_Seal.jpg': { author: 'Callan Carpenter', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Killer_Whales_Hunting_a_Seal.jpg' },

  // Beluga
  'Beluga_1_1999-07-03_cropped.jpg': { author: 'Ansgar Walk (cropped by Peter Fitzgerald)', license: 'CC BY-SA 2.5', page: 'https://commons.wikimedia.org/wiki/File:Beluga_1_1999-07-03_cropped.jpg' },
  'St._Lawrence_beluga_and_calf.jpg': { author: 'Saucoin', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:St._Lawrence_beluga_and_calf.jpg' },
  'Belugaschule_1999-07-02.jpg': { author: 'Ansgar Walk', license: 'CC BY 2.5', page: 'https://commons.wikimedia.org/wiki/File:Belugaschule_1999-07-02.jpg' },
  'Belugas_(124233821).jpeg': { author: 'Toporniz', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Belugas_(124233821).jpeg' },
  'Beluga_Whale_Tadoussac_Quebec_Canada_Luca_Galuzzi_2005.jpg': { author: 'Luca Galuzzi', license: 'CC BY-SA 2.5', page: 'https://commons.wikimedia.org/wiki/File:Beluga_Whale_Tadoussac_Quebec_Canada_Luca_Galuzzi_2005.jpg' },
  'Beluga_premier.gov.ru-6.jpeg': { author: 'Premier.gov.ru', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Beluga_premier.gov.ru-6.jpeg' },
  'Beluga_premier.gov.ru-8.jpeg': { author: 'Premier.gov.ru', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Beluga_premier.gov.ru-8.jpeg' },
  'Oceanogràfic_29102004.jpg': { author: 'Javier Yaya Tur', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Oceanogr%C3%A0fic_29102004.jpg' },

  // Sperm whale
  'Sperm_whale_pod.jpg': { author: 'Gabriel Barathieu', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Sperm_whale_pod.jpg' },
  'Mother_and_baby_sperm_whale.jpg': { author: 'Gabriel Barathieu', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Mother_and_baby_sperm_whale.jpg' },
  'Sperm_whale_Tim_Cole_NMFS_crop.jpg': { author: 'Tim Cole, NOAA Fisheries', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Sperm_whale_Tim_Cole_NMFS_crop.jpg' },
  'Sperm_whale_(Physeter_macrocephalus),_São_Miguel_Island,_Azores,_Portugal_(PPL1-Corrected)-2.jpg': { author: 'Jules Verne Times Two', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Sperm_whale_(Physeter_macrocephalus),_S%C3%A3o_Miguel_Island,_Azores,_Portugal_(PPL1-Corrected)-2.jpg' },
  'Sperm_Whale._(Physeter_macrocephalus)_(37611504244).jpg': { author: 'Bernard Spragg', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Sperm_Whale._(Physeter_macrocephalus)_(37611504244).jpg' },
  'Two_sperm_whales_(Physeter_macrocephalus),_São_Miguel_Island,_Azores,_Portugal_(PPL1-Corrected).jpg': { author: 'Jules Verne Times Two', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Two_sperm_whales_(Physeter_macrocephalus),_S%C3%A3o_Miguel_Island,_Azores,_Portugal_(PPL1-Corrected).jpg' },

  // Narwhal
  'Pod_Monodon_monoceros.jpg': { author: 'Kristin Laidre, Polar Science Center (University of Washington) and NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Pod_Monodon_monoceros.jpg' },
  'Narwhal_at_ice_edge.jpg': { author: 'Paul Gierszewski', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Narwhal_at_ice_edge.jpg' },
  'Monodon_monoceros_pod.jpg': { author: 'Kristin Laidre, Polar Science Center (University of Washington) and NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Monodon_monoceros_pod.jpg' },
  'Narwhal_satellite.jpg': { author: 'Kristin Laidre, NOAA Office of Ocean Exploration and Research', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Narwhal_satellite.jpg' },

  // Long-finned pilot whale
  'Griend_-_long-finned_pilot_whale_-_Globicephala_melas_2.jpg': { author: 'Bouke ten Cate', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Griend_-_long-finned_pilot_whale_-_Globicephala_melas_2.jpg' },
  'Globicephala_melas_Cape_Breton_group.jpg': { author: 'Barney Moss', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Globicephala_melas_Cape_Breton_group.jpg' },
  'Globicephala_melas_Cape_Breton_1.jpg': { author: 'Barney Moss', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Globicephala_melas_Cape_Breton_1.jpg' },
  'Spyhopping_(cropped).JPG': { author: 'Elizabeth Zwamborn', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Spyhopping_(cropped).JPG' },
  'LF_Pilot_Whale_Goban_Spur.jpg': { author: 'Mmo iwdg', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:LF_Pilot_Whale_Goban_Spur.jpg' },

  // Cuvier's beaked whale
  'Ziphius_Ligurian_Sea.jpg': { author: 'Charles Davies', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ziphius_Ligurian_Sea.jpg' },
  'Ziphius_cavirostris_in_Dominica,_2012.jpg': { author: 'Laurent Bouveret', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ziphius_cavirostris_in_Dominica,_2012.jpg' },
  'Ziphius_cavirostris_47619123.jpg': { author: 'Charlotte Kirchner', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ziphius_cavirostris_47619123.jpg' },
  'Ziphius_cavirostris_Mar_Ligure.jpg': { author: 'Emmanuelbaltasar', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ziphius_cavirostris_Mar_Ligure.jpg' },
  'Cuvier’s_Beaked_Whale_(Ziphius_cavirostris).jpg': { author: 'Laura (Laney) White, USGS Western Ecological Research Center', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Cuvier%E2%80%99s_Beaked_Whale_(Ziphius_cavirostris).jpg' },

  // Pygmy sperm whale
  'Pygmy_sperm_whale.jpg': { author: 'Inwater Research Group', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Pygmy_sperm_whale.jpg' },
  'Zwergpottwal_Kogia_breviceps_DSC_0071.jpg': { author: 'Martina Nolte', license: 'CC BY-SA 3.0 de', page: 'https://commons.wikimedia.org/wiki/File:Zwergpottwal_Kogia_breviceps_DSC_0071.jpg' },
  'Zwergpottwal_Kogia_breviceps_DSC_0058.jpg': { author: 'Martina Nolte', license: 'CC BY-SA 3.0 de', page: 'https://commons.wikimedia.org/wiki/File:Zwergpottwal_Kogia_breviceps_DSC_0058.jpg' },
  'Kogia_breviceps_(Pigmy_Sperm_Whale;_Paraoa_Teoteo)_(48740079578).jpg': { author: 'Auckland Museum', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Kogia_breviceps_(Pigmy_Sperm_Whale;_Paraoa_Teoteo)_(48740079578).jpg' },

  // Common bottlenose dolphin
  'Tursiops_truncatus_01-cropped.jpg': { author: 'NASA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Tursiops_truncatus_01-cropped.jpg' },
  'Bottlenose_dolphin_with_young.JPG': { author: 'Peter Asprey', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Bottlenose_dolphin_with_young.JPG' },
  'Dolphins_Croatia_(20022107230).jpg': { author: 'Rob Schleiffert', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Dolphins_Croatia_(20022107230).jpg' },
  'Anim1074_-_Flickr_-_NOAA_Photo_Library.jpg': { author: 'NOAA Photo Library', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Anim1074_-_Flickr_-_NOAA_Photo_Library.jpg' },
  'Anim1069_-_Flickr_-_NOAA_Photo_Library.jpg': { author: 'NOAA Photo Library', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Anim1069_-_Flickr_-_NOAA_Photo_Library.jpg' },

  // Vaquita
  'Vaquita6_Olson_NOAA.jpg': { author: 'Paula Olson, NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Vaquita6_Olson_NOAA.jpg' },
  'Vaquita2_Olson_NOAA.jpg': { author: 'Paula Olson, NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Vaquita2_Olson_NOAA.jpg' },
  'Vaquita4_Olson_NOAA.jpg': { author: 'Paula Olson, NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Vaquita4_Olson_NOAA.jpg' },
  'Vaquita7_Olson_NOAA.jpg': { author: 'Paula Olson, NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Vaquita7_Olson_NOAA.jpg' },

  // Harbour porpoise
  'Harbor_porpoise_in_Glacier_Bay_(38a04a5d-1dd8-b71c-0728-33257acd330a)_(cropped).jpg': { author: 'National Park Service', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Harbor_porpoise_in_Glacier_Bay_(38a04a5d-1dd8-b71c-0728-33257acd330a)_(cropped).jpg' },
  'Harbor_porpoise_at_surface.jpg': { author: 'NOAA Fisheries', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Harbor_porpoise_at_surface.jpg' },
  'Schweinswal.jpg': { author: 'NOAA', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Schweinswal.jpg' },
  'Schweinswale_im_Walschutzgebiet_Nationalpark_SH-Wattenmeer.jpg': { author: 'Nishkam42', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Schweinswale_im_Walschutzgebiet_Nationalpark_SH-Wattenmeer.jpg' },
  'Ecomare_-_bruinvis_Michael_in_2015_(bruinvis-michael2015-9313-sw).jpg': { author: 'Salko de Wolf, Ecomare', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ecomare_-_bruinvis_Michael_in_2015_(bruinvis-michael2015-9313-sw).jpg' },

  // Dall's porpoise
  'Phocoenoides_dalli_(Dall\'s_porpoise).jpg': { author: 'Susan E Adams', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Phocoenoides_dalli_(Dall%27s_porpoise).jpg' },
  'Dall\'s_Porpoise.jpg': { author: 'Brocken Inaglory', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Dall%27s_Porpoise.jpg' },
  'Dall\'s_Porpoise_(692ab6fa-1dd8-b71b-0b18-15b0cc71f6c6).jpg': { author: 'National Park Service', license: 'Public domain', page: 'https://commons.wikimedia.org/wiki/File:Dall%27s_Porpoise_(692ab6fa-1dd8-b71b-0b18-15b0cc71f6c6).jpg' },
  'Dalls_porpoises.jpg': { author: 'Greg Schechter', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Dalls_porpoises.jpg' },
  'Cutting_through_the_water_(6895679550).jpg': { author: 'Bo Mertz', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Cutting_through_the_water_(6895679550).jpg' },
}
