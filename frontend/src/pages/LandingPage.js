import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./LandingPage.css"

// SVG icons for contact info
const PhoneIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"></path></svg>
)

const MailIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>
)

const LocationIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
)

const ClockIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)

// SVG icon for helpline phone
const HelplinePhoneIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M16.7 13.6c-.4-.2-.8-.1-1.1.2l-.7.7c-1.1-.6-2-1.5-2.6-2.6l.7-.7c.3-.3.4-.7.2-1.1l-.7-1.6c-.2-.4-.7-.6-1.1-.5l-1.1.3c-.4.1-.7.5-.7.9 0 4.1 3.3 7.4 7.4 7.4.4 0 .8-.3.9-.7l.3-1.1c.1-.4-.1-.9-.5-1.1l-1.6-.7z" fill="#fff"/></svg>
)

const specialties = [
  "Bariatric Surgery", "Cardiology", "Critical Care", "CT Surgery", "Dermatology", 
  "Emergency Services", "Endocrinology", "ENT", "Gastroenterology", "General Medicine", 
  "Gynaecology", "Hematology & BMT", "Interventional Radiology", "Kidney Transplant", 
  "Liver Transplant", "Lung Transplant", "Mother & Child", "Movement Disorders", 
  "Multiorgan Transplant", "Nephrology", "Neurology", "Nuclear Medicine", "Oncology", 
  "Ophthalmology", "Orthopedics", "Pain Medicine", "Pediatrics", "Physiotherapy",
  "Plastic Surgery","Pulmonology","Radiology","Rheumatology","Robotic Science","Spine Surgery",
  "Sports Medicine","Surgical Gastroenterology","Urology","Vascular Surgery"
]

const doctors = [
  { name: "Dr. Anjali Sharma", specialty: "Cardiology", experience: "15+ years", img: "/assets/doctors/anjali_sharma.jpg" },
  { name: "Dr. Raj Patel", specialty: "ENT", experience: "12+ years", img: "/assets/doctors/raj_patel.jpg" },
  { name: "Dr. Neha Gupta", specialty: "Neurology", experience: "18+ years", img: "/assets/doctors/neha_gupta.jpg" },
  { name: "Dr. Aarav Singh", specialty: "Gynaecology", experience: "10+ years", img: "/assets/doctors/aarav_singh.jpg" },
  { name: "Dr. Riya Kumar", specialty: "Dermatology", experience: "8+ years", img: "/assets/doctors/riya_kumar.jpg" },
  { name: "Dr. Sandeep Reddy", specialty: "Gastroenterology", experience: "14+ years", img: "/assets/doctors/sandeep_reddy.jpg" },
  { name: "Dr. Meera Joshi", specialty: "Oncology", experience: "16+ years", img: "/assets/doctors/meera_joshi.jpg" },
  { name: "Dr. Arjun Verma", specialty: "General Medicine", experience: "11+ years", img: "/assets/doctors/arjun_verma.jpg" },
]

const loginOptions = [
  { label: "As Patient", path: "/login?role=patient" },
  { label: "As Doctor", path: "/login?role=doctor" },
  { label: "As Admin", path: "/login?role=admin" },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLoginOption = (path) => {
    setDropdownOpen(false)
    navigate(path)
  }

  const handleMainAction = () => navigate("/login")

  return (
    <div>
      {/* Navbar */}
      <nav className="lp-navbar">
        <div className="lp-logo">
          <span className="lp-logo-circle">H</span>
          <div className="lp-logo-text">
            <span className="lp-logo-title">DOCONNECT</span>
            <span className="lp-logo-sub">HEALTHCARE SERVICES</span>
          </div>
        </div>
        <ul className="lp-nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#specialties">Specialties</a></li>
          <li><a href="#doctors">Our Doctors</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="lp-navbar-right">
          <div className="lp-helpline-screenshot">
            <div className="lp-helpline-label-screenshot">24/7 HELPLINE</div>
            <div className="lp-helpline-row">
              <span className="lp-helpline-phone-screenshot">+91 93912 6XXXX</span>
              <span className="lp-helpline-icon-screenshot"><HelplinePhoneIcon /></span>
            </div>
          </div>
          <div className="lp-login-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="lp-login-btn-screenshot"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              Login / Sign Up <span className="lp-login-caret">▼</span>
            </button>
            {dropdownOpen && (
              <div className="lp-login-dropdown">
                {loginOptions.map((opt) => (
                  <div
                    key={opt.label}
                    className="lp-login-dropdown-item"
                    onClick={() => handleLoginOption(opt.path)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="lp-home-section lp-home-section-left" style={{ backgroundImage: 'url(/assets/background.jpg)' }}>
        <div className="lp-home-content lp-home-content-left lp-home-content-screenshot">
          <h1 className="lp-home-title">Your Health, Our Priority</h1>
         
          <p className="lp-home-desc">We prioritize your well-being with compassionate care, advanced solutions, and unwavering support for a healthier, happier, and empowered life.
          </p>
          <div className="lp-home-btns-screenshot">
            <button className="lp-home-btn-filled" onClick={handleMainAction}>Book Addmission</button>
            <button className="lp-home-btn-outline" onClick={handleMainAction}>Book Appointment</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="lp-about-section">
        <h2 className="lp-about-title">About DoConnect</h2>
        <div className="lp-about-underline"></div>
        <p className="lp-about-desc">Providing exceptional healthcare services with compassion and excellence since 1995.</p>
        <div className="lp-about-main-row">
          <div className="lp-about-img-col">
            <img src="/assets/image.jpg" alt="About DoConnect" className="lp-about-img" />
          </div>
          <div className="lp-about-content-col">
            <h3 className="lp-about-mission-title">Our Mission</h3>
            <p className="lp-about-mission-text">Our mission is to provide high-quality, compassionate healthcare services to our community. We strive to improve the health and well-being of our patients through innovative medical practices, cutting-edge technology, and a patient-centered approach.</p>
            <p className="lp-about-mission-text">We are committed to excellence in healthcare delivery, education, and research, ensuring that our patients receive the best possible care in a safe and supportive environment.</p>
            <h3 className="lp-about-values-title">Our Values</h3>
            <div className="lp-about-values-row">
              <div className="lp-about-value-card">
                <div className="lp-about-value-title">Excellence</div>
                <div className="lp-about-value-desc">Delivering the highest standard of care in everything we do.</div>
              </div>
              <div className="lp-about-value-card">
                <div className="lp-about-value-title">Compassion</div>
                <div className="lp-about-value-desc">Treating patients with kindness, empathy, and respect.</div>
              </div>
              <div className="lp-about-value-card">
                <div className="lp-about-value-title">Innovation</div>
                <div className="lp-about-value-desc">Embracing new technologies to improve patient care.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="lp-specialties-section">
        <h2 className="lp-specialties-title">Our Specialties</h2>
        <div className="lp-specialties-underline"></div>
        <p className="lp-specialties-desc">We offer a wide range of specialized medical services to meet all your healthcare needs.</p>
        <div className="lp-specialties-list">
          {specialties.map((spec) => (
            <button key={spec} onClick={handleMainAction}>{spec}</button>
          ))}
        </div>
      </section>

      {/* Our Doctors Section */}
      <section id="doctors" className="lp-doctors-section">
        <h2 className="lp-doctors-title">Our Doctors</h2>
        <div className="lp-doctors-underline"></div>
        <p className="lp-doctors-desc">Our team of highly qualified and experienced doctors is dedicated to providing exceptional care.</p>
        <div className="lp-doctors-grid">
          {doctors.map((doc) => (
            <div className="lp-doctor-card" key={doc.name}>
              <img src={doc.img} alt={doc.name} className="lp-doctor-img" />
              <div className="lp-doctor-info">
                <div className="lp-doctor-name">{doc.name}</div>
                <div className="lp-doctor-specialty">{doc.specialty}</div>
                <div className="lp-doctor-experience">Experience: {doc.experience}</div>
                <button className="lp-doctor-btn-outline" onClick={handleMainAction}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="lp-contact-section">
        <h2 className="lp-contact-title">Contact Us</h2>
        <div className="lp-contact-underline"></div>
        <p className="lp-contact-desc">We're here to help. Reach out to us with any questions or concerns.</p>
        <div className="lp-contact-main-row">
          <form className="lp-contact-card lp-contact-form-card" onSubmit={e => { e.preventDefault(); handleMainAction(); }}>
            <div className="lp-contact-form-title">Send Us a Message</div>
            <div className="lp-contact-form-row">
              <div className="lp-contact-form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="lp-contact-form-group">
                <label>Email</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
            </div>
            <div className="lp-contact-form-row">
              <div className="lp-contact-form-group">
                <label>Phone Number</label>
                <input type="text" placeholder="+91 98765 XXXXX" required />
              </div>
              <div className="lp-contact-form-group">
                <label>Subject</label>
                <input type="text" placeholder="Appointment Inquiry" required />
              </div>
            </div>
            <div className="lp-contact-form-group">
              <label>Message</label>
              <textarea placeholder="Please provide details about your inquiry..." rows="4" required></textarea>
            </div>
            <button type="submit" className="lp-contact-btn">Send Message</button>
          </form>
          <div className="lp-contact-card lp-contact-info-card">
            <div className="lp-contact-info-title">Contact Information</div>
            <div className="lp-contact-info-list">
              <div className="lp-contact-info-item"><span className="lp-contact-info-icon"><PhoneIcon /></span><div><b>Phone</b><br />+91 93912 6XXXX<br /><span className="lp-contact-info-sub">Mon-Sat, 8am-8pm</span></div></div>
              <div className="lp-contact-info-item"><span className="lp-contact-info-icon"><MailIcon /></span><div><b>Email</b><br />info@doconnect.com<br /><span className="lp-contact-info-sub">We'll respond as soon as possible</span></div></div>
              <div className="lp-contact-info-item"><span className="lp-contact-info-icon"><LocationIcon /></span><div><b>Address</b><br />123 Healthcare Street<br />City, State, 500001</div></div>
              <div className="lp-contact-info-item"><span className="lp-contact-info-icon"><ClockIcon /></span><div><b>Working Hours</b><br />24/7 Emergency Care<br />OPD: 8am-8pm (Mon-Sat)</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-cols">
          <div>
            <h4>About Us</h4>
            <p>Our Story</p>
            <p>Leadership</p>
            <p>Careers</p>
          </div>
          <div>
            <h4>Services</h4>
            <p>Specialties</p>
            <p>Appointments</p>
            <p>Emergency Care</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Phone: +91 93912 6XXXX</p>
            <p>Email: info@doconnect.com</p>
            <p>Address: 123 Healthcare Street, City</p>
          </div>
          
        </div>
        <div className="lp-footer-copy">© 2025 DoConnect Healthcare. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default LandingPage 