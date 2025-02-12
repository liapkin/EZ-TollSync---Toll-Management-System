"use client"

import { type HTMLAttributes, type ReactNode } from "react"
import { type TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

export interface ChartConfig {
    [key: string]: {
        label?: string
        color?: string
        theme?: string
    }
}

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
    config?: ChartConfig
    // Add more specific props as needed
}

export function ChartContainer({
                                   config,
                                   children,
                                   className,
                                   ...props
                               }: ChartProps) {
    return (
        <div className={cn("relative", className)} {...props}>
            {config ? <ChartStyle id="chart-style" config={config} /> : null}
            {children}
        </div>
    )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(
        ([_, config]) => config.theme || config.color
    )

    if (!colorConfig.length) return null

    return (
        <style id={id}>
            {colorConfig.map(([key, config]) => {
                const cssVarName = `--${key}`
                return config.color
                    ? `[data-${key}] { ${cssVarName}: ${config.color}; }`
                    : ""
            }).join("\n")}
        </style>
    )
}

interface ChartTooltipContentProps {
    active?: boolean
    payload?: any[]
    label?: string
    hideLabel?: boolean
}

export function ChartTooltipContent({
                                        active,
                                        payload,
                                        label,
                                        hideLabel = false,
                                    }: ChartTooltipContentProps) {
    if (!active || !payload?.length) return null

    return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
            {!hideLabel && <div className="font-medium">{label}</div>}
            <div>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="font-medium">
              {entry.name}: {entry.value}
            </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ChartTooltip(props: TooltipProps<any, any>) {
    return (
        <g>
            <foreignObject
                x={props.coordinate?.x ?? 0}
                y={props.coordinate?.y ?? 0}
                width={200}
                height={200}
                style={{
                    overflow: "visible",
                    transform: `translate(${props.coordinate?.x ?? 0 > 200 ? -100 : 0}%, ${
                        props.coordinate?.y ?? 0 > 200 ? -100 : 20
                    }%)`,
                }}
            >
                {props.children}
            </foreignObject>
        </g>
    )
}