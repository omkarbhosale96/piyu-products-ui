import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, Search, Package } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api/piyu/product/get`;
const API_BASE_URL_DELETE = `${BACKEND_URL}/api/piyu/product/delete`;

const PRODUCT_TYPES = [
  'Mobile',
  'Computer',
  'TV',
  'Refrigerator',
  'Washing machine',
  'Home theatre'
];

const ProductList = () => {
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

    try {
      await axios.delete(`${API_BASE_URL_DELETE}/${productToDelete.id}`);
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
        <div className="header-section">
          <h1 className="page-title" data-testid="page-title">Piyu Electronics</h1>
        </div>

        <div className="glass-card">
          <div className="controls-section">
            <div className="search-input">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
              <Select value={filterType} onValueChange={handleFilterChange}>
                <SelectTrigger data-testid="filter-select">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sort-select">
              <Select value={sortOrder} onValueChange={handleSortChange}>
                <SelectTrigger data-testid="sort-select">
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Price: Low to High</SelectItem>
                  <SelectItem value="desc">Price: High to Low</SelectItem>
                </SelectContent>
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
                        <td>${product.price?.toFixed(2)}</td>
                        <td>${product.netLandingPrice?.toFixed(2)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              data-testid={`edit-btn-${product.id}`}
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              data-testid={`delete-btn-${product.id}`}
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 size={16} />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.model}" from {productToDelete?.company}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete-btn"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductList;