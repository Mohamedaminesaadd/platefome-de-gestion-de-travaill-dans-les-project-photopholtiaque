import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-timeline',
  imports: [],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class Timeline implements AfterViewInit, OnDestroy {
  @ViewChild('timelineCanvas') timelineCanvasRef!: ElementRef<HTMLCanvasElement>;

  private timelineChart!: Chart;
  activePeriod: 'week' | 'month' | 'quarter' = 'week';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildTimelineChart();
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.timelineChart?.destroy();
  }

  switchPeriod(period: 'week' | 'month' | 'quarter'): void {
    this.activePeriod = period;
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.timelineChart) return;

    const data = this.getChartData();
    this.timelineChart.data.datasets = data.datasets;
    this.timelineChart.data.labels = data.labels;
    this.timelineChart.update();
  }

  private getChartData(): { labels: string[]; datasets: any[] } {
    const dataMap = {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        target: [65, 25, 75, 80, 85, 90, 95],
        estimated: [60, 65, 70, 30, 80, 85, 90]
      },
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        target: [40, 55, 70, 85],
        estimated: [35, 50, 65, 80]
      },
      quarter: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        target: [30, 45, 60, 75, 85, 95],
        estimated: [25, 40, 55, 70, 80, 90]
      }
    };

    const periodData = dataMap[this.activePeriod];
    
    return {
      labels: periodData.labels,
      datasets: [
        {
          label: 'Target Completed',
          data: periodData.target,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Estimated Completion',
          data: periodData.estimated,
          borderColor: '#CBD5E1',
          backgroundColor: 'rgba(203, 213, 225, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#94A3B8',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  private buildTimelineChart(): void {
    if (!this.timelineCanvasRef) return;
    const ctx = this.timelineCanvasRef.nativeElement.getContext('2d')!;

    const data = this.getChartData();

    this.timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: {
              family: 'DM Sans',
              size: 12,
              weight: 600
            },
            bodyFont: {
              family: 'DM Sans',
              size: 11
            },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                family: 'DM Sans',
                size: 11
              },
              color: '#94A3B8'
            }
          },
          y: {
            min: 0,
            max: 100,
            grid: {
              color: '#F1F5F9'
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                family: 'DM Sans',
                size: 11
              },
              color: '#94A3B8',
              stepSize: 20,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            hoverRadius: 6,
            hoverBorderWidth: 2
          }
        }
      }
    });
  }
}