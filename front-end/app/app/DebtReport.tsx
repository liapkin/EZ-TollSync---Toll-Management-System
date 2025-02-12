"use client"

import { useEffect, useState, useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Label, Tooltip } from "recharts"
import api from "@/app/api/axios"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChartTooltipContent } from "@/components/ui/chart"

interface VisitingOperator {
    visitingOpID: string
    nPasses: number
    passesCost: number
}

interface DebtReportData {
    tollOpID: string
    requestTimestamp: string
    periodFrom: string
    periodTo: string
    vOpList: VisitingOperator[]
}

interface TollOperator {
    code: string
    name: string
}

const generateChartColors = (count: number) => {
    const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
    ]
    return Array(count).fill(0).map((_, i) => colors[i % colors.length])
}

export default function DebtReportWithChart() {
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [userCode, setUserCode] = useState<string>("")
    const [userName, setUserName] = useState<string>("")
    const [selectedOperator, setSelectedOperator] = useState<string>("")
    const [dateFrom, setDateFrom] = useState("2022-01-01T00:00")
    const [dateTo, setDateTo] = useState("2022-01-31T23:59")
    const [operators, setOperators] = useState<TollOperator[]>([])
    const [report, setReport] = useState<DebtReportData | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser)
                    setUserName(user.name || "User")
                    setIsAdmin(user.role === "admin")
                    setUserCode(user.role === "admin" ? "" : user.code || "")
                } catch (e) {
                    console.error("Error parsing user from localStorage:", e)
                }
            }
        }
    }, [])

    useEffect(() => {
        if (!isAdmin) {
            setSelectedOperator(userCode)
        }
    }, [isAdmin, userCode])

    useEffect(() => {
        if (isAdmin) {
            api
                .get("tolloperators/")
                .then((response) => {
                    setOperators(response.data)
                    if (response.data.length > 0 && !selectedOperator) {
                        setSelectedOperator(response.data[0].code)
                    }
                })
                .catch((err) => setError("Failed to load operator list"))
        }
    }, [isAdmin, selectedOperator])

    const chartData = useMemo(() => {
        if (!report) return []
        return report.vOpList
            .filter((op) => op.visitingOpID && op.visitingOpID !== "NULL")
            .map((op, index) => ({
                name: op.visitingOpID,
                value: op.nPasses,
                cost: op.passesCost,
                fill: generateChartColors(report.vOpList.length)[index],
            }))
    }, [report])

    const totalPasses = useMemo(() => {
        if (!report) return 0
        return report.vOpList.reduce((acc, curr) => acc + curr.nPasses, 0)
    }, [report])

    const totalCost = useMemo(() => {
        if (!report) return 0
        return report.vOpList.reduce((acc, curr) => acc + curr.passesCost, 0)
    }, [report])

    const handleGenerate = () => {
        if (!selectedOperator) {
            setError("Please select an operator")
            return
        }
        setLoading(true)
        setError("")
        const formattedFrom = dateFrom.replace("T", " ")
        const formattedTo = dateTo.replace("T", " ")
        const endpoint = `chargesBy/${selectedOperator}/${encodeURIComponent(
            formattedFrom
        )}/${encodeURIComponent(formattedTo)}/`

        api
            .get(endpoint)
            .then((response) => setReport(response.data))
            .catch(
                (err) =>
                    setError(err.response?.data?.error || "Failed to generate report")
            )
            .finally(() => setLoading(false))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Debt Report Generator
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {isAdmin ? (
                            <div>
                                <label className="block font-medium mb-2">Operator</label>
                                <select
                                    value={selectedOperator}
                                    onChange={(e) => setSelectedOperator(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    {operators.map((op) => (
                                        <option key={op.code} value={op.code}>
                                            {op.name} ({op.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block font-medium mb-2">Your Operator</label>
                                <div className="p-2 border rounded-md bg-gray-100">
                                    {userCode}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block font-medium mb-2">From</label>
                            <input
                                type="date"
                                value={dateFrom.split('T')[0]}
                                onChange={(e) => setDateFrom(`${e.target.value}T00:00`)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2">To</label>
                            <input
                                type="date"
                                value={dateTo.split('T')[0]}
                                onChange={(e) => setDateTo(`${e.target.value}T23:59`)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={loading} className="w-full">
                            {loading ? "Generating..." : "Generate Report"}
                        </Button>
                    </div>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                </CardContent>
            </Card>

            {report && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribution of Passes</CardTitle>
                                <CardDescription>
                                    {report.periodFrom} to {report.periodTo}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div style={{ width: "100%", height: 300, margin: "0 auto" }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={60}
                                                outerRadius={95}
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
                                                                        {totalPasses}
                                                                    </tspan>
                                                                    <tspan
                                                                        x={viewBox.cx}
                                                                        y={(viewBox.cy || 0) + 24}
                                                                        className="fill-muted-foreground"
                                                                    >
                                                                        Total Passes
                                                                    </tspan>
                                                                </text>
                                                            )
                                                        }
                                                    }}
                                                />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm">
                                <div className="leading-none text-muted-foreground">
                                    Total Cost: €{totalCost.toFixed(2)}
                                </div>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Report</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <p>
                                        <strong>Toll Operator ID:</strong> {report.tollOpID}
                                    </p>
                                    <p>
                                        <strong>Report Generated:</strong>{" "}
                                        {new Date(report.requestTimestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Visiting Operator ID</TableHead>
                                                <TableHead>Number of Passes</TableHead>
                                                <TableHead>Total Cost</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {report.vOpList
                                                .filter(
                                                    (op) => op.visitingOpID && op.visitingOpID !== "NULL"
                                                )
                                                .map((op) => (
                                                    <TableRow key={op.visitingOpID}>
                                                        <TableCell>{op.visitingOpID}</TableCell>
                                                        <TableCell>{op.nPasses}</TableCell>
                                                        <TableCell>
                                                            €{op.passesCost.toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full mt-4"
                        onClick={() => {
                            console.log("Processing payment...")
                        }}
                    >
                        PAYMENT
                    </Button>
                </>
            )}
        </div>
    )
}