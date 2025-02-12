"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Label, Tooltip } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// The shape of each row in your table data:
interface DebtRow {
    visitingOpID: string
    nPasses: number
    passesCost: number
    // Add other fields if needed
}

interface ChartPieDebtReportProps {
    data: DebtRow[]
    chartTitle?: string
    chartDescription?: string
    sumField?: "nPasses" | "passesCost"  // which field to sum and display in the center
}

export function ChartPieDebtReport({
                                       data,
                                       chartTitle = "Pie Chart - Donut with Text",
                                       chartDescription = "January - June 2024",
                                       sumField = "passesCost",
                                   }: ChartPieDebtReportProps) {
    // Transform the data for Recharts.
    // For example, we use the visitingOpID as the slice label, and the passesCost as the value for each slice.
    const chartData = React.useMemo(() => {
        return data.map((row) => ({
            name: row.visitingOpID,
            value: row[sumField],
        }))
    }, [data, sumField])

    // Compute the total sum of the chosen field (nPasses or passesCost).
    const totalSum = React.useMemo(() => {
        return data.reduce((acc, row) => acc + row[sumField], 0)
    }, [data, sumField])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{chartTitle}</CardTitle>
                <CardDescription>{chartDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {/* The width/height can be adjusted as needed */}
                <div className="mx-auto aspect-square max-h-[250px]">
                    <PieChart width={250} height={250}>
                        <Tooltip />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalSum.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {sumField === "nPasses" ? "Passes" : "Cost"}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                    return null
                                }}
                            />
                        </Pie>
                    </PieChart>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total {sumField === "nPasses" ? "passes" : "cost"} for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
