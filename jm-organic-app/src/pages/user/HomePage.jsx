// pages/user/HomePage.jsx
import React from 'react';
import Hero from '../../components/home/Hero';
import StatsBar from '../../components/home/StatsBar';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import BulkOrders from '../../components/home/BulkOrders';
import Testimonials from '../../components/home/Testimonials';
import Newsletter from '../../components/home/Newsletter';

const HomePage = () => {
  return (
    <div className="bg-brand-light min-h-screen">
      <Hero />
      <StatsBar />
      <FeaturedProducts />
      <WhyChooseUs />
      <BulkOrders />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default HomePage;