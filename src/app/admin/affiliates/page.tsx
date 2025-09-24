export default function AffiliateManagement() {
  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Affiliate Management</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="fas fa-download me-1"></i>
              Export
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="fas fa-plus me-1"></i>
            Add Program
          </button>
        </div>
      </div>

      {/* Affiliate Stats */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Active Affiliates
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">25</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-handshake fa-2x text-gray-300"></i>
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
                    Total Commissions
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">$5,250</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-coins fa-2x text-gray-300"></i>
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
                    Total Referrals
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">150</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
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
                    Conversion Rate
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">12.5%</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-line fa-2x text-gray-300"></i>
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
                  <a href="/admin/affiliate/programs" className="btn btn-outline-primary w-100">
                    <i className="fas fa-project-diagram fa-2x d-block mb-2"></i>
                    Programs
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/affiliate/commissions" className="btn btn-outline-success w-100">
                    <i className="fas fa-coins fa-2x d-block mb-2"></i>
                    Commissions
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/affiliate/withdrawals" className="btn btn-outline-warning w-100">
                    <i className="fas fa-money-bill-wave fa-2x d-block mb-2"></i>
                    Withdrawals
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100">
                    <i className="fas fa-chart-bar fa-2x d-block mb-2"></i>
                    Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Programs */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Affiliate Programs</h6>
            </div>
            <div className="card-body">
              <div className="list-group">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">General Affiliate Program</h6>
                    <small>5% commission rate</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Electronics Affiliate Program</h6>
                    <small>8% commission rate</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Fashion Affiliate Program</h6>
                    <small>10% commission rate</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Premium Affiliate Program</h6>
                    <small>12% + $5 fixed</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Affiliates */}
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Top Affiliates</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Affiliate</th>
                      <th>Earnings</th>
                      <th>Referrals</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-circle me-2"></i>
                          <div>
                            <div className="fw-bold">John Smith</div>
                            <small className="text-muted">AFF123456</small>
                          </div>
                        </div>
                      </td>
                      <td>$1,250</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-circle me-2"></i>
                          <div>
                            <div className="fw-bold">Sarah Johnson</div>
                            <small className="text-muted">AFF789012</small>
                          </div>
                        </div>
                      </td>
                      <td>$980</td>
                      <td>18</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-circle me-2"></i>
                          <div>
                            <div className="fw-bold">Mike Wilson</div>
                            <small className="text-muted">AFF345678</small>
                          </div>
                        </div>
                      </td>
                      <td>$750</td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-circle me-2"></i>
                          <div>
                            <div className="fw-bold">Emily Davis</div>
                            <small className="text-muted">AFF901234</small>
                          </div>
                        </div>
                      </td>
                      <td>$620</td>
                      <td>12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Commissions</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Commission ID</th>
                      <th>Affiliate</th>
                      <th>Type</th>
                      <th>Order Amount</th>
                      <th>Commission</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#COM001</td>
                      <td>John Smith</td>
                      <td><span className="badge bg-primary">Order</span></td>
                      <td>$299.99</td>
                      <td>$14.99</td>
                      <td><span className="badge bg-success">Approved</span></td>
                      <td>2024-01-15</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-check"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#COM002</td>
                      <td>Sarah Johnson</td>
                      <td><span className="badge bg-info">Product</span></td>
                      <td>$149.50</td>
                      <td>$11.96</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>2024-01-15</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-check"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#COM003</td>
                      <td>Mike Wilson</td>
                      <td><span className="badge bg-success">Category</span></td>
                      <td>$89.99</td>
                      <td>$7.20</td>
                      <td><span className="badge bg-success">Paid</span></td>
                      <td>2024-01-14</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-receipt"></i>
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

      {/* Pending Withdrawals */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Pending Withdrawals</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Withdrawal ID</th>
                      <th>Affiliate</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Request Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#WD001</td>
                      <td>John Smith</td>
                      <td>$250.00</td>
                      <td><span className="badge bg-primary">PayPal</span></td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>2024-01-15</td>
                      <td>
                        <button className="btn btn-sm btn-outline-success me-1">
                          <i className="fas fa-check"></i>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-times"></i>
                          Reject
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#WD002</td>
                      <td>Sarah Johnson</td>
                      <td>$150.00</td>
                      <td><span className="badge bg-info">Bank Transfer</span></td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>2024-01-14</td>
                      <td>
                        <button className="btn btn-sm btn-outline-success me-1">
                          <i className="fas fa-check"></i>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-times"></i>
                          Reject
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
