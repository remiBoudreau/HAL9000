import "./footer.scss";

const Footer = () => {
  return (
    <footer id="footer" className="footer-container">
      <div className="copyright">
        &copy; Copyright {new Date().getFullYear()} &nbsp;
      </div>
      <a href="https://github.com/remiBoudreau" className="link-container">
        Jean-Michel Boudreau
      </a>
    </footer>
  );
};

export default Footer;