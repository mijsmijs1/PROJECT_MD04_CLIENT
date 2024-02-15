import React from 'react';
import "./footer.scss"
import { useTranslation } from 'react-i18next'
const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <div className='footer_container'>
        <div className="main-content">
          <div className="left box">
            <h2>{t('footer.aboutUs')}</h2>
            <div className="content">
              <p>CodingNepal is a YouTube channel where you can learn web designing, web development, ui/ux designing, html css tutorial</p>
              <div className="social">
                <a href="https://facebook.com/coding.np"><span className="fab fa-facebook-f"></span></a>
                <a href="#"><span className="fab fa-twitter"></span></a>
                <a href="https://instagram.com/coding.np"><span className="fab fa-instagram"></span></a>
              </div>
            </div>
          </div>

          <div className="center box">
            <h2>{t('footer.address')}</h2>
            <div className="content">
              <div className="place">
                <span className="fas fa-map-marker-alt"></span>
                <span className="text">Birendranagar, Surkhet</span>
              </div>
              <div className="email">
                <span className="fas fa-envelope"></span>
                <span className="text">abc@example.com</span>
              </div>
            </div>
          </div>

          <div className="right box">
            <h2>{t('footer.contactUs')}</h2>
            <div className="content">
              <div className="place">
                <span className="fas fa-map-marker-alt"></span>
                <span className="text">Birendranagar, Surkhet</span>
              </div>
              <div className="phone">
                <span className="fas fa-phone"></span>
                <span className="text">+0999999999</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <center>
            <span className="credit">Created By DevFL</span>
            <span className="far fa-copyright"></span><span> 2023 All rights reserved.</span>
          </center>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
