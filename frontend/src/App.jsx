import { useEffect, useState } from 'react'
import axios from 'axios'
import { 
  ShoppingBag, 
  PackagePlus, 
  Image as ImageIcon, 
  Pencil, 
  Trash2, 
  X, 
  Save 
} from 'lucide-react'
import './App.css'

const emptyForm = { name: '', price: '', description: '' }

function App() {
  const [products, setProducts] = useState([])   // danh sách sản phẩm
  const [form, setForm] = useState(emptyForm)    // dữ liệu form nhập
  const [imageFile, setImageFile] = useState(null) // file ảnh được chọn
  const [editingId, setEditingId] = useState(null) // đang sửa sản phẩm nào (null = đang thêm mới)
  const [loading, setLoading] = useState(false)

  // Gọi API lấy danh sách ngay khi mở trang
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data)
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error)
    }
  }

  // Gõ vào ô input nào thì cập nhật field đó trong form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Bấm nút Thêm mới / Cập nhật
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', form.name)
      data.append('price', form.price)
      data.append('description', form.description)
      if (imageFile) data.append('image', imageFile)

      if (editingId) {
        await axios.put('/api/products/' + editingId, data)
      } else {
        await axios.post('/api/products', data)
      }
      resetForm()
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Bấm nút Sửa trên 1 card
  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: product.price,
      description: product.description
    })
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Bấm nút Xoá
  async function handleDelete(id) {
    if (!confirm('Xoá sản phẩm này?')) return
    await axios.delete('/api/products/' + id)
    fetchProducts()
  }

  function resetForm() {
    setForm(emptyForm)
    setImageFile(null)
    setEditingId(null)
    const fileInput = document.getElementById('imageInput')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="layout-wrapper">
      <header>
        <h1><ShoppingBag size={28} color="#2563eb" /> Go Shop</h1>
      </header>

      <div className="main-content">
        {/* ---- FORM THÊM / SỬA ---- */}
        <div className="form-section">
          <h2>
            <PackagePlus size={20} />
            {editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input
                name="name"
                placeholder="Nhập tên sản phẩm..."
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Giá (VND)</label>
              <input
                name="price"
                type="number"
                min="0"
                placeholder="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                name="description"
                placeholder="Nhập mô tả sản phẩm..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Hình ảnh</label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="actions">
              <button type="submit" className="primary" disabled={loading}>
                {editingId ? <Save size={16} /> : <PackagePlus size={16} />}
                {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  <X size={16} /> Huỷ
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ---- LƯỚI CARD SẢN PHẨM ---- */}
        <div className="products-section">
          {products.length === 0 ? (
            <div className="empty-state">
              <PackagePlus size={48} strokeWidth={1} />
              <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
            </div>
          ) : (
            <div className="grid">
              {products.map((product) => (
                <div className="card product" key={product.id}>
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="no-image">
                        <ImageIcon size={32} opacity={0.5} />
                        <span>Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">
                      {Number(product.price).toLocaleString('vi-VN')} ₫
                    </p>
                    <p className="desc">{product.description}</p>
                    
                    <div className="product-actions">
                      <button 
                        className="icon-only" 
                        onClick={() => startEdit(product)}
                        title="Sửa"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        className="icon-only danger-text" 
                        onClick={() => handleDelete(product.id)}
                        title="Xoá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App