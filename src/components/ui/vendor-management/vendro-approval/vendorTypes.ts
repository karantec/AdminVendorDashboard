export interface VendorApplication {
    _id: string;
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    businessType: 'grocery' | 'convenience' | 'specialty';
    documentUrl: string;
    appliedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
  }
  
  export type VendorApprovalAction = 'approve' | 'reject';