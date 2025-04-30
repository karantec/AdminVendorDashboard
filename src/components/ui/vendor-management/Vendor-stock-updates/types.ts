export interface StockUpdateItem {
    id: string;
    productId: string;
    productName: string;
    currentStock: number;
    updatedStock: number;
    price: number;
    updatedPrice?: number;
    category: string;
    reason: string;
  }
  
  export interface VendorStockUpdate {
    id: string;
    vendorId: string;
    vendorName: string;
    vendorEmail: string;
    storeName: string;
    submittedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
    items: StockUpdateItem[];
    notes?: string;
  }
  
  export type StockUpdateStatus = VendorStockUpdate['status'];