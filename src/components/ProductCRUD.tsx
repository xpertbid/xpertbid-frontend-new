'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { ApiResponse } from '@/types';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  sku: string;
  stock_quantity: number;
  status: string;
  category_id: number;
  vendor_id: number;
  images: string[];
  specifications: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface ProductCRUDProps {
  vendorId?: number;
}

const ProductCRUD: React.FC<ProductCRUDProps> = ({ vendorId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    sku: '',
    stock_quantity: '',
    status: 'active',
    category_id: '',
    specifications: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [vendorId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.customRequest<ApiResponse<Product[]>>('/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (response && response.data) {
        setProducts(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Failed to fetch products: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: parseInt(formData.category_id),
        vendor_id: vendorId || 1,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
      };

      if (editingProduct) {
        // Update existing product
        const response = await apiService.customRequest<ApiResponse<Product>>(`/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify(productData),
        });

        if (response && response.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
        }
      } else {
        // Create new product
        const response = await apiService.customRequest<ApiResponse<Product>>('/admin/products', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify(productData),
        });

        if (response && response.success) {
          setProducts([...products, response.data]);
        }
      }

      resetForm();
      setShowModal(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Failed to save product: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      sku: product.sku,
      stock_quantity: product.stock_quantity.toString(),
      status: product.status,
      category_id: product.category_id.toString(),
      specifications: JSON.stringify(product.specifications, null, 2),
    });
    setShowModal(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.customRequest<ApiResponse<{ message: string }>>(`/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response && response.success) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Failed to delete product: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sale_price: '',
      sku: '',
      stock_quantity: '',
      status: 'active',
      category_id: '',
      specifications: '',
    });
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-crud">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
          Product Management
        </h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i>
          Add Product
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div>
                    <div className="fw-bold">{product.name}</div>
                    <small className="text-muted">{product.description.substring(0, 50)}...</small>
                  </div>
                </td>
                <td>{product.sku}</td>
                <td>
                  <div>
                    <div className="fw-bold">${product.price}</div>
                    {product.sale_price && (
                      <small className="text-success">Sale: ${product.sale_price}</small>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`badge ${product.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(product)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">SKU *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Sale Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="sale_price"
                        value={formData.sale_price}
                        onChange={handleInputChange}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category ID *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Specifications (JSON)</label>
                    <textarea
                      className="form-control"
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder='{"weight": "1kg", "dimensions": "10x10x10"}'
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCRUD;
