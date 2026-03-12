import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertsControllerService } from '../../services/services/alerts-controller.service';
import { AlertsResponse } from '../../services/models/alerts-response';

@Component({
  selector: 'app-stock-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-alerts.html',
  styleUrl: './stock-alerts.css'
})
export class StockAlerts implements OnInit {

  alertForm = {
    ticker: '',
    alertType: 'DIP' as 'DIP' | 'RISE',
    threshold: null as number | null,
    notificationChannel: 'EMAIL' as 'EMAIL' | 'WHATSAPP' | 'BOTH'
  };

  alerts: AlertsResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private alertsService: AlertsControllerService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.alertsService.getUserAlerts().subscribe({
      next: (res: any) => {
        if (res instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const data = JSON.parse(reader.result as string);
            this.zone.run(() => {
              this.alerts = data;
              this.cdr.detectChanges();
            });
          };
          reader.readAsText(res);
        } else {
          this.zone.run(() => {
            this.alerts = res;
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error('Failed to load alerts', err);
      }
    });
  }

  selectChannel(channel: 'EMAIL' | 'WHATSAPP' | 'BOTH') {
    this.alertForm.notificationChannel = channel;
  }

  selectAlertType(type: 'DIP' | 'RISE') {
    this.alertForm.alertType = type;
  }

  createAlert() {
    if (!this.alertForm.ticker || !this.alertForm.threshold) return;

    this.loading = true;
    this.errorMessage = '';

    this.alertsService.createAlert({
      body: {
        ticker: this.alertForm.ticker,
        alertType: this.alertForm.alertType,
        threshold: this.alertForm.threshold,
        notificationChannel: this.alertForm.notificationChannel
      }
    }).subscribe({
      next: (res: any) => {
        if (res instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const alert = JSON.parse(reader.result as string);
            this.zone.run(() => {
              this.alerts.push(alert);
              this.resetForm();
              this.loading = false;
              this.cdr.detectChanges();
            });
          };
          reader.readAsText(res);
        } else {
          this.zone.run(() => {
            this.alerts.push(res);
            this.resetForm();
            this.loading = false;
            this.cdr.detectChanges();
          });
        }
      },
      error: (err) => {
        console.error('Failed to create alert', err);
        this.errorMessage = 'Failed to create alert. Please try again.';
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.alertForm = {
      ticker: '',
      alertType: 'DIP',
      threshold: null,
      notificationChannel: 'EMAIL'
    };
  }

  toggleAlert(alert: AlertsResponse) {
    this.alertsService.toggleAlert({ id: alert.id as number }).subscribe({
      next: (res: any) => {
        if (res instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const updated = JSON.parse(reader.result as string);
            this.zone.run(() => {
              const index = this.alerts.findIndex(a => a.id === alert.id);
              if (index !== -1) this.alerts[index] = updated;
              this.cdr.detectChanges();
            });
          };
          reader.readAsText(res);
        } else {
          const index = this.alerts.findIndex(a => a.id === alert.id);
          if (index !== -1) this.alerts[index] = res;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to toggle alert', err)
    });
  }

  deleteAlert(alert: AlertsResponse) {
    this.alertsService.deleteAlert({ id: alert.id as number }).subscribe({
      next: () => {
        this.zone.run(() => {
          this.alerts = this.alerts.filter(a => a.id !== alert.id);
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Failed to delete alert', err)
    });
  }
}