import React, { useState, useEffect } from "react";

// Dummy Data for example
const dummyData = [
  {
    id: 1,
    organization: "Org A",
    productName: "Product 1",
    basePrice: 100,
    sellingPrice: 120,
  },
  {
    id: 2,
    organization: "Org B",
    productName: "Product 2",
    basePrice: 150,
    sellingPrice: 180,
  },
  {
    id: 3,
    organization: "Org A",
    productName: "Product 3",
    basePrice: 200,
    sellingPrice: 250,
  },
  {
    id: 4,
    organization: "Org B",
    productName: "Product 4",
    basePrice: 130,
    sellingPrice: 160,
  },
  // Add more dummy products if needed
];

const ProductPricingManagement = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    organization: "",
    productName: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    // Simulate API fetch
    setData(dummyData);
    setFilteredData(dummyData);
  }, []);

  useEffect(() => {
    let temp = data;

    if (filters.organization) {
      temp = temp.filter((item) =>
        item.organization
          .toLowerCase()
          .includes(filters.organization.toLowerCase())
      );
    }

    if (filters.productName) {
      temp = temp.filter((item) =>
        item.productName
          .toLowerCase()
          .includes(filters.productName.toLowerCase())
      );
    }

    setFilteredData(temp);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (id, key, value) => {
    setFilteredData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = (id) => {
    const updatedItem = filteredData.find((item) => item.id === id);
    console.log("Saving updated item:", updatedItem);
    // You can add API call here
  };

  const handleResetFilters = () => {
    setFilters({
      organization: "",
      productName: "",
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Product Pricing Management</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="organization"
          placeholder="Filter by Organization"
          value={filters.organization}
          onChange={handleFilterChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="productName"
          placeholder="Filter by Product Name"
          value={filters.productName}
          onChange={handleFilterChange}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <thead>
          <tr>
            <th>Organization</th>
            <th>Product Name</th>
            <th>Base Price</th>
            <th>Selling Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.organization}</td>
              <td>{item.productName}</td>
              <td>
                <input
                  type="number"
                  value={item.basePrice}
                  onChange={(e) =>
                    handleInputChange(item.id, "basePrice", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.sellingPrice}
                  onChange={(e) =>
                    handleInputChange(item.id, "sellingPrice", e.target.value)
                  }
                />
              </td>
              <td>
                <button onClick={() => handleSave(item.id)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            style={{
              marginRight: "5px",
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
            }}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductPricingManagement;
