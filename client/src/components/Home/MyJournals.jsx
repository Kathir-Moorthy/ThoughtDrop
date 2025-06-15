import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiX, FiCheck, FiSearch } from 'react-icons/fi';

const MyJournals = () => {
    const [journals, setJournals] = useState([]);
    const [filteredJournals, setFilteredJournals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedJournal, setEditedJournal] = useState({
        title: '',
        content: '',
        image: null,
        imageUrl: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const fetchJournals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journals`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch journals');
            }
            
            const data = await response.json();
            const journalsData = data.data || data;
            setJournals(journalsData);
            setFilteredJournals(journalsData);
        } catch (error) {
            toast.error('Failed to fetch journals');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredJournals(journals);
        } else {
            const filtered = journals.filter(journal => 
                journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                journal.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredJournals(filtered);
        }
    }, [searchTerm, journals]);

    const formatIndianTime = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        
        // Add 5 hours and 30 minutes to convert UTC to IST
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);
        
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        
        return date.toLocaleString('en-IN', options);
    };

    const handleEdit = (journal) => {
        setEditingId(journal.id);
        setEditedJournal({
            title: journal.title,
            content: journal.content,
            image: null,
            imageUrl: journal.image_url || '',
        });
        if (journal.image_url) {
            setImagePreview(journal.image_url);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedJournal(prev => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsImageLoading(true);
            setEditedJournal(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setIsImageLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setIsImageLoading(true);
        setTimeout(() => {
            setEditedJournal(prev => ({ ...prev, image: null, imageUrl: '' }));
            setImagePreview(null);
            setIsImageLoading(false);
        }, 500); // Simulate loading for better UX
    };

    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', editedJournal.title);
            formData.append('content', editedJournal.content);

            // Handle image cases
            if (editedJournal.image) {
                formData.append('image', editedJournal.image);
            } else if (editedJournal.imageUrl === '' && !editedJournal.image) {
                formData.append('currentImageUrl', '');
            } else if (editedJournal.imageUrl) {
                formData.append('currentImageUrl', editedJournal.imageUrl);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journals/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update journal');
            }

            const data = await response.json();
            const updatedJournals = journals.map(j => j.id === id ? data.data || data : j);
            setJournals(updatedJournals);
            setFilteredJournals(updatedJournals);
            setEditingId(null);
            setImagePreview(null);
            toast.success('Journal updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update journal');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this journal?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journals/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete journal');
                }

                const updatedJournals = journals.filter(j => j.id !== id);
                setJournals(updatedJournals);
                setFilteredJournals(updatedJournals);
                toast.success('Journal deleted successfully');
            } catch (error) {
                toast.error(error.message || 'Failed to delete journal');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (journals.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
            >
                No journals yet. Add your first journal to get started!
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">My Journals</h2>
                
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search journals..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredJournals.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                >
                    No journals found matching your search.
                </motion.div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {filteredJournals.map((journal) => (
                            <motion.div
                                key={journal.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-sm border-2 border-black overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                {editingId === journal.id ? (
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                name="title"
                                                value={editedJournal.title}
                                                onChange={handleEditChange}
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-bold text-lg"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <textarea
                                                name="content"
                                                rows={4}
                                                value={editedJournal.content}
                                                onChange={handleEditChange}
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Image
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <label
                                                    htmlFor={`edit-image-${journal.id}`}
                                                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                >
                                                    {imagePreview || editedJournal.imageUrl ? 'Change Image' : 'Add Image'}
                                                </label>
                                                {(imagePreview || editedJournal.imageUrl) && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="bg-red-100 text-red-700 py-2 px-3 rounded-md text-sm hover:bg-red-200"
                                                    >
                                                        Remove Image
                                                    </button>
                                                )}
                                                <input
                                                    id={`edit-image-${journal.id}`}
                                                    name="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleEditImageChange}
                                                    className="sr-only"
                                                />
                                            </div>
                                            
                                            {isImageLoading ? (
                                                <div className="mt-2 flex items-center justify-center h-32 w-32 border border-gray-200 rounded-md">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {editedJournal.image ? 'Adding image...' : 'Removing image...'}
                                                    </span>
                                                </div>
                                            ) : (imagePreview || editedJournal.imageUrl) && (
                                                <div className="mt-2">
                                                    <img
                                                        src={imagePreview || editedJournal.imageUrl}
                                                        alt="Preview"
                                                        className="h-32 w-auto object-contain rounded-md border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUpdate(journal.id)}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                            >
                                                <FiCheck className="mr-1" /> Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setImagePreview(null);
                                                }}
                                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                            >
                                                <FiX className="mr-1" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-lg font-bold text-gray-900">{journal.title}</h2>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(journal)}
                                                    className="text-primary hover:text-primary-dark transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <FiEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(journal.id)}
                                                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-gray-600 text-justify whitespace-pre-line font-medium">
                                            {journal.content}
                                        </p>

                                        {journal.image_url && (
                                            <div className="mt-4">
                                                <img
                                                    src={journal.image_url}
                                                    alt="Journal"
                                                    className="max-w-[200px] h-auto rounded-md border border-gray-200"
                                                />
                                            </div>
                                        )}

                                        <div className="mt-4 text-sm text-gray-500">
                                            <div>Created at: {formatIndianTime(journal.created_at)}</div>
                                            {journal.updated_at && journal.updated_at !== journal.created_at && (
                                                <div className="mt-1">
                                                    Updated Last at: {formatIndianTime(journal.updated_at)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default MyJournals;