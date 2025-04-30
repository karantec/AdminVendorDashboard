import React from 'react';
import { VendorApplication, VendorApprovalAction } from './vendorTypes';

interface VendorApprovalCardProps {
  vendor: VendorApplication;
  onAction: (id: string, action: VendorApprovalAction) => void;
  isLoading: boolean;
}

const VendorApprovalCard: React.FC<VendorApprovalCardProps> = ({ 
  vendor, 
  onAction,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-800">{vendor.businessName}</h3>
          <p className="text-gray-600">{vendor.businessType}</p>
          <div className="mt-2">
            <p className="text-gray-700"><span className="font-medium">Owner:</span> {vendor.ownerName}</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {vendor.email}</p>
            <p className="text-gray-700"><span className="font-medium">Phone:</span> {vendor.phone}</p>
          </div>
          <div className="mt-2">
            <p className="text-gray-700">{vendor.address}</p>
            <p className="text-gray-700">{vendor.city}, {vendor.state} {vendor.zipCode}</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onAction(vendor._id, 'approve')}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => onAction(vendor._id, 'reject')}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a 
          href={vendor.documentUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Business Documents
        </a>
        <p className="text-sm text-gray-500 mt-2">
          Applied on: {new Date(vendor.appliedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default VendorApprovalCard;