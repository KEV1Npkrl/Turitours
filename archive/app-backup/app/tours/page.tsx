export const metadata = {
  title: "Tours - Tarapoto Tours",
  description: "Explora todos nuestros tours en Tarapoto y la selva peruana",
}

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="header">
        <div className="container header-content">
          <a href="/" className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1l4.9 3.2-2.1 2.1-2.1-.4c-.4-.1-.8.1-1 .4l-.8.8 3.6 1.4 1.4 3.6.8-.8c.3-.3.5-.7.4-1l-.4-2.1 2.1-2.1 3.2 4.9c.2.4.7.5 1.1.3l.5-.3c.4-.2.6-.6.5-1.1z" />
            </svg>
            <span>Tarapoto Tours</span>
          </a>

          <nav className="nav-desktop">
            <a href="/" className="nav-link">Inicio</a>
            <a href="/tours" className="nav-link active">Tours</a>
            <a href="#destinos" className="nav-link">Destinos</a>
            <a href="#nosotros" className="nav-link">Nosotros</a>
            <a href="#contacto" className="nav-link">Contacto</a>
          </nav>

          <div className="header-actions">
            <a href="#" className="btn btn-outline">Iniciar Sesión</a>
            <a href="#" className="btn btn-primary">Registrarse</a>
          </div>

          <button className="menu-toggle" id="menuToggle" aria-label="Abrir menú" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mobile-menu" id="mobileMenu">
          <nav className="mobile-nav">
            <a href="/" className="mobile-nav-link active">Inicio</a>
            <a href="/tours" className="mobile-nav-link active">Tours</a>
            <a href="#destinos" className="mobile-nav-link">Destinos</a>
            <a href="#nosotros" className="mobile-nav-link">Nosotros</a>
            <a href="#contacto" className="mobile-nav-link">Contacto</a>
            <div className="mobile-auth">
              <a href="#" className="btn btn-outline btn-block">Iniciar Sesión</a>
              <a href="#" className="btn btn-primary btn-block">Registrarse</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="page-header">
        <div className="container">
          <nav className="breadcrumb">
            <a href="/">Inicio</a>
            <span>/</span>
            <span>Tours</span>
          </nav>
          <h1 className="page-title">Explora nuestros tours</h1>
        </div>
      </section>

