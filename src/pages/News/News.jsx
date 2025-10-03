import React, { useEffect, useState } from 'react'
import './News.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify';

const News = ({ url }) => {
    const [image, setImage] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newsList, setNewsList] = useState([])
    
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Fetch all news
    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/news/get`);
            if (response.data.success) {
                setNewsList(response.data.data || []);
            } else {
                toast.error("Failed to fetch news");
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Error loading news");
        } finally {
            setLoading(false);
        }
    }

    // Add new news
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (isSubmitting) return;
        if (!formData.title || !formData.desc) {
            toast.error("Title and description are required");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('desc', formData.desc);
            if (image) {
                data.append('image', image);
            }
            
            const response = await axios.post(`${url}/api/news/add`, data);
            
            if (response.data.success) {
                toast.success("News added successfully!");
                setFormData({ title: "", desc: "" });
                setImage(false);
                await fetchNews();
            } else {
                throw new Error(response.data.message || "Failed to add news");
            }
        } catch (error) {
            console.error("Add news error:", error);
            const errorMessage = error.response?.data?.message || "Failed to add news";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Delete news
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this news?")) return;
        
        try {
            const response = await axios.post(`${url}/api/news/delete`, { id });
            if (response.data.success) {
                toast.success("News deleted successfully!");
                await fetchNews();
            } else {
                throw new Error(response.data.message || "Failed to delete news");
            }
        } catch (error) {
            console.error("Delete news error:", error);
            const errorMessage = error.response?.data?.message || "Failed to delete news";
            toast.error(errorMessage);
        }
    }

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className='admin-section'>
            <div className='form-card'>
                <p className='section-title'>Add News</p>
                <hr />
                <form className='flex-col' onSubmit={handleSubmit}>
                    <div className='field-group flex-col'>
                        <p>Title</p>
                        <input
                            type='text'
                            name='title'
                            placeholder='Enter news title'
                            value={formData.title}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                    <div className='field-group flex-col'>
                        <p>Description</p>
                        <textarea
                            name='desc'
                            placeholder='Enter news description'
                            value={formData.desc}
                            onChange={onChangeHandler}
                            required
                            rows="4"
                        />
                    </div>
                    <div className='field-group flex-col'>
                        <p>Image (Optional)</p>
                        <label htmlFor="image-upload" className='image-upload'>
                            <img 
                                className='upload-asset' 
                                src={image ? URL.createObjectURL(image) : assets.upload_area} 
                                alt="Upload" 
                            />
                        </label>
                        <input 
                            onChange={(e) => setImage(e.target.files[0])} 
                            type="file" 
                            id="image-upload" 
                            accept="image/*"
                            hidden 
                        />
                    </div>
                    <button type='submit' className='add-btn' disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add News"}
                    </button>
                </form>
            </div>
            
            <div className='list-card'>
                <p className='section-title'>News List</p>
                <div className='list-table'>
                    <div className='list-table-format title'>
                        <b>Image</b>
                        <b>Title</b>
                        <b>Description</b>
                        <b>Action</b>
                    </div>
                    {loading ? (
                        <div className='loading-container'>
                            <div className='loading-spinner'></div>
                            <p>Loading news...</p>
                        </div>
                    ) : newsList.length === 0 ? (
                        <div className='empty-state'>
                            <p>No news found</p>
                        </div>
                    ) : (
                        newsList.map((item) => (
                            <div key={item._id} className='list-table-format'>
                                {item.image ? (
                                    <img 
                                        src={item.image} 
                                        alt={item.title || 'News image'} 
                                        className='news-thumbnail'
                                        onError={(e) => {
                                            console.error('Error loading image:', item.image);
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : (
                                    <div className='thumb-fallback'>No Image</div>
                                )}
                                {!item.image && <div className='thumb-fallback'>No Image</div>}
                                <p className='truncate'>{item.title}</p>
                                <p className='truncate'>{item.desc}</p>
                                <p className='cursor remove' onClick={() => handleDelete(item._id)}>×</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default News


