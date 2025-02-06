import React from 'react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  // Animasi untuk komponen
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <div className="bg-gray-100">
      {/* Navbar
      <nav className="bg-base-100 shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <motion.a
            href="#"
            className="text-3xl font-bold text-primary"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Spare Parts Hub
          </motion.a>
          <ul className="flex space-x-6">
            <motion.li
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a href="#products" className="btn btn-ghost">Products</a>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a href="#about" className="btn btn-ghost">About Us</a>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="#contact" className="btn btn-ghost">Contact</a>
            </motion.li>
          </ul>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="hero bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?car,spareparts')" }}>
        <motion.div
          className="hero-overlay bg-black bg-opacity-60 w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-center text-white"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-6xl font-bold mb-4">Top Quality Spare Parts</h1>
            <p className="text-lg mb-8">Your one-stop shop for all car spare parts.</p>
            <a href="#products" className="btn btn-primary btn-lg">Shop Now</a>
          </motion.div>
        </motion.div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            Featured Products
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                className="card bg-base-100 shadow-xl transition-transform transform hover:scale-105"
                variants={fadeIn}
              >
                <figure>
                  <img src='https://plus.unsplash.com/premium_photo-1661604017235-a648ad87ff56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Spare Part {index + 1}</h2>
                  <p>High-quality spare part for your vehicle.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Add to Cart</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            What Our Customers Say
          </motion.h2>
          <motion.div
            className="flex flex-wrap justify-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                className="max-w-xs mx-4 mb-6 p-6 bg-white shadow-lg rounded-lg"
                variants={fadeIn}
              >
                <p className="italic">"Great service and quality parts!"</p>
                <p className="font-bold">- Customer {index + 1}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            About Us
          </motion.h2>
          <motion.p
            className="mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            We are committed to providing the best quality spare parts for your vehicles. Our mission is to ensure that you have access to the parts you need to keep your car running smoothly.
          </motion.p>
          <motion.a
            href="#contact"
            className="btn btn-secondary btn-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            Learn More
          </motion.a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            If you have any questions, feel free to reach out!
          </motion.p>
          <motion.form
            className="max-w-md mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <input type="text" placeholder="Your Name" className="input input-bordered w-full mb-4" />
            <input type="email" placeholder="Your Email" className="input input-bordered w-full mb-4" />
            <textarea placeholder="Your Message" className="textarea textarea-bordered w-full mb-4" rows="4" />
            <button type="submit" className="btn btn-primary w-full">Send Message</button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};