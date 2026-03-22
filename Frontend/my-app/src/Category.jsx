import React, { useEffect, useState } from "react";
import { Plus, Trash2, FolderOpen, Tag } from "lucide-react";
import "../src/styling/category.css";
import { useNavigate } from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa"
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5"); // Default Indigo
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name required");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, color }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCategories((prev) => [...prev, data.category]);
      setName("");
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setCategories((prev) => prev.filter((cat) => cat._id !== id));
  };

  return (
    <div className="category-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="icon-wrapper">
          <button type="button" className="back-btn" onClick={() => navigate("/settings")}>
                      <FaArrowLeft />
                    </button>
        </div>
        <div>
          <h1>Manage Categories</h1>
          <p>Create and organize custom tags for your transactions.</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="category-card">
        
        {/* Section 1: Input Form */}
        <div className="form-section">
          <h3 className="section-title">Add New Category</h3>
          <form onSubmit={addCategory} className="add-category-form">
            <input
              type="text"
              placeholder="e.g. Groceries, Rent, Freelance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            
            <div className="color-picker-group">
               <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
              />
              <div className="color-preview" style={{ backgroundColor: color }}></div>
            </div>

            <button type="submit" className="add-btn">
              <Plus size={18} /> Add Category
            </button>
          </form>
        </div>

        <hr className="divider" />

        {/* Section 2: Grid List */}
        <div className="list-section">
          <h3 className="section-title">Existing Categories ({categories.length})</h3>
          
          <div className="category-grid">
            {categories.map((cat) => (
              <div key={cat._id} className="category-item">
                <div className="item-left">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="category-name">{cat.name}</span>
                </div>
                
                {!cat.isDefault && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteCategory(cat._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <div className="empty-state">
                <Tag size={20} /> No categories added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;