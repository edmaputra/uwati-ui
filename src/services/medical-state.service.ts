import { Injectable, signal } from '@angular/core';
import { 
  CurrentUser, 
  Patient, 
  Bed, 
  TriageQueueItem, 
  HospitalAlert, 
  DepartmentMetric, 
  BedStatus 
} from '../types';
import { 
  INITIAL_STAFF_PROFILES, 
  INITIAL_PATIENTS, 
  INITIAL_BEDS, 
  INITIAL_TRIAGE_QUEUE, 
  INITIAL_HOSPITAL_ALERTS, 
  INITIAL_DEPARTMENT_METRICS,
  INITIAL_PHARMACY_ORDERS
} from '../data/mockData';

export interface ToastNotification {
  message: string;
  type: 'success' | 'info' | 'alert';
}

@Injectable({
  providedIn: 'root',
})
export class MedicalStateService {
  // Authentication State
  readonly currentUser = signal<CurrentUser>(INITIAL_STAFF_PROFILES['physician']);
  readonly isLoggedIn = signal<boolean>(true);

  // Active Navigation Tab
  readonly currentTab = signal<'dashboard' | 'patients' | 'triage' | 'beds' | 'pharmacy' | 'diagnostics' | 'components_guide'>('dashboard');

  // Core Clinical State
  readonly patients = signal<Patient[]>(INITIAL_PATIENTS);
  readonly beds = signal<Bed[]>(INITIAL_BEDS);
  readonly triageQueue = signal<TriageQueueItem[]>(INITIAL_TRIAGE_QUEUE);
  readonly alerts = signal<HospitalAlert[]>(INITIAL_HOSPITAL_ALERTS);
  readonly departments = signal<DepartmentMetric[]>(INITIAL_DEPARTMENT_METRICS);
  readonly pharmacyOrders = signal(INITIAL_PHARMACY_ORDERS);

  // Modals & Selected Patient
  readonly selectedPatient = signal<Patient | null>(null);
  readonly isNewAdmissionOpen = signal<boolean>(false);
  readonly isApiGuideOpen = signal<boolean>(false);

  // Toast Notification
  readonly toast = signal<ToastNotification | null>(null);

  showToast(message: string, type: 'success' | 'info' | 'alert' = 'info') {
    this.toast.set({ message, type });
    setTimeout(() => {
      if (this.toast()?.message === message) {
        this.toast.set(null);
      }
    }, 3800);
  }

  clearToast() {
    this.toast.set(null);
  }

  switchRole(role: CurrentUser['role']) {
    if (INITIAL_STAFF_PROFILES[role]) {
      this.currentUser.set(INITIAL_STAFF_PROFILES[role]);
      this.showToast(`Switched active profile to ${INITIAL_STAFF_PROFILES[role].roleTitle}`, 'info');
    }
  }

  login(user: CurrentUser) {
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    this.showToast(`Welcome, ${user.name} (${user.department})`, 'success');
  }

  logout() {
    this.isLoggedIn.set(false);
  }

  setTab(tab: 'dashboard' | 'patients' | 'triage' | 'beds' | 'pharmacy' | 'diagnostics' | 'components_guide') {
    if (tab === 'components_guide') {
      this.isApiGuideOpen.set(true);
    } else {
      this.currentTab.set(tab);
    }
  }

  openPatientModal(patient: Patient) {
    this.selectedPatient.set(patient);
  }

  closePatientModal() {
    this.selectedPatient.set(null);
  }

  admitPatient(newPatient: Patient) {
    this.patients.update((list) => [newPatient, ...list]);
    // update bed status if allocated
    this.beds.update((bedsList) =>
      bedsList.map((b) =>
        b.code === newPatient.bedNumber
          ? {
              ...b,
              status: 'occupied',
              patientName: newPatient.fullName,
              patientMrn: newPatient.mrn,
              admissionDate: new Date().toISOString().split('T')[0],
            }
          : b
      )
    );
    this.showToast(`Patient ${newPatient.fullName} admitted to ${newPatient.ward} (${newPatient.bedNumber})`, 'success');
  }

  updatePatient(updated: Patient) {
    this.patients.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
    if (this.selectedPatient()?.id === updated.id) {
      this.selectedPatient.set(updated);
    }
    if (updated.status === 'discharged') {
      this.beds.update((bedsList) =>
        bedsList.map((b) =>
          b.code === updated.bedNumber
            ? { ...b, status: 'cleaning', patientName: undefined, patientMrn: undefined }
            : b
        )
      );
    }
  }

  updateBedStatus(bedId: string, newStatus: BedStatus) {
    this.beds.update((bedsList) =>
      bedsList.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b))
    );
  }

  addTriagePatient(item: TriageQueueItem) {
    this.triageQueue.update((queue) => [item, ...queue]);
    this.showToast(`Patient ${item.patientName} registered in Emergency Triage as ESI-${item.triageLevel}`, 'success');
  }

  updateTriageStatus(id: string, newStatus: TriageQueueItem['status']) {
    this.triageQueue.update((queue) =>
      queue.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }

  acknowledgeAlert(alertId: string) {
    this.alerts.update((alertsList) =>
      alertsList.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    this.showToast('Hospital Code Alert acknowledged', 'info');
  }

  dispenseOrder(orderId: string, medName: string) {
    this.pharmacyOrders.update((orders) =>
      orders.map((o) => (o.id === orderId ? { ...o, status: 'dispensed' } : o))
    );
    this.showToast(`Order ${medName} dispensed & verified by Clinical Pharmacist`, 'success');
  }
}
