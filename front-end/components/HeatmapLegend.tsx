import { cn } from "@/lib/utils"

interface HeatmapLegendProps {
    className?: string
}

export function HeatmapLegend({ className }: HeatmapLegendProps) {
    return (
        <div className={cn("bg-white p-2 rounded shadow", className)}>
            <h3 className="text-sm font-semibold mb-2">Passes</h3>
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200"></div>
                <span className="text-xs">0-4 passes</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-200"></div>
                <span className="text-xs">5-9 passes</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-100 border border-orange-200"></div>
                <span className="text-xs">10-14 passes</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-100 border border-red-200"></div>
                <span className="text-xs">15+ passes</span>
            </div>
        </div>
    )
}