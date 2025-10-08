import { Link, useLocation, useNavigate } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  function handleActiveMenu(paths: string[]) {
    if (paths.includes(location.pathname)) return "active";
    else return "";
  }

  function handleActiveLink(path: string) {
    if (location.pathname == path) return "active";
    else return "";
  }

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className={`nav-item ${handleActiveMenu(["/"])}`}>
          <Link className="nav-link" to="/">
            <i className="ti-shield menu-icon"></i>
            {/* <TfiDashboard className="menu-icon" /> */}
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li
          className={`nav-item ${handleActiveMenu([
            "/carousels",
            "/categoryShowcase",
            "/coupons",
          ])}`}
        >
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#setting"
            aria-expanded="false"
            aria-controls="setting"
          >
            <i className="ti-settings menu-icon"></i>
            <span className="menu-title">Setting</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="setting">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/carousels")}`}
                  to="/carousels"
                >
                  Carousel
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink(
                    "/categoryShowcase"
                  )}`}
                  to="/categoryShowcase"
                >
                  Category Showcase
                </Link>
              </li>
            </ul>
          </div>
        </li>

        <li className={`nav-item ${handleActiveMenu(["/media"])}`}>
          <Link className="nav-link" to="/media">
            <i className="ti-image menu-icon"></i>
            <span className="menu-title">Media</span>
          </Link>
        </li>

        {/* Blog */}
        <li
          className={`nav-item ${handleActiveMenu([
            "/blogCategories",
            "/authors",
            "/posts",
          ])}`}
        >
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#blog"
            aria-expanded="false"
            aria-controls="blog"
          >
            <i className="ti-layers menu-icon"></i>
            <span className="menu-title">Blog</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="blog">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/blogCategories")}`}
                  to="/blogCategories"
                >
                  Categories
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/authors")}`}
                  to="/authors"
                >
                  Authors
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/posts")}`}
                  to="/posts"
                >
                  Posts
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Categories */}
        <li
          className={`nav-item ${handleActiveMenu([
            "/categories",
            "/subCategories",
          ])}`}
        >
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#categories"
            aria-expanded="false"
            aria-controls="categories"
          >
            <i className="ti-layers menu-icon"></i>
            <span className="menu-title">Categories</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="categories">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/categories")}`}
                  to="/categories"
                >
                  Categories
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/subCategories")}`}
                  to="/subCategories"
                >
                  Sub Categories
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Promotions */}
        <li className={`nav-item ${handleActiveMenu(["/promotionTexts"])}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#promotions"
            aria-expanded="false"
            aria-controls="promotions"
          >
            <i className="ti-layers menu-icon"></i>
            <span className="menu-title">Promotions</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="promotions">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/promotionTexts")}`}
                  to="/promotionTexts"
                >
                  Promotion Text
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Pages */}
        <li className={`nav-item ${handleActiveMenu(["/homepage"])}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#pages"
            aria-expanded="false"
            aria-controls="pages"
          >
            <i className="ti-layers menu-icon"></i>
            <span className="menu-title">Pages</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="pages">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/homepage")}`}
                  to="/homepage"
                >
                  Home Page
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Orders */}
        {/* <li
          className={`nav-item ${handleActiveMenu([
            "/orders/falseOrders",
            "/orders",
          ])}`}
        >
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#orders"
            aria-expanded="false"
            aria-controls="orders"
          >
            <i className="ti-user menu-icon"></i>
            <span className="menu-title">Product Inquiry</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="orders">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/orders")}`}
                  to="/orders"
                >
                  Inquiry
                </Link>
              </li>
            </ul>
          </div>
        </li> */}

        {/* Inquiries */}
        <li
          className={`nav-item ${handleActiveMenu([
            "/newsletters",
            "/inquiries",
            "orders",
          ])}`}
        >
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#inquiries"
            aria-expanded="false"
            aria-controls="inquiries"
          >
            <i className="ti-email menu-icon"></i>
            <span className="menu-title">Inquiries</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="inquiries">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/orders")}`}
                  to="/orders"
                >
                  Product Inquiry
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/newsletters")}`}
                  to="/newsletters"
                >
                  Newsletter Emails
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/inquiries")}`}
                  to="/inquiries"
                >
                  Page Inquiry
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Products */}
        <li
          className={`nav-item ${handleActiveMenu([
            "/sizes",
            "/shapes",
            "/products",
          ])}`}
        >
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#products"
            aria-expanded="false"
            aria-controls="products"
          >
            <i className="ti-files menu-icon"></i>
            <span className="menu-title">Products</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="products">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/shapes")}`}
                  to="/shapes"
                >
                  Shapes
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/sizes")}`}
                  to="/sizes"
                >
                  Sizes
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${handleActiveLink("/products")}`}
                  to="/products"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="pages/charts/chartjs.html">
            <i className="ti-power-off menu-icon"></i>
            <span className="menu-title">Logout</span>
          </a>
        </li>

        {/* <li className="nav-item">
          <a className="nav-link" href="pages/charts/chartjs.html">
            <i className="ti-power-off menu-icon"></i>
            <span className="menu-title">Pages</span>
          </a>
        </li> */}
      </ul>
    </nav>
  );
}
