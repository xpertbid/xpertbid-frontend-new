export default function AdminDashboard() {
  return (
    <div className="row">
      {/* Stats Cards */}
      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card border-left-primary shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total Revenue
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">$54,000</div>
              </div>
              <div className="col-auto">
                <i className="f-dollar-sign fa-2x text-gray-300"></i>
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
                  Total Orders
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">1,250</div>
              </div>
              <div className="col-auto">
                <i className="f-shopping-cart fa-2x text-gray-300"></i>
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
                  Active Vendors
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">45</div>
              </div>
              <div className="col-auto">
                <i className="f-store fa-2x text-gray-300"></i>
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
                  Active Auctions
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">12</div>
              </div>
              <div className="col-auto">
                <i className="f-gavel fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="col-lg-8 mb-4">
        <div className="card shadow">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#12345</td>
                    <td>John Smith</td>
                    <td>$299.99</td>
                    <td><span className="badge bg-success">Completed</span></td>
                    <td>2024-01-15</td>
                  </tr>
                  <tr>
                    <td>#12346</td>
                    <td>Sarah Johnson</td>
                    <td>$149.50</td>
                    <td><span className="badge bg-warning">Processing</span></td>
                    <td>2024-01-15</td>
                  </tr>
                  <tr>
                    <td>#12347</td>
                    <td>Mike Wilson</td>
                    <td>$89.99</td>
                    <td><span className="badge bg-info">Shipped</span></td>
                    <td>2024-01-14</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-lg-4 mb-4">
        <div className="card shadow">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
          </div>
          <div className="card-body">
            <div className="d-grid gap-2">
              <a href="/admin/products/create" className="btn btn-primary">
                <i className="f-plus me-2"></i>
                Add New Product
              </a>
              <a href="/admin/auctions/create" className="btn btn-success">
                <i className="f-gavel me-2"></i>
                Create Auction
              </a>
              <a href="/admin/vendors/create" className="btn btn-info">
                <i className="f-store me-2"></i>
                Add Vendor
              </a>
              <a href="/admin/shipping/zones/create" className="btn btn-warning">
                <i className="f-globe me-2"></i>
                Add Shipping Zone
              </a>
              <a href="/admin/payment-gateways/create" className="btn btn-secondary">
                <i className="f-university me-2"></i>
                Add Payment Gateway
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Auctions */}
      <div className="col-lg-6 mb-4">
        <div className="card shadow">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Active Auctions</h6>
          </div>
          <div className="card-body">
            <div className="list-group">
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">iPhone 15 Pro Max</h6>
                  <small>Current Bid: $1,200</small>
                </div>
                <span className="badge bg-danger rounded-pill">2h 30m left</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">MacBook Pro 16-inch</h6>
                  <small>Current Bid: $2,500</small>
                </div>
                <span className="badge bg-warning rounded-pill">1d 5h left</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Designer Handbag</h6>
                  <small>Current Bid: $800</small>
                </div>
                <span className="badge bg-success rounded-pill">3d 12h left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Stats */}
      <div className="col-lg-6 mb-4">
        <div className="card shadow">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Affiliate Performance</h6>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-4">
                <div className="h4 text-primary">25</div>
                <small className="text-muted">Active Affiliates</small>
              </div>
              <div className="col-4">
                <div className="h4 text-success">$5,250</div>
                <small className="text-muted">Total Commissions</small>
              </div>
              <div className="col-4">
                <div className="h4 text-info">150</div>
                <small className="text-muted">Referrals</small>
              </div>
            </div>
            <hr />
            <div className="d-grid gap-2">
              <a href="/admin/affiliates" className="btn btn-outline-primary btn-sm">
                <i className="f-handshake me-1"></i>
                Manage Affiliates
              </a>
              <a href="/admin/affiliate/withdrawals" className="btn btn-outline-success btn-sm">
                <i className="f-money-bill-wave me-1"></i>
                Process Withdrawals
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

