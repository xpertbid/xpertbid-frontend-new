export default function TaxManagement() {
  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Tax Management</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="f-download me-1"></i>
              Export
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="f-plus me-1"></i>
            Add Tax Rate
          </button>
        </div>
      </div>

      {/* Tax Overview Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Tax Classes
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">4</div>
                </div>
                <div className="col-auto">
                  <i className="f-layer-group fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Tax Rates
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">15</div>
                </div>
                <div className="col-auto">
                  <i className="f-percentage fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Countries Covered
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">8</div>
                </div>
                <div className="col-auto">
                  <i className="f-globe fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Tax Collected (MTD)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">$12,450</div>
                </div>
                <div className="col-auto">
                  <i className="f-calculator fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <a href="/admin/tax/classes" className="btn btn-outline-primary w-100">
                    <i className="f-layer-group fa-2x d-block mb-2"></i>
                    Tax Classes
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/tax/rates" className="btn btn-outline-success w-100">
                    <i className="f-percentage fa-2x d-block mb-2"></i>
                    Tax Rates
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100">
                    <i className="f-calculator fa-2x d-block mb-2"></i>
                    Tax Calculator
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100">
                    <i className="f-file-export fa-2x d-block mb-2"></i>
                    Tax Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Classes */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Tax Classes</h6>
            </div>
            <div className="card-body">
              <div className="list-group">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Standard Rate</h6>
                    <small>Standard tax rate for most products</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Reduced Rate</h6>
                    <small>Reduced tax rate for essential items</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Zero Rate</h6>
                    <small>Zero tax rate for exempt items</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Digital Products</h6>
                    <small>Tax rate for digital products and services</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Rates by Country */}
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Tax Rates by Country</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Rate</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><i className="f-flag-usa me-1"></i>United States</td>
                      <td>8.00%</td>
                      <td><span className="badge bg-info">Sales Tax</span></td>
                    </tr>
                    <tr>
                      <td><i className="f-flag me-1"></i>United Kingdom</td>
                      <td>20.00%</td>
                      <td><span className="badge bg-success">VAT</span></td>
                    </tr>
                    <tr>
                      <td><i className="f-flag me-1"></i>Germany</td>
                      <td>19.00%</td>
                      <td><span className="badge bg-success">VAT</span></td>
                    </tr>
                    <tr>
                      <td><i className="f-flag me-1"></i>France</td>
                      <td>20.00%</td>
                      <td><span className="badge bg-success">VAT</span></td>
                    </tr>
                    <tr>
                      <td><i className="f-flag me-1"></i>Australia</td>
                      <td>10.00%</td>
                      <td><span className="badge bg-warning">GST</span></td>
                    </tr>
                    <tr>
                      <td><i className="f-flag me-1"></i>Canada</td>
                      <td>5.00%</td>
                      <td><span className="badge bg-warning">GST</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calculator */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Tax Calculator</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <select className="form-select">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="AU">Australia</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">State/Province</label>
                    <select className="form-select">
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" placeholder="0.00" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tax Class</label>
                    <select className="form-select">
                      <option value="1">Standard Rate</option>
                      <option value="2">Reduced Rate</option>
                      <option value="3">Zero Rate</option>
                      <option value="4">Digital Products</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tax Inclusive</label>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">
                        Include tax in amount
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary">
                <i className="f-calculator me-1"></i>
                Calculate Tax
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

