export default function ShippingManagement() {
  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Shipping Management</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="fas fa-download me-1"></i>
              Export
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="fas fa-plus me-1"></i>
            Add Shipping Method
          </button>
        </div>
      </div>

      {/* Shipping Overview Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Active Zones
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">8</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-globe fa-2x text-gray-300"></i>
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
                    Shipping Methods
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">15</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-truck fa-2x text-gray-300"></i>
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
                    Active Carriers
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">5</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-plane fa-2x text-gray-300"></i>
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
                    Pickup Points
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">12</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-map-marker-alt fa-2x text-gray-300"></i>
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
                  <a href="/admin/shipping/zones" className="btn btn-outline-primary w-100">
                    <i className="fas fa-globe fa-2x d-block mb-2"></i>
                    Manage Zones
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/shipping/methods" className="btn btn-outline-success w-100">
                    <i className="fas fa-truck fa-2x d-block mb-2"></i>
                    Shipping Methods
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/shipping/carriers" className="btn btn-outline-info w-100">
                    <i className="fas fa-plane fa-2x d-block mb-2"></i>
                    Carriers
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/shipping/pickup-points" className="btn btn-outline-warning w-100">
                    <i className="fas fa-map-marker-alt fa-2x d-block mb-2"></i>
                    Pickup Points
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Methods Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Shipping Methods</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Zone</th>
                      <th>Type</th>
                      <th>Cost</th>
                      <th>Free Threshold</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Standard Shipping</td>
                      <td>United States</td>
                      <td><span className="badge bg-primary">Flat Rate</span></td>
                      <td>$9.99</td>
                      <td>$75.00</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Express Shipping</td>
                      <td>United States</td>
                      <td><span className="badge bg-primary">Flat Rate</span></td>
                      <td>$19.99</td>
                      <td>$150.00</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Overnight Shipping</td>
                      <td>United States</td>
                      <td><span className="badge bg-info">Carrier Based</span></td>
                      <td>$39.99</td>
                      <td>-</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
