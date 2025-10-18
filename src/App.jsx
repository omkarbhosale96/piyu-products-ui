import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListReadOnly from '@/pages/ProductListReadOnly';
import ProductListFullAccess from '@/pages/ProductListFullAccess';
import CreateProduct from '@/pages/CreateProduct';
import EditProduct from '@/pages/EditProduct';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductListReadOnly />} />
          <Route path="/view" element={<ProductListReadOnly />} />
          <Route path="/manage" element={<ProductListFullAccess />} />
          <Route path="/create" element={<CreateProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;