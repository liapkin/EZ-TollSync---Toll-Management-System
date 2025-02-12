"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/DateRangePicker";
import type { DateRange } from "react-day-picker";
import api from "@/app/api/axios";

interface TollStation {
    tollid: string;
    name: string;
    pass_count: number;
    total_charges: number;
}

export default function HeatmapGrid() {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date("2022-01-01T00:00"),
        to: new Date("2022-01-31T23:59"),
    });
    const [stations, setStations] = useState<TollStation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!dateRange?.from || !dateRange?.to) return;

        setLoading(true);
        setError(null);

        try {
            const fromDate = dateRange.from.toISOString().split('T')[0] + " 00:00";
            const toDate = dateRange.to.toISOString().split('T')[0] + " 23:59";

            const response = await api.get(
                `/tollstations/activity/admin/${encodeURIComponent(fromDate)}/${encodeURIComponent(toDate)}/`
            );

            const sortedStations = response.data.sort((a: TollStation, b: TollStation) =>
                b.pass_count - a.pass_count
            );
            setStations(sortedStations);
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError(err.response?.data?.error || "Failed to fetch data");
            setStations([]); // Clear stations on error
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await fetchData();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchData]);

    // Rest of your component remains the same...
    const getHeatmapColor = (value: number, max: number) => {
        if (value === 0) return 'bg-gray-100 hover:bg-gray-200';
        const intensity = (value / max) * 100;
        if (intensity < 25) return 'bg-green-100 hover:bg-green-200';
        if (intensity < 50) return 'bg-yellow-100 hover:bg-yellow-200';
        if (intensity < 75) return 'bg-orange-100 hover:bg-orange-200';
        return 'bg-red-100 hover:bg-red-200';
    };

    const maxPasses = Math.max(...stations.map(s => s.pass_count));

    return (
        <Card className="w-full">
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <DateRangePicker
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                        />
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-gray-100 border border-gray-200 mr-2"></div>
                                <span className="text-sm">No traffic</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-100 border border-gray-200 mr-2"></div>
                                <span className="text-sm">Low</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-100 border border-gray-200 mr-2"></div>
                                <span className="text-sm">Medium</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-orange-100 border border-gray-200 mr-2"></div>
                                <span className="text-sm">High</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-100 border border-gray-200 mr-2"></div>
                                <span className="text-sm">Very High</span>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                            <div className="text-center py-4">Loading...</div>
                        </div>
                    )}
                    {error && <div className="text-red-500 text-center py-4">{error}</div>}

                    {!loading && !error && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {stations.map((station) => (
                                <div
                                    key={`${station.tollid}-${station.pass_count}`}
                                    className={`p-4 rounded-lg border ${getHeatmapColor(station.pass_count, maxPasses)} 
                                        transition-colors duration-200 cursor-pointer`}
                                >
                                    <div className="text-sm font-medium mb-1">{station.tollid}</div>
                                    <div className="text-xs text-gray-600 mb-2">{station.name}</div>
                                    <div className="text-sm font-bold">{station.pass_count} passes</div>
                                    <div className="text-xs text-gray-600">€{station.total_charges.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}