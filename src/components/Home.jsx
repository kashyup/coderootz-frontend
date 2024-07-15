import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css'

const Home = ({ userRole, menus }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <Navbar userRole={userRole} menus={menus} />
      <main>
        <h2>Welcome to the Home Page</h2>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
