import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select, SelectItem } from "@/components/Select";
import { toast } from 'sonner';
import { Edit, Trash2, Plus, Search, Package } from 'lucide-react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api/piyu/product/get`;
const API_DELETE_URL = `${BACKEND_URL}/api/piyu/product/delete`;

const PRODUCT_TYPES = [
  'Mobile',
  'Computer',
  'TV',
  'Refrigerator',
  'Washing machine',
  'Home theatre'
];

const ProductListFullAccess = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${API_DELETE_URL}/${productToDelete.id}`);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (product) => {
    navigate(`/edit/${product.id}`, { state: { product } });
  };

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
            <span className="badge-fullaccess">Full Access Mode</span>
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

            <div className="create-btn-wrapper">
              <Button
                data-testid="create-product-btn"
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
              >
                <Plus size={18} className="mr-2" />
                Create Product
              </Button>
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
              <p className="empty-state-subtext">Create your first product to get started</p>
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
                      <th>Actions</th>
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
                            <td>
                              <div className="action-buttons">
                                <Button
                                  data-testid={`edit-btn-${product.id}`}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(product)}
                                >
                                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                    Edit
                                  </span>
                                </Button>
                                <Button
                                  data-testid={`delete-btn-${product.id}`}
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openDeleteDialog(product)}
                                >
                                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6L17.5 19a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                    </svg>
                                    Delete
                                  </span>
                                </Button>
                              </div>
                            </td>
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

      <Modal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Are you sure?"
        description={`This will permanently delete the product "${productToDelete?.model}" from ${productToDelete?.company}. This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />


    </div>
  );
};

export default ProductListFullAccess;