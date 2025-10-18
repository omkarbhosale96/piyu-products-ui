import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select, SelectItem } from "@/components/Select";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api/piyu/product/create`;

const PRODUCT_TYPES = [
  'Mobile',
  'Computer',
  'TV',
  'Refrigerator',
  'Washing machine',
  'Home theatre'
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    model: '',
    type: '',
    quantity: '',
    price: '',
    netLandingPrice: ''
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.model || !formData.type || !formData.quantity || !formData.price || !formData.netLandingPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        company: formData.company,
        model: formData.model,
        type: formData.type,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        netLandingPrice: parseFloat(formData.netLandingPrice)
      };

      await axios.post(API_BASE_URL, payload);
      toast.success('Product created successfully!');
      navigate('/manage');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Header />

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
            <h2 className="section-title">Create New Product</h2>
          </div>

          <form onSubmit={handleSubmit} data-testid="create-product-form">
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
                <label className="form-label" htmlFor="price">
                  Price(₹) *
                </label>
                <Input
                  data-testid="price-input"
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="Enter price"
                  required
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
                  step="0.01"
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
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;