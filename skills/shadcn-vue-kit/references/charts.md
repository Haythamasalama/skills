# Charts

**Read when:** putting a chart on a screen.
**Owns:** composing a chart with the registry's `chart` component and Unovis, its config, the y
domain, the types that trip the compiler, and what data a chart may show. Chart colours are in
[theme.md](theme.md#chart-colours).

## TL;DR

- `npx shadcn-vue@latest add chart`, plus `@unovis/vue` and `@unovis/ts` (checked 2026-11-03).
- The `chart` component does not wrap Unovis. You compose `Vis*` components inside `ChartContainer`.
- Colours come from the config as `var(--chart-n)`, and series reference them as `var(--color-<key>)`.
- Pin the y domain yourself.
- Plot real data only.

## Composition

```vue
<script setup lang="ts">
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue';
import { computed } from 'vue';
import {
    ChartContainer,
    ChartCrosshair,
    ChartTooltip,
    ChartTooltipContent,
    componentToString,
    type ChartConfig,
} from '@/components/ui/chart';

type Point = { label: string; value: number };
type Row = Point & { index: number };

const props = defineProps<{ points: Point[] }>();

const headroom = (values: number[]): [number, number] => [0, Math.max(1, ...values)];

const config = { value: { label: 'Invoices', color: 'var(--chart-1)' } } satisfies ChartConfig;
const rows = computed<Row[]>(() => props.points.map((p, index) => ({ ...p, index })));
const domain = computed(() => headroom(props.points.map((p) => p.value)));
const label = (tick: number | Date) => rows.value[Number(tick)]?.label ?? '';
const whole = (tick: number | Date) => String(Math.round(Number(tick)));
</script>

<template>
    <ChartContainer :config="config" class="aspect-auto h-64">
        <VisXYContainer :data="rows" :y-domain="domain" :margin="{ top: 8, bottom: 8 }">
            <VisArea :x="(d: Row) => d.index" :y="(d: Row) => d.value" color="var(--color-value)" :opacity="0.15" />
            <VisLine :x="(d: Row) => d.index" :y="(d: Row) => d.value" color="var(--color-value)" />
            <VisAxis type="x" :tick-line="false" :domain-line="false" :grid-line="false" :tick-format="label" />
            <VisAxis type="y" :tick-line="false" :domain-line="false" :tick-format="whole" :num-ticks="4" />
            <ChartTooltip />
            <ChartCrosshair :template="componentToString(config, ChartTooltipContent, { labelFormatter: label })" />
        </VisXYContainer>
    </ChartContainer>
</template>
```

- `config` maps each series key to a `label`, a `color` (or `theme: { light, dark }`) and an
  optional `icon`. `ChartStyle`, inside `ChartContainer`, turns each into a `--color-<key>`
  property scoped to that chart; the `color` props reference it.
- `ChartTooltip` and `ChartCrosshair` are Unovis's `VisTooltip` and `VisCrosshair` re-exported;
  the look comes from `ChartTooltipContent` (`labelKey`, `nameKey`, `indicator`, `hideLabel`,
  `hideIndicator`). `ChartLegendContent` adds a legend.
- Give the container a height (`h-64`) and `aspect-auto`, or it takes the default aspect ratio.

## Pin the y domain

Left to choose, Unovis pads the scale, and a small period renders as a few pixels of ink. Compute
the domain (`headroom` above) and pass `:y-domain`, with `:num-ticks` small enough that labels
don't crowd. `Math.max(1, …)` keeps an all-zero series from collapsing the axis.

## Types

- Unovis types a tick as `number | Date`, so a formatter must accept both, even when the axis
  plots a row index.
- A `&` intersection inside a template expression breaks the Vue template compiler. Declare
  `type Row = Point & { index: number }` in the script and use the alias.

## The data has to be real

A chart needs a real series. Don't invent one and don't ship placeholder numbers: an honest empty
chart (with `Empty` over it) beats a full one that is not. Load the series where every other read
happens (a page prop, a query). When tests run on a different database engine than production,
group by period in application code, because date functions differ between engines.

## Direction

Axes run left to right even inside an Arabic page; that is the normal convention for a time series.
Leave it.
