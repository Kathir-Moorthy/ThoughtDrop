import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, deleteAccount } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiEdit2, FiTrash2, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';

const UserInfoCard = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    gender: user.gender,
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateProfile(formData);
      onUpdate(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deletion failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <h2 className="text-xl font-bold text-white">User Profile</h2>
      </div>

      {!isEditing ? (
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FiUser className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FiMail className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email ID</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FiPhone className="text-purple-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone No.</p>
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  <FiUser className="text-pink-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">{user.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <FiEdit2 className="mr-2" />
              Edit Profile
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone No.
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="mt-1 space-y-2">
              {['Male', 'Female', 'Prefer not to say'].map((gender) => (
                <div key={gender} className="flex items-center">
                  <input
                    id={`edit-${gender.toLowerCase()}`}
                    name="gender"
                    type="radio"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor={`edit-${gender.toLowerCase()}`} className="ml-2 block text-sm text-gray-700">
                    {gender}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <FiCheck className="mr-2" />
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <FiTrash2 className="mr-2" />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserInfoCard;