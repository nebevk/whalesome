// Interactive figures on /anatomy. Each figure's model.mjs exports a `page` object with
// everything the site shows around it, computed from the same constants the figure uses.
import { page as echolocation } from '~/figures/echolocation/model.mjs'
import { page as spermWhaleClicks } from '~/figures/sperm-whale-clicks/model.mjs'
import { page as lungeFeeding } from '~/figures/lunge-feeding/model.mjs'
import { page as deepDiving } from '~/figures/deep-diving/model.mjs'

export interface FigurePage {
  /** Anchor id on /anatomy, also the figure's folder name under figures/. */
  id: string
  fig: string
  heading: string
  /** The embed build under public/figures/. */
  src: string
  lead: string
  /** Accessible name for the iframe: what it shows and how to drive it. */
  frameTitle: string
  keys: { label: string, color: string }[]
  caption: string
  parts: { rig: string, whale: string }[]
  speciesNote: string
  /** Species profile ids the figure is about; their pages link to it. */
  species: string[]
  callout: { title: string, body: string }
  sources: { label: string, href: string, note: string }[]
}

// In page order, which matches the Fig numbers.
export const figures: FigurePage[] = [echolocation, spermWhaleClicks, lungeFeeding, deepDiving]

export const figuresFor = (speciesId: string) => figures.filter(f => f.species.includes(speciesId))
