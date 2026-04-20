// timeline.ts
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { PredictionService, PredictionRequest, PredictionResponse } from '../../services/prediction';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
  providers: [PredictionService]
})


export class Timeline implements AfterViewInit, OnDestroy {
  @ViewChild('timelineCanvas') timelineCanvasRef!: ElementRef<HTMLCanvasElement>;

  private timelineChart!: Chart;
  activePeriod: 'week' | 'month' | 'quarter' = 'week';
  chartType: 'line' | 'bar' = 'line';
  
  // États de chargement
  isLoading = false;
  predictionResult: PredictionResponse | null = null;
  errorMessage: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private predictionService: PredictionService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildTimelineChart();
      this.loadPredictions();
      this.cdr.markForCheck();
    }, 0);
  }

  ngOnDestroy(): void {
    this.timelineChart?.destroy();
  }

  /*builde toggle chart button*/
  toggleChart(): void {
  this.chartType = this.chartType === 'line' ? 'bar' : 'line';
  if (this.timelineChart) {
    this.timelineChart.destroy();
  }
  this.buildTimelineChart();
}

  /**
   * Charge les prédictions depuis le backend
   */
  loadPredictions(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Exemple de données pour la prédiction
    const predictionRequest: PredictionRequest = {
      heure_estimee: 17,
      complexite: 3,
      priorite: 4,
      phase: 2,
      experience_technicien: 1.2,
      meteo: 1,
      saison: 3
    };

    this.predictionService.predict(predictionRequest).subscribe({
      next: (response: { valeurPredite: any; unite: any; }) => {
        this.predictionResult = response;
        console.log(`✅ Prédiction reçue: ${response.valeurPredite} ${response.unite}`);
        this.updateChartWithPredictions(response);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Erreur de prédiction:', error);
        this.errorMessage = 'Impossible de charger les prédictions';
        this.isLoading = false;
      }
    });
  }

  /**
   * Met à jour le graphique avec les données de prédiction
   */
  private updateChartWithPredictions(prediction: PredictionResponse): void {
    if (!this.timelineChart) return;
    
    // Ajuste les données en fonction de la prédiction
    const adjustedData = this.getChartDataWithPrediction(prediction);
    this.timelineChart.data.datasets = adjustedData.datasets;
    this.timelineChart.data.labels = adjustedData.labels;
    this.timelineChart.update();
  }

  /**
   * Génère les données du graphique en intégrant la prédiction
   */
  private getChartDataWithPrediction(prediction: PredictionResponse): { labels: string[]; datasets: any[] } {
    const predictionValue = prediction.valeurPredite;
    const unit = prediction.unite;
    
    const dataMap = {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        target: [65, 25, 35, 42, 85, 72, Math.min(predictionValue * 5, 100)],
        estimated: [60, 65, 70, 30, 80, 85, 20]
      },
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        target: [40, 5, 70, Math.min(predictionValue * 2, 100)],
        estimated: [15, 50, 5, 80]
      },
      quarter: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        target: [30, 45, 60, 75, 85, Math.min(predictionValue, 100)],
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

  switchPeriod(period: 'week' | 'month' | 'quarter'): void {
    this.activePeriod = period;
    if (this.predictionResult) {
      this.updateChartWithPredictions(this.predictionResult);
    } else {
      this.updateChartData();
    }
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
        target: [65, 25, 35, 42, 85, 72, 95],
        estimated: [60, 65, 70, 30, 80, 85, 20]
      },
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        target: [40, 5, 70, 8],
        estimated: [15, 50, 5, 80]
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
      type: this.chartType,
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

  /**
   * Rafraîchir les prédictions manuellement
   */
  refreshPredictions(): void {
    this.loadPredictions();
  }
}