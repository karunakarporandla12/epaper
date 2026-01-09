
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span className="small">© {year} Your Company. All rights reserved.</span>
        <nav className="mt-2 mt-md-0">
         <a href= "/about"> About</a>
          <a href= "/contact">Contact</a>
          <a href = "/privacy">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}
