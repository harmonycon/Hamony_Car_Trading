
import React from 'react';
import './contacts.css'; 
import './styles.css';

function Contacts() {
  return (
    <section id="contact" class="section-p1">
        <h2>Contact Us</h2>
        <section id="newsletter" class="section-p1">
            <div class="newstext">
                <h4>Sign Up For Newsletters</h4>
                <p>Get E-mail updates about our latest cars and <span>special offers.</span>
                </p>
            </div>
            <div class="form">
                <input type="text" placeholder="Your email address"></input>
                    <button class="normal">Sign Up</button>
            </div>
        </section>
        <div class="contact-items">
            <div>
                <h6>Addres</h6>
                <p>600 Monterrey, Dublin</p>
            </div>
            <div>
                <h6>Phone</h6>
                <p>+353081111111</p>
            </div>
            <div>
                <h6>Email</h6>
                <p>customer-service@cartrader.com</p>
            </div>
            <div>
                <h6>Follow Us</h6>
                <div class="icon">
                    <i class="fab fa-facebook-f"></i>
                    <i class="fab fa-twitter"></i>
                    <i class="fab fa-instagram"></i>
                    <i class="fab fa-pinterest-p"></i>
                    <i class="fab fa-youtube"></i>
                </div>
                </div>
            </div>
            <p>@ 2024, HCM</p>
        </section>
        );
}

export default Contacts;