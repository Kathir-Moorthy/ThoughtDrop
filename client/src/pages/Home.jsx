import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserInfoCard from '../components/Home/UserInfoCard';
import AddJournal from '../components/Home/AddJournal';
import MyJournals from '../components/Home/MyJournals';
import { motion } from 'framer-motion';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [refreshJournals, setRefreshJournals] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleJournalAdded = () => {
    setRefreshJournals(prev => !prev);
  };

  const handleProfileUpdate = (updatedUser) => {
    // This would be handled by AuthContext in a real app
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <UserInfoCard user={user} onUpdate={handleProfileUpdate} />
          <AddJournal onJournalAdded={handleJournalAdded} />
          <MyJournals key={refreshJournals} />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;