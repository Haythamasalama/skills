# Charts

Charts are shadcn-vue's `chart` wrapper over **Unovis**. The wrapper is not an abstraction: you
compose `Vis*` components yourself and reach for `ChartContainer` and `ChartTooltipContent` where
they help.

```vue
<ChartContainer :config="config" class="aspect-auto h-64">
    <VisXYContainer :data="points" :y-domain="domain" :margin="{ top: 8, bottom: 8 }">
        <VisArea :x="(d: Row) => d.index" :y="(d: Row) => d.value" color="var(--color-value)" />
        <VisLine :x="(d: Row) => d.index" :y="(d: Row) => d.value" color="var(--color-value)" />
        <VisAxis type="x" :tick-line="false" :domain-line="false" :grid-line="false" :tick-format="label" />
        <VisAxis type="y" :tick-line="false" :domain-line="false" :tick-format="whole" :num-ticks="4" />
        <ChartTooltip />
        <ChartCrosshair :template="componentToString(config, ChartTooltipContent, { labelFormatter: label })" />
    </VisXYContainer>
</ChartContainer>
```

`config` maps a series key to a label and a colour. `ChartStyle` turns each into a `--color-<key>`
custom property scoped to that chart, which is what the `color` props reference.

## Colour: the chart ramp

`--chart-1 … --chart-5` are five steps of the theme's accent hue, defined in `:root` and again in
`.dark`, so a series reads on both. One series takes `var(--chart-1)`; several take consecutive
steps.

Don't use `--primary` for a series in a panel where primary is the main action's colour: a bar the
same black as the Save button reads as furniture. (Where primary is itself the accent hue, it is a
fine single-series colour.)

## Pin the y domain

Left to choose, Unovis pads the scale and renders a small month as a few pixels of ink. Compute it:

```ts
const headroom = (values: number[]): [number, number] => [0, Math.max(1, ...values)];
```

Pass `:y-domain`, with `:num-ticks` small enough that labels don't crowd.

## Types

- Unovis types a tick as `number | Date`, so a formatter must accept both, even when the axis
  plots a row index.
- A `&` intersection inside a template expression breaks the Vue template compiler. Declare
  `type Row = Point & { index: number }` in the script and use the alias.

## The data has to be real

A chart needs a real series. Don't invent one and don't ship placeholder numbers: an honest empty
chart beats a full one that is not. The query belongs on the server like every other read. Do date
grouping (by month, by week) in application code when the test database and production differ
(SQLite in tests, MySQL in production), because their date functions differ.

## Direction

Axes run left to right even inside an Arabic page; that is the normal convention. Leave it.
