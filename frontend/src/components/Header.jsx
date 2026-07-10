import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-block">
          <div className="brand-icon">C</div>
          <div>
            <h1 className="brand-title">CarLens</h1>
            <p className="brand-copy">Smart car model classification</p>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#about">About</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
