import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select, SelectItem } from "@/components/Select";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api/piyu/product/update`;

const PRODUCT_TYPES = [
  'Accessories',
  'Computer',
  'TV',
  'Refrigerator',
  'Washing machine',
  'Home theatre',
  'Air Cooler'
];

const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    company: '',
    size: '',
    model: '',
    type: '',
    quantity: '',
    netLandingPrice: ''
  });

  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product;
      setFormData({
        id: product.id,
        company: product.company || '',
        size: product.size || '',
        model: product.model || '',
        type: product.type || '',
        quantity: product.quantity?.toString() || '',
        serialNumber: product.serialNumber?.toString() || '',
        netLandingPrice: product.netLandingPrice?.toString() || ''
      });
    } else {
      toast.error('Product data not found');
      navigate('/manage');
    }
  }, [location.state, navigate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.model || !formData.type || !formData.quantity || !formData.netLandingPrice) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: formData.id,
        company: formData.company,
        size: formData.size,
        model: formData.model,
        type: formData.type,
        quantity: parseInt(formData.quantity),
        serialNumber: formData.serialNumber,
        netLandingPrice: parseInt(formData.netLandingPrice)
      };

      await axios.put(API_BASE_URL, payload);
      toast.success('Product updated successfully!');
      navigate('/manage');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="page-title" data-testid="page-title">Piyu Electronics</h1>
        </div>

        <div className="glass-card form-container">
          <div className="mb-6">
            <Button
              data-testid="back-btn"
              variant="ghost"
              onClick={() => navigate('/manage')}
              className="mb-4"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Products
            </Button>
            <h2 className="section-title">Edit Product</h2>
          </div>

          <form onSubmit={handleSubmit} data-testid="edit-product-form">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" htmlFor="company">
                  Company *
                </label>
                <Input
                  data-testid="company-input"
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="size">
                  Size 
                </label>
                <Input
                  data-testid="size-input"
                  id="size"
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  placeholder="Enter size"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="model">
                  Model *
                </label>
                <Input
                  data-testid="model-input"
                  id="model"
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="Enter model name"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label" htmlFor="type">
                  Type *
                </label>
                <Select
                  value={formData.type}
                  onChange={(value) => handleChange('type', value)}
                  className="form-select"
                >
                  <option value="">Select product type</option>
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="quantity">
                  Quantity *
                </label>
                <Input
                  data-testid="quantity-input"
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="serialNumber">
                  Serial Number
                </label>
                <Input
                  data-testid="serial-number-input"
                  id="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleChange('serialNumber', e.target.value)}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label" htmlFor="netLandingPrice">
                  Net Landing Price(₹) *
                </label>
                <Input
                  data-testid="net-landing-price-input"
                  id="netLandingPrice"
                  type="number"
                  min="0"
                  value={formData.netLandingPrice}
                  onChange={(e) => handleChange('netLandingPrice', e.target.value)}
                  placeholder="Enter net landing price"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <Button
                data-testid="cancel-btn"
                type="button"
                variant="outline"
                onClick={() => navigate('/manage')}
              >
                Cancel
              </Button>
              <Button
                data-testid="submit-btn"
                type="submit"
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;