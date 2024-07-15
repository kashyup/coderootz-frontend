import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const Home = ({ userRole, menus, handleLogout }) => {
  return (
    <div className="home-container">
      <Header userRole={userRole} />
      <div className="main-content">
        <Navbar userRole={userRole} menus={menus} handleLogout={handleLogout} />
        <main className="content">
          <h2>Home Page</h2>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
