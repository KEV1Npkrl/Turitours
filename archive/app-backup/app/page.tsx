export const metadata = {
  title: "Tarapoto Tours - Descubre la Selva Peruana",
  description:
    "Plataforma de reservas turísticas en Tarapoto, San Martín. Explora cascadas, lagunas y la selva amazónica.",
}

export default function HomePage() {
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
            <a href="/" className="nav-link active">Inicio</a>
            <a href="/tours" className="nav-link">Tours</a>
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
            <a href="/tours" className="mobile-nav-link">Tours</a>
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

      <main>
        <section className="hero">
          <div className="hero-background">
            <img
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=80"
              alt="Selva amazónica"
              className="hero-image"
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="container hero-content">
            <h1 className="hero-title">Descubre la magia de Tarapoto</h1>
            <p className="hero-subtitle">Explora cascadas, lagunas y la selva amazónica con los mejores tours guiados</p>

            <form className="search-form" id="searchForm" action="/tours" method="GET">
              <div className="search-field">
                <label htmlFor="destino">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </label>
                <input type="text" id="destino" name="destino" placeholder="¿A dónde quieres ir?" autoComplete="off" />
              </div>

              <div className="search-field">
                <label htmlFor="fecha">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </label>
                <input type="date" id="fecha" name="fecha" />
              </div>

              <div className="search-field">
                <label htmlFor="personas">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </label>
                <select id="personas" name="personas">
                  <option value="">Personas</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5+ personas</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                Buscar
              </button>
            </form>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section-title">Explora por categoría</h2>
            <div className="categories-grid" id="categoriesGrid"></div>
          </div>
        </section>

