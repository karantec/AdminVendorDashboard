export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    storeId: string;
    storeName: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }
  
  export type ProductCategory = 
    | 'Fruits & Vegetables'
    | 'Dairy & Eggs'
    | 'Meat & Seafood'
    | 'Bakery'
    | 'Frozen Foods'
    | 'Snacks'
    | 'Beverages'
    | 'Household'
    | 'Other';
  
  export interface ProductFilters {
    searchQuery: string;
    category: ProductCategory | 'All';
    minPrice: number | null;
    maxPrice: number | null;
    inStock: boolean | null;
    sortBy: 'name' | 'price' | 'stock' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  }