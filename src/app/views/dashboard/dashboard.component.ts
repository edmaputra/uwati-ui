import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../core/services/auth.service';
import { FacilityService } from '../../core/services/facility.service';
import { Facility } from '../../core/models/facility.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    IconDirective,
    RowComponent,
    TableDirective
  ]
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private facilityService = inject(FacilityService);

  facilities = signal<Facility[]>([]);
  isLoadingFacilities = signal(false);

  readonly totalFacilities = signal(0);
  readonly activeFacilities = signal(0);
  readonly hospitalCount = signal(0);
  readonly clinicCount = signal(0);

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.isLoadingFacilities.set(true);
    this.facilityService.listFacilities().subscribe({
      next: (list) => {
        this.facilities.set(list);
        this.totalFacilities.set(list.length);
        this.activeFacilities.set(list.filter((f) => f.status === 'ACTIVE').length);
        this.hospitalCount.set(list.filter((f) => f.type === 'HOSPITAL').length);
        this.clinicCount.set(list.filter((f) => f.type === 'CLINIC').length);
        this.isLoadingFacilities.set(false);
      },
      error: () => {
        this.isLoadingFacilities.set(false);
      }
    });
  }
}
