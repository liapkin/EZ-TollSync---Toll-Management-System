import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import api from "@/app/api/axios";

export interface TollStation {
    tollid: string;
    name: string;
    lat: number;
    long: number;
    pass_count: number;
    total_charges: number;
}

export function useTollStations(dateRange: DateRange, operatorId: string = "admin") {
    const [tollStations, setTollStations] = useState<TollStation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTollStations() {
            if (!dateRange?.from || !dateRange?.to) {
                console.log("Date range not complete", dateRange);
                return;
            }

            if (!operatorId) {
                console.error("operatorId is empty");
                setError("Invalid operator ID");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const fromDateFormatted = format(dateRange.from, "yyyy-MM-dd HH:mm");
                const toDateFormatted = format(dateRange.to, "yyyy-MM-dd HH:mm");

                const effectiveOperatorId = operatorId || 'admin';
                const url = `tollstations/activity/${effectiveOperatorId}/${encodeURIComponent(fromDateFormatted)}/${encodeURIComponent(toDateFormatted)}/`;

                console.log("Fetching data with URL:", url);
                console.log("Current operatorId:", effectiveOperatorId);

                const response = await api.get(url);
                console.log("Response data:", response.data); // Log the response data

                // Validate the data structure
                if (!Array.isArray(response.data)) {
                    throw new Error('Invalid data format received from server');
                }

                // Map and validate each station
                const validatedStations = response.data.map((station: any) => ({
                    tollid: station.tollid || '',
                    name: station.name || '',
                    lat: Number(station.lat) || 0,
                    long: Number(station.long) || 0,
                    pass_count: Number(station.pass_count) || 0,
                    total_charges: Number(station.total_charges) || 0
                }));

                setTollStations(validatedStations);
            } catch (err: any) {
                console.error("Error fetching toll station data:", err);
                console.error("Full error object:", err);
                setError(err.response?.data?.error || err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        }

        fetchTollStations();
    }, [dateRange, operatorId]);

    return { tollStations, loading, error };
}