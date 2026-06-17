<template>
  <div class="min-h-screen">
    <!-- Hero band -->
    <section class="relative overflow-hidden px-6 pt-16 pb-16 text-center pop-hero">
      <div class="relative z-10 max-w-3xl mx-auto">
        <p class="uppercase tracking-[0.3em] text-primary/80 text-xs mb-4">By the numbers</p>
        <h1 class="text-4xl md:text-6xl font-whale text-white mb-4">Whales by the Numbers</h1>
        <p class="text-lg text-white/80">
          How many whales are left, how far they fell, and where they stand today. Figures drawn
          from the IUCN Red List, NOAA Fisheries, and the International Whaling Commission.
        </p>
      </div>
    </section>

    <div class="px-6 pb-24 -mt-6">
      <div class="max-w-6xl mx-auto space-y-16">
        <!-- Headline stat cards -->
        <section>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="stat in whaleStats"
              :key="stat.label"
              class="card bg-base-200/70 backdrop-blur border border-white/10 shadow-lg"
            >
              <div class="card-body p-5">
                <p class="text-xs uppercase tracking-wide text-base-content/60">{{ stat.label }}</p>
                <p class="text-3xl font-whale text-primary my-1">{{ stat.value }}</p>
                <p class="text-sm text-base-content/75 leading-relaxed">{{ stat.detail }}</p>
                <p class="text-[0.7rem] text-base-content/40 mt-2">{{ stat.source }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Current population bar chart -->
        <section class="card bg-base-200/60 border border-white/10 shadow-xl">
          <div class="card-body">
            <h2 class="text-2xl md:text-3xl font-whale mb-1">How many are left</h2>
            <p class="text-base-content/70 mb-2">
              Best current global estimates. The scale is logarithmic: each step right is roughly ten
              times more animals, the only way to fit the vaquita and the pilot whale on one chart.
            </p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 mb-6">
              <div
                v-for="seg in statusBreakdown"
                :key="seg.code"
                class="flex items-center gap-1.5 text-xs text-base-content/70"
              >
                <span class="h-2.5 w-2.5 rounded-full" :style="{ background: statusColor(seg.code) }" />
                {{ seg.label }}
              </div>
            </div>

            <div class="space-y-3">
              <NuxtLink
                v-for="row in currentChart"
                :key="row.id"
                :to="`/species/${row.id}`"
                class="block group"
              >
                <div class="flex items-baseline justify-between gap-3 text-sm mb-1">
                  <span class="font-medium group-hover:text-primary transition-colors">{{ row.commonName }}</span>
                  <span class="text-base-content/60 text-xs text-right">{{ row.currentText }}</span>
                </div>
                <div class="h-3.5 rounded-full bg-base-300/70 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :style="{ width: row.widthPct + '%', background: statusColor(row.iucnCode) }"
                  />
                </div>
              </NuxtLink>
            </div>

            <p v-if="noEstimate.length" class="text-xs text-base-content/50 mt-6">
              No reliable global count exists for
              {{ noEstimate.map(s => s.commonName).join(' or ') }}; both are deep-diving or rarely
              seen, and are known mostly from strandings.
            </p>
          </div>
        </section>

        <!-- Depletion and recovery -->
        <section class="card bg-base-200/60 border border-white/10 shadow-xl">
          <div class="card-body">
            <h2 class="text-2xl md:text-3xl font-whale mb-1">How far they fell</h2>
            <p class="text-base-content/70 mb-6">
              For the species with a documented pre-whaling baseline, the bar shows how much of the
              original population is estimated to survive today. Some have barely begun to recover.
            </p>

            <div class="space-y-5">
              <div v-for="row in recoveryRows" :key="row.id">
                <div class="flex items-baseline justify-between gap-3 mb-1">
                  <NuxtLink :to="`/species/${row.id}`" class="font-medium hover:text-primary transition-colors">
                    {{ row.commonName }}
                  </NuxtLink>
                  <span class="text-sm font-semibold" :style="{ color: statusColor(row.iucnCode) }">
                    {{ row.pctRemaining }}% remaining
                  </span>
                </div>
                <div class="relative h-6 rounded-md bg-base-300/70 overflow-hidden">
                  <div
                    class="h-full rounded-md transition-all duration-700"
                    :style="{ width: Math.max(row.pctRemaining, 1.5) + '%', background: statusColor(row.iucnCode) }"
                  />
                </div>
                <div class="flex justify-between text-xs text-base-content/55 mt-1">
                  <span>now ~{{ fmt(row.currentMid) }}</span>
                  <span>pre-whaling ~{{ fmt(row.prewhalingApprox) }}</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-base-content/45 mt-6">
              Vaquita are measured against a 1997 baseline of about 600 animals rather than a true
              pre-whaling figure.
            </p>
          </div>
        </section>

        <!-- Conservation status breakdown -->
        <section class="card bg-base-200/60 border border-white/10 shadow-xl">
          <div class="card-body">
            <h2 class="text-2xl md:text-3xl font-whale mb-1">Where they stand</h2>
            <p class="text-base-content/70 mb-6">
              IUCN Red List status across the {{ populations.length }} species tracked here.
            </p>
            <div class="flex h-8 w-full rounded-full overflow-hidden border border-white/10">
              <div
                v-for="seg in statusBreakdown"
                :key="seg.code"
                class="h-full flex items-center justify-center text-[0.7rem] font-semibold text-black/80"
                :style="{ width: (seg.count / populations.length * 100) + '%', background: statusColor(seg.code) }"
                :title="`${seg.label}: ${seg.count}`"
              >
                {{ seg.count }}
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-5">
              <div v-for="seg in statusBreakdown" :key="seg.code" class="flex items-center gap-2 text-sm">
                <span class="h-3 w-3 rounded-full flex-shrink-0" :style="{ background: statusColor(seg.code) }" />
                <span class="text-base-content/80">{{ seg.label }}</span>
                <span class="text-base-content/50 ml-auto">{{ seg.count }}</span>
              </div>
            </div>
          </div>
        </section>

        <div class="text-center">
          <NuxtLink to="/history" class="btn btn-primary btn-lg">
            See how it happened
            <ArrowRightIcon class="h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import type { IucnCode } from '~/types/species'
import { populations, recoveryPairs, whaleStats } from '~/data/population'
import { iucnMeta as statusMeta, iucnColor as statusColor } from '~/data/iucn'

defineOptions({ name: 'PopulationsPage' })

useSeoMeta({
  title: 'Whales by the Numbers, population data and recovery',
  description: 'Current global population estimates for 22 whale, dolphin, and porpoise species, how far each fell to whaling, and where they stand on the IUCN Red List.',
  ogTitle: 'Whales by the Numbers',
  ogDescription: 'Population estimates, depletion, and recovery for 22 cetacean species.',
  twitterCard: 'summary_large_image',
})

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n)

const withEstimate = populations.filter(p => p.currentHigh > 0)
const noEstimate = populations.filter(p => p.currentHigh === 0)

const currentChart = computed(() => {
  const rows = withEstimate.map(p => ({ ...p, mid: (p.currentLow + p.currentHigh) / 2 }))
  const logs = rows.map(r => Math.log10(r.mid))
  const minLog = Math.min(...logs)
  const maxLog = Math.max(...logs)
  return rows
    .map(r => ({
      ...r,
      widthPct: 6 + ((Math.log10(r.mid) - minLog) / (maxLog - minLog)) * 94,
    }))
    .sort((a, b) => b.mid - a.mid)
})

const recoveryRows = recoveryPairs

const statusBreakdown = computed(() => {
  const order: IucnCode[] = ['CR', 'EN', 'VU', 'NT', 'LC', 'DD']
  return order
    .map(code => ({
      code,
      label: statusMeta[code].label,
      count: populations.filter(p => p.iucnCode === code).length,
    }))
    .filter(s => s.count > 0)
})
</script>

<style scoped>
.pop-hero {
  background: linear-gradient(to bottom, #0a3a5c 0%, #082a45 60%, var(--color-base-100) 100%);
}
</style>
