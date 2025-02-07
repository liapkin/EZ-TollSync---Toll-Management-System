import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TollTableProps = {
  tollLocation: string
  dateRange: { from: Date; to: Date }
  vehicleType: string
  paymentMethod: string
}

export default function TollTable({ tollLocation, dateRange, vehicleType, paymentMethod }: TollTableProps) {
  // In a real application, you would fetch data based on all filters
  const data = [
    { id: 1, date: '2023-06-01', location: 'Toll 1', vehicles: 1234, revenue: 6170, vehicleType: 'Car', paymentMethod: 'Cash' },
    { id: 2, date: '2023-06-01', location: 'Toll 2', vehicles: 987, revenue: 4935, vehicleType: 'Truck', paymentMethod: 'Card' },
    { id: 3, date: '2023-06-02', location: 'Toll 1', vehicles: 1432, revenue: 7160, vehicleType: 'Motorcycle', paymentMethod: 'Transponder' },
    { id: 4, date: '2023-06-02', location: 'Toll 2', vehicles: 1056, revenue: 5280, vehicleType: 'Car', paymentMethod: 'Cash' },
    { id: 5, date: '2023-06-03', location: 'Toll 1', vehicles: 1567, revenue: 7835, vehicleType: 'Truck', paymentMethod: 'Card' },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Vehicles</TableHead>
          <TableHead>Revenue ($)</TableHead>
          <TableHead>Vehicle Type</TableHead>
          <TableHead>Payment Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.location}</TableCell>
            <TableCell>{row.vehicles}</TableCell>
            <TableCell>{row.revenue}</TableCell>
            <TableCell>{row.vehicleType}</TableCell>
            <TableCell>{row.paymentMethod}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

