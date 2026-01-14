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
const API_DOWNLOAD_EXCEL_URL = `${BACKEND_URL}/api/piyu/product/download/excel`;


const PRODUCT_TYPES = [
  'Accessories',
  'Computer',
  'TV',
  'Refrigerator',
  'Washing machine',
  'Home theatre',
  'Air Cooler'
];

const ProductListReadOnly = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize
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
  }, [currentPage, searchTerm, filterType]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(0);
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(API_DOWNLOAD_EXCEL_URL, {
        responseType: 'blob', // 🔑 REQUIRED
      });

      // Extract filename from Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      const today = new Date();
      let filename = `products_${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}.xlsx`;


      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Excel downloaded successfully');
    } catch (error) {
      console.error('Error downloading excel:', error);
      toast.error('Failed to download Excel');
    } finally {
      setDownloading(false);
    }
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
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleDownloadExcel}
                  disabled={downloading}
                  variant="outline"
                  className="flex items-center gap-2"
                  data-testid="download-excel-btn"
                >
                  {downloading ? 'Downloading...' : 'Download Excel'}
                </Button>
              </div>
              <br />
              <div className="table-container">
                <table className="custom-table" data-testid="products-table">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Company</th>
                      <th>Size</th>
                      <th>Model</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Serial No</th>
                      <th>Net Landing Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id} data-testid={`product-row-${product.id}`}>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{product.company}</td>
                        <td>{product.size}</td>
                        <td>{product.model}</td>
                        <td>{product.type}</td>
                        <td>{product.quantity}</td>
                        <td>{product.serialNumber}</td>
                        <td>{product.netLandingPrice}</td>
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