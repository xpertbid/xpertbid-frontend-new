import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse show" id="sidebarMenu">
            <div className="position-sticky pt-3">
              <div className="text-center mb-4">
                <h4 className="text-white">
                  <i className="f-tachometer-alt me-2"></i>
                  XpertBid Admin
                </h4>
              </div>
              
              <ul className="nav flex-column">
                {/* Dashboard */}
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin" style={{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }}>
                    <i className="f-tachometer-alt me-2"></i>
                    Dashboard (UPDATED)
                  </a>
                </li>

                {/* Products Dropdown */}
                <li className="nav-item">
                  <a 
                    className="nav-link text-white" 
                    data-bs-toggle="collapse" 
                    href="#productsCollapse" 
                    role="button" 
                    aria-expanded="false" 
                    aria-controls="productsCollapse"
                    style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)' }}
                  >
                    <i className="f-box me-2"></i>
                    Products (NEW STRUCTURE)
                    <i className="f-chevron-down ms-auto"></i>
                  </a>
                  <div className="collapse" id="productsCollapse">
                    <ul className="nav flex-column ms-3">
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/products">
                          <i className="f-box me-2"></i>
                          All Products
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/brands">
                          <i className="f-star me-2"></i>
                          Brands
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/tags">
                          <i className="f-tags me-2"></i>
                          Tags
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/categories">
                          <i className="f-layer-group me-2"></i>
                          Categories
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Properties */}
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin/properties" style={{ backgroundColor: 'rgba(0, 0, 255, 0.2)' }}>
                    <i className="f-home me-2"></i>
                    Properties (REORDERED)
                  </a>
                </li>

                {/* Vehicles */}
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin/vehicles">
                    <i className="f-car me-2"></i>
                    Vehicles
                  </a>
                </li>

                {/* Auction */}
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin/auctions">
                    <i className="f-gavel me-2"></i>
                    Auction
                  </a>
                </li>

                {/* Tenants */}
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin/tenants">
                    <i className="f-building me-2"></i>
                    Tenants
                  </a>
                </li>

                {/* Users */}
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin/users">
                    <i className="f-users me-2"></i>
                    Users
                  </a>
                </li>

                {/* Settings Dropdown */}
                <li className="nav-item">
                  <a 
                    className="nav-link text-white" 
                    data-bs-toggle="collapse" 
                    href="#settingsCollapse" 
                    role="button" 
                    aria-expanded="false" 
                    aria-controls="settingsCollapse"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <i className="f-cog me-2"></i>
                    Settings
                    <i className="f-chevron-down ms-auto"></i>
                  </a>
                  <div className="collapse" id="settingsCollapse">
                    <ul className="nav flex-column ms-3">
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/languages">
                          <i className="f-language me-2"></i>
                          Languages
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/currencies">
                          <i className="f-dollar-sign me-2"></i>
                          Currencies
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/shipping">
                          <i className="f-shipping-fast me-2"></i>
                          Shipping
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link text-white-50" href="/admin/tax">
                          <i className="f-calculator me-2"></i>
                          Vat & Tax
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>

              {/* User Profile Section */}
              <div className="mt-5 pt-3 border-top border-secondary">
                <div className="d-flex align-items-center text-white">
                  <div className="me-3">
                    <i className="f-user-circle fa-2x"></i>
                  </div>
                  <div>
                    <div className="fw-bold">Admin User</div>
                    <small className="text-muted">Super Administrator</small>
                  </div>
                </div>
                <div className="mt-3">
                  <a href="/logout" className="btn btn-outline-light btn-sm w-100">
                    <i className="f-sign-out-alt me-2"></i>
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary me-3 d-md-none" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#sidebarMenu" 
                  aria-controls="sidebarMenu" 
                  aria-expanded="false" 
                  aria-label="Toggle navigation"
                >
                  <i className="f-bars"></i>
                </button>
                <h1 className="h2">Dashboard</h1>
              </div>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary">
                    <i className="f-download me-1"></i>
                    Export
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-secondary">
                    <i className="f-print me-1"></i>
                    Print
                  </button>
                </div>
                <button type="button" className="btn btn-sm btn-primary">
                  <i className="f-plus me-1"></i>
                  Add New
                </button>
              </div>
            </div>
            
            {children}
          </main>
        </div>
      </div>
      
      {/* Ensure Bootstrap JS is loaded for dropdowns */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Initialize all collapse elements
              var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
              var collapseList = collapseElementList.map(function (collapseEl) {
                return new bootstrap.Collapse(collapseEl, {
                  toggle: false
                });
              });
              
              // Add click handlers for dropdown toggles
              document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function(element) {
                element.addEventListener('click', function(e) {
                  e.preventDefault();
                  var target = document.querySelector(this.getAttribute('href'));
                  if (target) {
                    var bsCollapse = new bootstrap.Collapse(target, {
                      toggle: true
                    });
                  }
                });
              });
            });
          `,
        }}
      />
    </div>
  );
}

