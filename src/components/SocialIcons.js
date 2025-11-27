
import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import './SocialIcons.css';

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <button><FaFacebook /> Facebook</button>
      <button><FaTwitter /> Twitter</button>
      <button><FaWhatsapp /> WhatsApp</button>
    </div>
  );
};

export default SocialIcons;
