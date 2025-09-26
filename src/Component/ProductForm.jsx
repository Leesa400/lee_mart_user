import React, { useState, useContext, useRef } from "react";
import AppContext from "../Context/AppContext";
import { toast } from "react-toastify";

const ProductForm = () => {
  const { uploadProduct, categories, addCategory } = useContext(AppContext);

  const [prod_name, setName] = useState(""); 
  const [prod_price, setPrice] = useState(""); 
  const [prod_desc, setDesc] = useState(""); 
  const [prod_brand, setBrand] = useState(""); 
  const [prod_category, setCategory] = useState(""); 
  const [discount, setDiscount] = useState(""); 
  const [about, setAbout] = useState(""); 
  const [keywords, setKeywords] = useState([]); 
  const [fields, setFields] = useState([{ key: "", value: "" }]); 

  const [prod_img, setProdImg] = useState(null); 
  const [prod_img_preview, setProdImgPreview] = useState(null); 

  const [prod_images, setImages] = useState([]); 
  const [prod_images_preview, setImagesPreview] = useState([]); 

  const [newCategory, setNewCategory] = useState(""); 

  const mainImgRef = useRef();
  const galleryRef = useRef();

  const handleFieldChange = (index, e) => {
    const updated = [...fields];
    updated[index][e.target.name] = e.target.value;
    setFields(updated);
  };
  const addField = () => setFields([...fields, { key: "", value: "" }]);
  const removeField = (index) => setFields(fields.filter((_, i) => i !== index));
  const handleKeywordsChange = (e) => setKeywords(e.target.value.split(",").map(k => k.trim()));

  const handleProdImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProdImg(file);
      setProdImgPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagesPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error("Enter category name");
    const res = await addCategory(newCategory);
    if (res.success) {
      setCategory(newCategory);
      setNewCategory("");
      toast.success("Category added!");
    } else {
      toast.error(res.message || "Failed to add category");
    }
  };

  const handleClear = () => {
    setName(""); 
    setPrice(""); 
    setDesc(""); 
    setBrand(""); 
    setCategory(""); 
    setDiscount(""); 
    setAbout(""); 
    setKeywords([]); 
    setFields([{ key: "", value: "" }]); 
    setProdImg(null); 
    setProdImgPreview(null); 
    setImages([]); 
    setImagesPreview([]);
    setNewCategory("");

    if (mainImgRef.current) mainImgRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prod_img) return toast.error("Main image is required!");

    try {
      const productData = {
        prod_name,
        prod_price,
        prod_desc,
        prod_brand,
        prod_category,
        discount,
        fields,
        about,
        keywords,
        prod_img,        
        prod_images      
      };

      const res = await uploadProduct(productData);

      if (res.success) {
        toast.success(res.message);
        handleClear();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload product");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <input type="text" placeholder="Product Name" value={prod_name} onChange={e => setName(e.target.value)} required className="form-control" />
          </div>
          <div className="col-md-4">
            <input type="number" placeholder="Price" value={prod_price} onChange={e => setPrice(e.target.value)} required className="form-control" />
          </div>
          <div className="col-md-4">
            <input type="text" placeholder="Brand" value={prod_brand} onChange={e => setBrand(e.target.value)} required className="form-control" />
          </div>

          <div className="col-md-4">
            <select className="form-select" value={prod_category} onChange={e => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-8">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Add new category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
              <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Add</button>
            </div>
          </div>

          <div className="col-md-4">
            <input type="number" placeholder="Discount %" value={discount} onChange={e => setDiscount(e.target.value)} className="form-control" />
          </div>

          <div className="col-12">
            <textarea placeholder="Description" value={prod_desc} onChange={e => setDesc(e.target.value)} required className="form-control"></textarea>
          </div>
          <div className="col-12">
            <textarea placeholder="About this item" value={about} onChange={e => setAbout(e.target.value)} className="form-control"></textarea>
          </div>
          <div className="col-12">
            <input type="text" placeholder="Keywords (comma separated)" value={keywords.join(", ")} onChange={handleKeywordsChange} className="form-control" />
          </div>

          <div className="col-12">
            {fields.map((field, idx) => (
              <div key={idx} className="d-flex gap-2 mb-2">
                <input type="text" name="key" placeholder="Field Name" value={field.key} onChange={e => handleFieldChange(idx, e)} className="form-control" />
                <input type="text" name="value" placeholder="Value" value={field.value} onChange={e => handleFieldChange(idx, e)} className="form-control" />
                {idx > 0 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(idx)}>Remove</button>}
              </div>
            ))}
            <button type="button" className="btn btn-primary btn-sm mb-3" onClick={addField}>Add Field</button>
          </div>

          <div className="col-md-4">
            <label>Main Image</label>
            <input
              ref={mainImgRef}
              type="file"
              accept="image/*"
              onChange={handleProdImgChange}
              className="form-control"
            />
            {prod_img_preview && (
              <img src={prod_img_preview} alt="main preview" className="img-thumbnail mt-2" />
            )}
          </div>

          <div className="col-md-8">
            <label>Gallery Images</label>
            <input ref={galleryRef} type="file" multiple accept="image/*" onChange={handleGalleryImagesChange} className="form-control" />
            <div className="d-flex flex-wrap gap-2 mt-2">
              {prod_images_preview.map((img, idx) => (
                <img key={idx} src={img} alt="gallery" className="img-thumbnail" style={{width:"80px", height:"80px"}} />
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3">Upload Product</button>
        <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleClear}>Clear Form</button>
      </form>
    </div>
  );
};

export default ProductForm;
