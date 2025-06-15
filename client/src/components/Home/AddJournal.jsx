import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { createJournal } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const AddJournal = ({ onJournalAdded }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsUploading(true);
        await createJournal(values);
        toast.success('Journal added successfully');
        resetForm();
        setImagePreview(null);
        onJournalAdded();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to add journal');
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageLoading(true);
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleClearImage = () => {
    formik.setFieldValue('image', null);
    setImagePreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mt-6"
    >
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <h2 className="text-xl font-bold text-white">Add New Journal</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className={`mt-1 block w-full border ${formik.errors.title && formik.touched.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {formik.errors.title && formik.touched.title && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
            className={`mt-1 block w-full border ${formik.errors.content && formik.touched.content ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {formik.errors.content && formik.touched.content && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
          <div className="mt-1 flex items-center space-x-2">
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {imagePreview ? 'Change Image' : 'Add Image'}
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={handleClearImage}
                className="flex items-center bg-red-100 text-red-700 py-2 px-3 rounded-md text-sm hover:bg-red-200"
              >
                <FiX className="mr-1" /> Remove
              </button>
            )}
            <input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          {isImageLoading ? (
            <div className="mt-2 flex items-center justify-center h-32 w-full border border-gray-200 rounded-md">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-500">Loading image...</span>
            </div>
          ) : imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-36 h-auto max-h-64 object-contain rounded-md"
              />
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isUploading || !formik.isValid}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Journal...
              </>
            ) : 'Add Journal'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddJournal;