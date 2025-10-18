import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select, SelectItem } from "@/components/Select";
import { toast } from 'sonner';
import { Search, Package } from 'lucide-react';
import Header from '@/components/Header';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api/piyu/product/get`;

const PRODUCT_TYPES = [
  'Mobile',
  'Computer',
  'TV',
  'Refrigerator',
  'Washing machine',
  'Home theatre'
];

const ProductListReadOnly = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: sortOrder
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (filterType && filterType !== 'all') {
        params.type = filterType;
      }

      const response = await axios.get(API_BASE_URL, { params });

      if (response.data) {
        setProducts(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filterType, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(0);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(0);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Header />

        <div className="glass-card">
          <div className="access-mode-badge" data-testid="access-mode">
            <span className="badge-readonly">Read-Only Mode</span>
          </div>

          <div className="controls-section">
            <div className="search-input">
              <div className="relative">
                <Input
                  data-testid="search-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="filter-select">
              <Select value={filterType} onChange={handleFilterChange}>
                <SelectItem value="all">All Types</SelectItem>
                {PRODUCT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="sort-select">
              <Select value={sortOrder} onChange={handleSortChange}>
                <SelectItem value="asc">Price: Low to High</SelectItem>
                <SelectItem value="desc">Price: High to Low</SelectItem>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <p className="empty-state-text">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state" data-testid="empty-state">
              <div className="empty-state-icon">
                <Package size={64} className="mx-auto opacity-30" />
              </div>
              <p className="empty-state-text">No products found</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="custom-table" data-testid="products-table">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Company</th>
                      <th>Model</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Net Landing Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id} data-testid={`product-row-${product.id}`}>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{product.company}</td>
                        <td>{product.model}</td>
                        <td>{product.type}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price?.toFixed(2)}</td>
                        <td>{product.netLandingPrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-section">
                <div className="pagination-info" data-testid="pagination-info">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} products
                </div>
                <div className="pagination-controls">
                  <Button
                    data-testid="prev-page-btn"
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    data-testid="next-page-btn"
                    variant="outline"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListReadOnly;