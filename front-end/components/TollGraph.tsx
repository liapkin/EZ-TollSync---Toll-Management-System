'use client'

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'

type TollGraphProps = {
  tollLocation: string
  dateRange: { from: Date; to: Date }
  vehicleType: string
  paymentMethod: string
}

export default function TollGraph({ tollLocation, dateRange, vehicleType, paymentMethod }: TollGraphProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        // In a real application, you would fetch data based on all filters
        const data = {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
            label: 'Toll 1',
            data: [12, 19, 3, 5, 2, 3, 7],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }, {
            label: 'Toll 2',
            data: [5, 10, 15, 8, 12, 9, 4],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }]
        }

        const config: ChartConfiguration = {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Toll Usage Over Time'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Vehicles'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Days of the Week'
                }
              }
            }
          }
        }

        new Chart(ctx, config)
      }
    }
  }, [tollLocation, dateRange, vehicleType, paymentMethod])

  return <canvas ref={chartRef} />
}

