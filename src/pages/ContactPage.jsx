import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Get in <span className="gradient-text">Touch</span></h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info-cards">
          <div className="contact-info-card">
            <div className="contact-info-icon"><FiMail size={24} /></div>
            <h3>Email Us</h3>
            <p>support@luxe.com</p>
            <span>We reply within 24 hours</span>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon"><FiPhone size={24} /></div>
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <span>Mon-Fri, 9am-6pm</span>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon"><FiMapPin size={24} /></div>
            <h3>Visit Us</h3>
            <p>123 Luxe Street</p>
            <span>Fashion City, FC 10001</span>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon"><FiClock size={24} /></div>
            <h3>Business Hours</h3>
            <p>Mon - Fri: 9am - 6pm</p>
            <span>Sat: 10am - 4pm</span>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send a Message</h2>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been received.'); }} id="contact-form">
            <div className="input-group">
              <input type="text" placeholder="Your Name" required id="contact-name" />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Your Email" required id="contact-email" />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Subject" required id="contact-subject" />
            </div>
            <div className="input-group">
              <textarea placeholder="Your Message" rows="5" required id="contact-message"></textarea>
            </div>
            <button type="submit" className="btn-primary btn-full" id="contact-submit">
              <FiSend size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
