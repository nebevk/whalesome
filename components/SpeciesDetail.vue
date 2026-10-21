<template>
  <div v-if="species" :id="species.id" class="scroll-mt-20">
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <div class="flex flex-wrap items-baseline gap-3 mb-2">
          <h2 class="card-title text-3xl">{{ species.name }}</h2>
          <StatusBadge :status="species.conservationStatus" />
          <span class="badge badge-outline capitalize">{{ species.group }} whale</span>
        </div>
        <p class="text-base-content/70 italic text-lg mb-4">
          {{ species.scientificName }}
          <span class="text-base-content/50 not-italic"> &middot; Family {{ species.family }}</span>
        </p>
        <p class="text-base-content/80 text-lg mb-6">{{ species.description }}</p>

        <SpeciesAudio v-if="species.audio" :clip="species.audio" class="mb-6" />

        <div class="rounded-box overflow-hidden bg-base-300 mb-6">
          <!-- With a verified calf photo, a drag-to-compare slider. DaisyUI's diff positions
               each half's direct child absolutely and stacks the adult half with z-index:1,
               so the photos sit directly inside and the captions live below, outside it. -->
          <div v-if="species.baby.image" class="relative">
            <div class="diff aspect-[16/9]" tabindex="0">
              <div class="diff-item-1" role="img" :aria-label="`Adult ${species.name}`" tabindex="0">
                <NuxtImg :src="species.adult.image" alt="" sizes="sm:100vw md:80vw lg:60vw" />
              </div>
              <div class="diff-item-2" role="img" :aria-label="`${species.name} calf`">
                <NuxtImg :src="species.baby.image" alt="" sizes="sm:100vw md:80vw lg:60vw" />
              </div>
              <div class="diff-resizer" />
            </div>
            <span class="photo-tag left-3">Adult</span>
            <span class="photo-tag right-3">Calf</span>
          </div>
          <!-- No verified calf photo: the adult alone. Never borrow another species' calf. -->
          <NuxtImg
            v-else
            :src="species.adult.image"
            :alt="`Adult ${species.name}`"
            sizes="sm:100vw md:80vw lg:60vw"
            class="block w-full aspect-[16/9] object-cover"
          />

          <!-- Stacked on phones: sourced sizes can be long ("Females 5-7 m…, males…"). -->
          <div class="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-base-content/10">
            <div v-for="stage in lifeStages" :key="stage.label" class="p-3 sm:p-4">
              <h3 class="text-base sm:text-lg font-bold mb-1 sm:mb-2">{{ stage.label }}</h3>
              <p class="text-xs sm:text-sm"><strong>Size:</strong> {{ stage.size }}</p>
              <p class="text-xs sm:text-sm"><strong>Weight:</strong> {{ stage.weight }}</p>
            </div>
          </div>
          <p v-if="species.baby.image" class="hidden sm:block px-4 pb-3 -mt-1 text-xs text-base-content/50">
            Drag the divider on the photo to compare adult and calf.
          </p>
          <p v-if="heroCredits.length" class="px-4 pb-3 text-[11px] text-base-content/50">
            {{ heroCredits.length > 1 ? 'Photos' : 'Photo' }}:
            <template v-for="(credit, i) in heroCredits" :key="credit.page">
              <template v-if="credit.source === 'iNaturalist'">
                {{ credit.author }} on <a :href="credit.page" class="link link-hover" target="_blank" rel="noopener noreferrer">iNaturalist<span class="sr-only"> (opens in a new tab)</span></a>, {{ credit.license }}
              </template>
              <template v-else>
                <a :href="credit.page" class="link link-hover" target="_blank" rel="noopener noreferrer">{{ credit.author }}<span class="sr-only"> (opens in a new tab)</span></a>, {{ credit.license }}
              </template>
              <span v-if="i < heroCredits.length - 1"> · </span>
            </template>
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">Adult</h3>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li v-for="char in species.adult.characteristics" :key="char">{{ char }}</li>
              </ul>
              <div class="divider my-2">Notable facts</div>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="fact in species.adult.facts" :key="fact">{{ fact }}</li>
              </ul>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">Calf</h3>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li v-for="char in species.baby.characteristics" :key="char">{{ char }}</li>
              </ul>
              <div class="divider my-2">Notable facts</div>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="fact in species.baby.facts" :key="fact">{{ fact }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-6 grid md:grid-cols-2 gap-4">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Habitat</div>
            <div class="stat-value text-lg leading-snug whitespace-normal">{{ species.habitat }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Conservation</div>
            <div class="stat-value text-lg leading-snug whitespace-normal">{{ species.conservationStatus }}</div>
          </div>
        </div>

        <!-- Interactive figures on /anatomy that cover this species (data/figures.ts). -->
        <ul v-if="relatedFigures.length" class="mt-6 space-y-2">
          <li v-for="figure in relatedFigures" :key="figure.id">
            <NuxtLink
              :to="`/anatomy#${figure.id}`"
              class="group flex items-center gap-4 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              <CubeTransparentIcon class="h-7 w-7 flex-none text-primary" aria-hidden="true" />
              <span class="flex-1">
                <span class="block font-semibold">{{ figure.callout.title }}</span>
                <span class="block text-sm text-base-content/70">{{ figure.callout.body }}</span>
              </span>
              <ArrowRightIcon class="h-5 w-5 flex-none text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>

        <section class="mt-8">
          <SizeComparison :name="species.name" :size="species.adult.size" />
        </section>

        <section v-if="species.habitatRegions?.length" class="mt-10">
          <!-- grow-0 on the captions: DaisyUI gives every <p> inside .card-body flex-grow: 1,
               which stretched them across the row so they sat flush against the heading. -->
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
            <h3 class="text-xl font-semibold">Where they live</h3>
            <p class="grow-0 text-xs text-base-content/60">
              {{ species.habitatRegions.length }} {{ species.habitatRegions.length === 1 ? 'hotspot' : 'hotspots' }}
            </p>
          </div>
          <SpeciesMap :regions="species.habitatRegions" />
        </section>

        <section v-if="species.gallery?.length" class="mt-10">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
            <h3 class="text-xl font-semibold">Gallery</h3>
            <p class="grow-0 text-xs text-base-content/60">
              Photos from {{ gallerySources }}. Click any image.
            </p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Sensitive photos start blurred (also in the prerendered HTML); the first
                 click reveals one, after that it opens the lightbox like the rest. -->
            <button
              v-for="(image, i) in species.gallery"
              :key="i"
              type="button"
              class="group relative block aspect-[4/3] rounded-lg overflow-hidden bg-base-300"
              :class="isHidden(image) ? 'cursor-pointer' : 'cursor-zoom-in'"
              @click="isHidden(image) ? reveal(image) : openLightbox(i)"
            >
              <NuxtImg
                :src="image.src"
                :alt="image.caption"
                sizes="sm:50vw md:33vw"
                class="w-full h-full object-cover transition-[transform,filter] duration-500"
                :class="isHidden(image) ? 'scale-110 blur-xl' : 'group-hover:scale-105'"
              />
              <span
                v-if="image.source === 'inaturalist'"
                class="absolute top-2 left-2 z-[1] rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm"
              >iNaturalist</span>
              <span v-if="isHidden(image)" class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/35 p-3 text-center">
                <EyeSlashIcon class="h-6 w-6 text-white/90" aria-hidden="true" />
                <span class="text-xs text-white sm:text-sm">{{ image.sensitive }}</span>
                <span class="mt-1 rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white group-hover:bg-white/15">Show photo</span>
              </span>
              <div v-else class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p class="text-white text-sm text-left">{{ image.caption }}</p>
              </div>
            </button>
          </div>

          <details v-if="galleryCredits.length" class="mt-3 text-xs text-base-content/60">
            <summary class="cursor-pointer select-none hover:text-base-content/80">Photo credits</summary>
            <ul class="mt-2 space-y-1">
              <li v-for="item in galleryCredits" :key="item.caption">
                {{ item.caption }}:
                <template v-if="item.credit.source === 'iNaturalist'">
                  {{ item.credit.author }} on
                  <a :href="item.credit.page" class="link link-hover" target="_blank" rel="noopener noreferrer">iNaturalist<span class="sr-only"> (opens in a new tab)</span></a>,
                </template>
                <template v-else>
                  <a :href="item.credit.page" class="link link-hover" target="_blank" rel="noopener noreferrer">{{ item.credit.author }}<span class="sr-only"> (opens in a new tab)</span></a>,
                </template>
                {{ item.credit.license }}
              </li>
            </ul>
          </details>

          <!-- An invitation to iNaturalist on every profile it covers; the first sentence
               only when this page shows photos people shared there. -->
          <aside
            v-if="inatSightings"
            class="mt-6 flex flex-col gap-4 rounded-lg border border-base-content/10 bg-base-200 p-4 sm:flex-row sm:items-center"
          >
            <GlobeAmericasIcon class="h-8 w-8 flex-none text-primary" aria-hidden="true" />
            <div class="flex-1 text-sm">
              <h4 class="font-semibold text-base">Sightings on iNaturalist</h4>
              <span class="block mt-1 text-base-content/70">
                <template v-if="usesInat">Some photos on this page were shared on iNaturalist by the people who took them. </template>
                iNaturalist is a free community science site: anyone can post a wildlife sighting, others help identify it, and researchers use the records to learn where species live.
              </span>
            </div>
            <div class="flex flex-none flex-col gap-2 sm:items-end">
              <a :href="inatSightings" class="btn btn-primary btn-sm rounded-full" target="_blank" rel="noopener noreferrer">
                See {{ species.name }} sightings
                <ArrowTopRightOnSquareIcon class="h-4 w-4" aria-hidden="true" />
                <span class="sr-only"> on iNaturalist (opens in a new tab)</span>
              </a>
              <a href="https://www.inaturalist.org" class="link link-hover text-xs text-base-content/60" target="_blank" rel="noopener noreferrer">
                Visit iNaturalist<span class="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </aside>

          <ImageLightbox
            v-model:index="lightboxIndex"
            v-model:open="lightboxOpen"
            :images="species.gallery"
            :revealed="[...revealed]"
            @reveal="reveal"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GalleryImage, WhaleSpecies } from '~/types/species'
import { figuresFor } from '~/data/figures'
import { creditFor, type PhotoCredit } from '~/data/imageCredits'
import { inatSightingsUrl, inatTaxa } from '~/data/inaturalist'

interface Props {
  species: WhaleSpecies | null
}

const props = defineProps<Props>()

const relatedFigures = computed(() => (props.species ? figuresFor(props.species.id) : []))

// Sensitive gallery photos stay blurred until the reader chooses to see them.
const revealed = ref(new Set<string>())
const isHidden = (image: GalleryImage) => !!image.sensitive && !revealed.value.has(image.src)
function reveal(image: GalleryImage) {
  revealed.value = new Set(revealed.value).add(image.src)
}
watch(() => props.species?.id, () => { revealed.value = new Set() })

// CC BY / BY-SA photos must be credited where they're shown (data/imageCredits.ts).
const heroCredits = computed(() => {
  if (!props.species) return []
  const found = [creditFor(props.species.adult.image), creditFor(props.species.baby.image)].filter(c => !!c)
  return found.filter((c, i) => found.findIndex(o => o!.page === c!.page) === i) as PhotoCredit[]
})
const galleryCredits = computed(() =>
  (props.species?.gallery ?? []).flatMap((image) => {
    const credit = creditFor(image.src)
    return credit ? [{ caption: image.caption, credit }] : []
  }),
)

const SOURCE_NAMES = { wikimedia: 'Wikimedia Commons', unsplash: 'Unsplash', inaturalist: 'iNaturalist' } as const
const gallerySources = computed(() => {
  const names = [...new Set((props.species?.gallery ?? []).map(image => SOURCE_NAMES[image.source]))]
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]
})

const inatSightings = computed(() => {
  const taxa = props.species ? inatTaxa[props.species.id] : undefined
  return taxa ? inatSightingsUrl(taxa) : null
})
const usesInat = computed(() =>
  heroCredits.value.some(c => c.source === 'iNaturalist') || galleryCredits.value.some(item => item.credit.source === 'iNaturalist'),
)

const lifeStages = computed(() => props.species
  ? [
      { label: 'Adult', size: props.species.adult.size, weight: props.species.adult.weight },
      { label: 'Calf', size: props.species.baby.size, weight: props.species.baby.weight },
    ]
  : [])

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<style scoped>
.photo-tag {
  position: absolute;
  top: 0.75rem;
  z-index: 3;
  pointer-events: none;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: color-mix(in oklab, var(--color-base-300) 80%, transparent);
  backdrop-filter: blur(4px);
}
</style>
