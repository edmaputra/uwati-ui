export type UserRole = 'physician' | 'nurse' | 'admin' | 'pharmacist' | 'triage_officer';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  licenseNumber: string;
  avatarUrl?: string;
  shift: string;
}

export type TriageLevel = 1 | 2 | 3 | 4 | 5; // ESI: 1=Resuscitation, 2=Emergent, 3=Urgent, 4=Less Urgent, 5=Non-Urgent

export type PatientStatus = 'admitted' | 'observation' | 'critical' | 'discharged' | 'er_triage';

export type BedStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';

export type WardType = 'ICU' | 'Emergency (ED)' | 'Ward-A (Internal Med)' | 'Ward-B (Cardiology)' | 'Pediatrics' | 'Surgical Recovery' | 'Maternity';

export interface VitalSigns {
  timestamp: string;
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  respiratoryRate: number; // /min
  oxygenSaturation: number; // %
  temperature: number; // °C
  painScore: number; // 0-10
  recordedBy: string;
}

export interface Prescription {
  id: string;
  name?: string;
  medicationName?: string;
  dosage: string;
  route: 'Oral' | 'IV' | 'IM' | 'Subcutaneous' | 'Inhalation' | 'Topical';
  frequency: string;
  duration?: string;
  startDate?: string;
  prescribedBy: string;
  prescribedAt?: string;
  status: 'active' | 'dispensed' | 'completed' | 'discontinued';
  notes?: string;
}

export type VitalRecord = VitalSigns;

export type TriageZone = 'Resuscitation Bay' | 'Acute Care' | 'Sub-Acute' | 'Fast Track' | 'Waiting Room';

export interface LabResult {
  id: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Pathology';
  orderedDate: string;
  completedDate?: string;
  orderedBy: string;
  status: 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'critical_high';
  resultSummary?: string;
  normalRange?: string;
  flag?: 'NORMAL' | 'HIGH' | 'CRITICAL_HIGH' | 'LOW';
}

export interface ClinicalNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  noteType: 'SOAP Note' | 'Progress Note' | 'Nursing Assessment' | 'Physician Consultation' | 'Discharge Summary';
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    generalText?: string;
  };
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number (e.g., MRN-89241)
  nationalId: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone?: string;
  email?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    coverageStatus: 'Verified' | 'Pending Verification' | 'Self-Pay' | 'Government Health';
  };
  admissionDate: string;
  dischargedDate?: string;
  department: string;
  ward: WardType;
  roomNumber?: string;
  bedNumber: string;
  attendingPhysician: string;
  primaryDiagnosis: string;
  secondaryDiagnoses?: string[];
  allergies: string[];
  status: PatientStatus;
  triageLevel: TriageLevel;
  latestVitals: VitalSigns;
  vitalsHistory: VitalSigns[];
  prescriptions: Prescription[];
  labResults: LabResult[];
  clinicalNotes: ClinicalNote[];
  totalBilled?: number;
}

export interface Bed {
  id: string;
  code: string; // e.g. "ICU-01", "W-A-102"
  ward: WardType;
  room: string;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  patientMrn?: string;
  admissionDate?: string;
  attendingDoctor?: string;
  equipment: string[];
}

export interface TriageQueueItem {
  id: string;
  patientName: string;
  mrn?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  arrivalTime: string;
  arrivalMode?: string;
  waitingMinutes: number;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  painScore?: number;
  vitalsSummary: string;
  assignedZone: TriageZone;
  triageNurse?: string;
  status: 'waiting_doctor' | 'in_assessment' | 'with_doctor' | 'disposition_pending' | 'admitted_or_discharged' | 'transferred_to_ward' | 'discharged';
}

export interface HospitalAlert {
  id: string;
  timestamp: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  description: string;
  acknowledged: boolean;
  codeColor: 'red' | 'blue' | 'yellow' | 'green';
}

export interface DepartmentMetric {
  department: string;
  totalPatients: number;
  doctorsOnDuty: number;
  nursesOnDuty: number;
  occupancyPercent: number;
  avgWaitTimeMinutes: number;
  status: 'normal' | 'busy' | 'critical';
}
