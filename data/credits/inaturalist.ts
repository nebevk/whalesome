// Credits for iNaturalist photos, keyed by iNaturalist photo id (as a string).
// page is the observation the photo belongs to. See data/inaturalist.ts.
import type { PhotoCredit } from '~/types/species'

export const credits: Record<string, PhotoCredit> = {
  // Pygmy sperm whale, Azores
  '540415640': { author: 'Daniel Benák', license: 'CC BY 4.0', page: 'https://www.inaturalist.org/observations/299954016', source: 'iNaturalist' },
  '540416162': { author: 'Daniel Benák', license: 'CC BY 4.0', page: 'https://www.inaturalist.org/observations/299954016', source: 'iNaturalist' },
  '540415586': { author: 'Daniel Benák', license: 'CC BY 4.0', page: 'https://www.inaturalist.org/observations/299954016', source: 'iNaturalist' },
  // Narwhal, north Baffin Island
  '565614005': { author: 'steve b', license: 'CC0', page: 'https://www.inaturalist.org/observations/313224281', source: 'iNaturalist' },
  '565614141': { author: 'steve b', license: 'CC0', page: 'https://www.inaturalist.org/observations/313224281', source: 'iNaturalist' },
  // Bryde's whale
  '245799020': { author: 'Jan Ebr & Ivana Ebrová', license: 'CC BY 4.0', page: 'https://www.inaturalist.org/observations/143331934', source: 'iNaturalist' },
  '436623572': { author: 'Dan Schofield', license: 'CC BY 4.0', page: 'https://www.inaturalist.org/observations/244749254', source: 'iNaturalist' },
}
