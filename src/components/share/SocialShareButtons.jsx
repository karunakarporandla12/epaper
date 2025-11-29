import React from "react";

const SocialShareButtons = ({ url, text }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };

  return (
    <div className="d-flex flex-row gap-3 align-items-center">
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="share-icon whatsapp">
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-icon facebook">
        <i className="fa-brands fa-facebook"></i>
      </a>

      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-icon twitter">
        <i className="fa-brands fa-x-twitter"></i>
      </a>

      <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="share-icon telegram">
        <i className="fa-brands fa-telegram"></i>
      </a>
    </div>
  );
};

export default SocialShareButtons;
