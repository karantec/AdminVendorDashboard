const ApproveVendorPage = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch pending vendors (using dummy data for now)
  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would make an API call here
        // const response = await axios.get(`${API_URL}/admin/vendors/pending`);
        // setPendingVendors(response.data);

        // Using dummy data for now
        const dummyData = [
          {
            _id: "1",
            businessName: "Fresh Grocery Mart",
            ownerName: "John Doe",
            email: "john@freshgrocery.com",
            phone: "555-123-4567",
            address: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            businessType: "grocery",
            documentUrl: "https://example.com/documents/1",
            appliedAt: new Date("2023-05-15"),
            status: "pending",
          },
          {
            _id: "2",
            businessName: "Quick Stop Convenience",
            ownerName: "Jane Smith",
            email: "jane@quickstop.com",
            phone: "555-987-6543",
            address: "456 Oak Avenue",
            city: "Brooklyn",
            state: "NY",
            zipCode: "11201",
            businessType: "convenience",
            documentUrl: "https://example.com/documents/2",
            appliedAt: new Date("2023-05-18"),
            status: "pending",
          },
        ];

        setPendingVendors(dummyData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch pending vendors");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchPendingVendors();
  }, []);

  const handleVendorAction = async (vendorId, action) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, you would make an API call here
      // await axios.patch(`${API_URL}/admin/vendors/${vendorId}/${action}`);

      // For demo purposes, we'll just update the local state
      setPendingVendors((prev) =>
        prev.filter((vendor) => vendor._id !== vendorId)
      );

      setSuccessMessage(`Vendor ${action}d successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Failed to ${action} vendor`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Approve New Vendors
        </h1>
        <p className="text-gray-600 mt-2">
          Review and approve or reject new vendor applications
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      {isLoading && pendingVendors.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : pendingVendors.length === 0 ? (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p>No pending vendor applications at this time.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-gray-700">
              Showing{" "}
              <span className="font-semibold">{pendingVendors.length}</span>{" "}
              pending applications
            </p>
          </div>

          {/* <div className="grid grid-cols-1 gap-6">
            {pendingVendors.map((vendor) => (
              <VendorApprovalCard
                key={vendor._id}
                vendor={vendor}
                onAction={handleVendorAction}
                isLoading={isLoading}
              />
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ApproveVendorPage;
