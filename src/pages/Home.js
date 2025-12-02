import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

const FEATURE_GROUPS = [
  {
    title: "Core Platform",
    items: [
      { id: "cloud", title: "Cloud ePaper", desc: "Cloud-native CMS: fast, secure, low maintenance.", icon: "bi-cloud" },
      { id: "cdn", title: "CDN Integration", desc: "Global CDN for faster page delivery worldwide.", icon: "bi-globe" },
      { id: "page", title: "Page Creation", desc: "Drag & drop page builder and flexible layout controls.", icon: "bi-file-earmark-text" },
      { id: "pwa", title: "PWA App", desc: "Installable web app with offline-first behavior.", icon: "bi-phone" },
    ],
  },
  {
    title: "Reading & Content",
    items: [
      { id: "mapping", title: "Mapping & Cropping", desc: "Select and crop regions to share precise clips.", icon: "bi-scissors" },
      { id: "slider", title: "Clip Slider", desc: "Swipeable clip carousel for highlights and headlines.", icon: "bi-sliders" },
      { id: "watermark", title: "Watermark", desc: "Protect visuals with configurable watermarking.", icon: "bi-droplet" },
      { id: "archive", title: "Archive", desc: "Searchable archive of past editions and pages.", icon: "bi-folder2-open" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { id: "comment", title: "Comments", desc: "Reader commenting with moderation tools.", icon: "bi-chat-left-dots" },
      { id: "social", title: "Social Sharing", desc: "One-tap sharing with optimized previews.", icon: "bi-share" },
      { id: "affiliate", title: "Affiliate Program", desc: "Referral incentives for growing subscribers.", icon: "bi-people" },
    ],
  },
  {
    title: "Business & Management",
    items: [
      { id: "paid", title: "Paid Subscriptions", desc: "Flexible paywalls, recurring billing, trials.", icon: "bi-credit-card-2-back" },
      { id: "scheduler", title: "Scheduler Publishing", desc: "Plan and publish editions automatically.", icon: "bi-calendar-event" },
      { id: "multiuser", title: "Multi-User System", desc: "Roles & permissions for teams and editors.", icon: "bi-people-fill" },
      { id: "navbar", title: "Dynamic Navbar", desc: "Custom menus, positions & styles without code.", icon: "bi-menu-button" },
      { id: "custom", title: "Customization", desc: "Themes, fonts, and layout options for branding.", icon: "bi-palette" },
    ],
  },
];

export default function Home() {
  return (
    <div className="home-page">
      {/* NAV */}
      <nav className="navbar navbar-expand-lg navbar-transparent">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/assets/epaper-logo.png" alt="ezydesk" className="brand-logo" />
            <span className="brand-name">ezydesk</span>
          </a>

          <div className="ms-auto d-flex align-items-center gap-3">
            <a className="nav-link small text-light d-none d-lg-inline" href="#features">Features</a>
            <a className="nav-link small text-light d-none d-lg-inline" href="#demo">Demo</a>
            <a className="btn btn-outline-light btn-sm" href="#signup">Login / Sign Up</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero container-fluid">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <div className="hero-badge">7 DAYS FREE TRIAL</div>
              <h1 className="hero-title">ezydesk — Modern Cloud ePaper CMS</h1>
              <p className="hero-sub">
                Publish interactive editions, create shareable clips, and monetize easily — all from one lightweight cloud dashboard.
              </p>

              <div className="d-flex gap-2 flex-wrap mt-3">
                <a className="btn primary-btn btn-lg" href="#signup">Start 7 Days Trial</a>
                <a className="btn outline-btn btn-lg" href="#demo">Watch Demo</a>
              </div>

              <ul className="hero-features mt-4">
                <li>Best price guarantee • No hidden fees</li>
                <li>Trusted by 320+ publishers • #No1 Epaper CMS in India</li>
              </ul>
            </div>

            <div className="col-lg-6 text-center hero-media">
              <div className="device-wrap">
                <img src="/assets/hero-device.png" alt="device" className="device-img" />
                <img src="/assets/hero-person.png" alt="person" className="device-person d-none d-lg-block" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DEMO / WHAT */}
      <section id="demo" className="demo container py-5">
        <div className="row g-4 align-items-start">
          <div className="col-md-6">
            <div className="ratio ratio-16x9 shadow rounded">
              <iframe title="ezydesk-demo" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen />
            </div>
          </div>

          <div className="col-md-6">
            <h3>What is ezydesk?</h3>
            <p className="text-muted">
              ezydesk is a focused platform for publishers. Upload pages, map clickable areas, create clipped content, and reach readers across devices.
            </p>
            <ul className="text-muted">
              <li>Mobile-first reading UI, optimized for performance</li>
              <li>Area mapping & crop tools for shareable content</li>
              <li>Monetization and subscription features built-in</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ADMIN BAND */}
      <section className="admin-band py-5">
        <div className="container text-center">
          <h4 className="mb-1">Powerful Admin Panel</h4>
          <p className="text-muted small mb-4">Publish, analyze and manage your editions from a single dashboard.</p>
          <div className="admin-screenshot mx-auto">
            <img src="/assets/admin-screenshot.png" alt="admin screenshot" className="img-fluid rounded" />
          </div>
        </div>
      </section>

      {/* FEATURES grouped */}
      <section id="features" className="features container py-5">
        <div className="d-flex justify-content-between align-items-start mb-4 flex-column flex-md-row gap-3">
          <div>
            <h2 className="section-title">Core Features</h2>
            <p className="text-muted small">Everything publishers need — performance, protection and revenue tools.</p>
          </div>

          <div className="d-flex gap-3 align-items-center">
            <div className="pill small text-muted">Trusted by <strong>320+</strong></div>
            <div className="pill small text-muted">Best price guarantee</div>
            <div className="trial small text-muted">7 Days Trial</div>
          </div>
        </div>

        {FEATURE_GROUPS.map((g) => (
          <div className="mb-5" key={g.title}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="group-title mb-0">{g.title}</h5>
              <small className="text-muted d-none d-lg-inline">Explore →</small>
            </div>

            <div className="row g-3">
              {g.items.map((f) => (
                <div className="col-6 col-md-4 col-lg-3" key={f.id}>
                  <div className="feature-card h-100 p-3">
                    <div className="d-flex gap-3 align-items-start">
                      <div className="feature-icon">
                        <i className={`bi ${f.icon} fs-4`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{f.title}</h6>
                        <p className="small text-muted mb-2">{f.desc}</p>
                        <a className="small text-link" href="#contact">Learn more →</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA after features */}
        <div className="d-flex gap-3 justify-content-between align-items-center mt-4 flex-column flex-md-row">
          <div>
            <h4 className="mb-1">Ready to publish with ezydesk?</h4>
            <p className="text-muted small mb-0">Start your no-risk 7-day trial today.</p>
          </div>

          <div className="d-flex gap-2">
            <a className="btn primary-btn" href="#signup">Start 7 Days Trial</a>
            <a className="btn outline-btn" href="#demo">Watch Demo</a>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust container-fluid py-3">
        <div className="container d-flex justify-content-between align-items-center gap-3 flex-column flex-md-row">
          <div className="trust-left">Trusted by <strong>320+</strong> publishers • Best price guarantee • No hidden fees</div>
          <div className="trust-right">
            <img src="/assets/google-play-badge.png" alt="google play" style={{ height: 36 }} />
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="info container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <h4>Publish smarter, grow faster</h4>
            <p className="text-muted">ezydesk reduces publishing overhead while providing advanced tools to increase readership and revenue.</p>
            <ul className="text-muted small">
              <li>Fast delivery & caching</li>
              <li>Flexible monetization & analytics</li>
              <li>Easy onboarding & migration support</li>
            </ul>
          </div>

          <div className="col-lg-4 text-center">
            <img src="/assets/epaper-info.png" alt="info" className="img-fluid rounded shadow-sm" />
          </div>
        </div>
      </section>

      {/* CONTACT BAR */}
      <section className="contact-bar container-fluid py-3">
        <div className="container d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
          <div>
            <strong>Have questions?</strong>
            <div className="text-muted small">We offer setup, migration and 24/7 support.</div>
          </div>
          <div className="d-flex gap-2">
            <a className="btn primary-btn" href="tel:+918794047652"><i className="bi bi-telephone me-2"></i> +91 8794 047 652</a>
            <a className="btn outline-btn" href="#contact">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer container-fluid py-5">
        <div className="container">
          <div className="row gy-4">
            <div className="col-md-4">
              <img src="/assets/epaper-logo-white.png" alt="ezydesk" className="footer-logo" />
              <p className="small text-muted mt-2">ezydesk Cloud Solutions — built for publishers.</p>
            </div>

            <div className="col-md-2">
              <h6 className="text-white">Product</h6>
              <ul className="list-unstyled small">
                <li>Features</li>
                <li>Pricing</li>
                <li>Demo</li>
              </ul>
            </div>

            <div className="col-md-3">
              <h6 className="text-white">Company</h6>
              <ul className="list-unstyled small">
                <li>About</li>
                <li>Support</li>
                <li>Careers</li>
              </ul>
            </div>

            <div className="col-md-3">
              <h6 className="text-white">Legal</h6>
              <ul className="list-unstyled small">
                <li>Terms</li>
                <li>Privacy</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>

          <div className="text-center small text-muted mt-4">© {new Date().getFullYear()} ezydesk. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
