import { AxisOptions, Chart } from 'react-charts'
import { stackOffsetWiggle } from 'd3-shape'
import { useMemo } from 'react'
import { HexColor } from './fit/Fit'
import { UserSerie } from 'react-charts/types/types'

export type ChartDatum = {
    date: Date
    value: number
}

type Props = {
    data: UserSerie<ChartDatum>[]
    colors: HexColor[]
}

export function ExampleChart({data, colors}: Props) {
    const primaryAxis = useMemo<AxisOptions<ChartDatum>>(
        () => ({
            getValue: (datum) => datum.date as Date,
        }),
        []
    )

    const secondaryAxes = useMemo<AxisOptions<ChartDatum>[]>(
        () => [
            {
                getValue: (datum) => datum.value,
                elementType: 'area',
                stackOffset: stackOffsetWiggle,
            },
        ],
        []
    )

    return (
        <Chart
            options={{
                data,
                primaryAxis,
                secondaryAxes,
                getSeriesStyle: (series) => ({
                    line: { stroke: 'none' },
                    area: { opacity: 1, fill: colors[series.index], stroke: 'none' },
                    fill: colors[series.index],
                }),
            }}
        />
    )
}

export function makeExampleChartData(series: number): UserSerie<ChartDatum>[] {
    return makeDataFrom(Math.max(series, 1), 10)
}

function makeDataFrom(series: number, datums: number): UserSerie<ChartDatum>[] {
    return [...new Array(series)].map((d, i) => makeSeries(i, datums))
}

function makeSeries(i: number, datums: number): UserSerie<ChartDatum> {
    const startDate = new Date()
    startDate.setUTCHours(0)
    startDate.setUTCMinutes(0)
    startDate.setUTCSeconds(0)
    startDate.setUTCMilliseconds(0)
    const length = datums
    const min = 10
    const max = 100
    return {
        label: `Series ${i + 1}`,
        data: [...new Array(length)].map((_, i) => {
            const date = new Date(startDate.getTime() + 60 * 1000 * 60 * 24 * i)
            const value = min + Math.round(Math.random() * (max - min))
            return {
                date,
                value,
            };
        }),
    }
}
