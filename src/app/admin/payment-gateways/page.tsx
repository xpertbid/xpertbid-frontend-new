export default function PaymentGateways() {
  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Payment Gateways</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="fas fa-download me-1"></i>
              Export
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-primary">
            <i className="fas fa-plus me-1"></i>
            Add Gateway
          </button>
        </div>
      </div>

      {/* Payment Gateway Stats */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Active Gateways
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">8</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-university fa-2x text-gray-300"></i>
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
                    Total Transactions
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">2,450</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-credit-card fa-2x text-gray-300"></i>
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
                    Success Rate
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">98.5%</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-line fa-2x text-gray-300"></i>
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
                    Total Fees
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">$1,250</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateways Grid */}
      <div className="row mb-4">
        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/100x50/0070ba/ffffff?text=PayPal" 
                   className="mb-3" alt="PayPal" />
              <h5 className="card-title">PayPal</h5>
              <p className="card-text">Online payment processing</p>
              <div className="mb-3">
                <span className="badge bg-success me-1">Active</span>
                <span className="badge bg-info">Test Mode</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Fee: 2.9% + $0.30<br/>
                  Currencies: USD, EUR, GBP, CAD, AUD
                </small>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cog me-1"></i>
                  Configure
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/100x50/635bff/ffffff?text=Stripe" 
                   className="mb-3" alt="Stripe" />
              <h5 className="card-title">Stripe</h5>
              <p className="card-text">Payment processing platform</p>
              <div className="mb-3">
                <span className="badge bg-success me-1">Active</span>
                <span className="badge bg-info">Test Mode</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Fee: 2.9% + $0.30<br/>
                  Currencies: USD, EUR, GBP, CAD, AUD, JPY, CHF
                </small>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cog me-1"></i>
                  Configure
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/100x50/3395ff/ffffff?text=Razorpay" 
                   className="mb-3" alt="Razorpay" />
              <h5 className="card-title">Razorpay</h5>
              <p className="card-text">Payment gateway for India</p>
              <div className="mb-3">
                <span className="badge bg-success me-1">Active</span>
                <span className="badge bg-info">Test Mode</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Fee: 2.0%<br/>
                  Currencies: INR
                </small>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cog me-1"></i>
                  Configure
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/100x50/00d924/ffffff?text=Square" 
                   className="mb-3" alt="Square" />
              <h5 className="card-title">Square</h5>
              <p className="card-text">Payment processing</p>
              <div className="mb-3">
                <span className="badge bg-success me-1">Active</span>
                <span className="badge bg-info">Test Mode</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Fee: 2.6% + $0.10<br/>
                  Currencies: USD, CAD, GBP, AUD
                </small>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cog me-1"></i>
                  Configure
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/100x50/007aff/ffffff?text=Apple+Pay" 
                   className="mb-3" alt="Apple Pay" />
              <h5 className="card-title">Apple Pay</h5>
              <p className="card-text">Mobile payment service</p>
              <div className="mb-3">
                <span className="badge bg-success me-1">Active</span>
                <span className="badge bg-info">Test Mode</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Fee: 2.9% + $0.30<br/>
                  Currencies: USD, EUR, GBP, CAD, AUD
                </small>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cog me-1"></i>
                  Configure
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/100x50/4285f4/ffffff?text=Google+Pay" 
                   className="mb-3" alt="Google Pay" />
              <h5 className="card-title">Google Pay</h5>
              <p className="card-text">Digital wallet platform</p>
              <div className="mb-3">
                <span className="badge bg-success me-1">Active</span>
                <span className="badge bg-info">Test Mode</span>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  Fee: 2.9% + $0.30<br/>
                  Currencies: USD, EUR, GBP, CAD, AUD
                </small>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cog me-1"></i>
                  Configure
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <i className="fas fa-chart-bar me-1"></i>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Transactions</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Gateway</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>txn_123456789</td>
                      <td><span className="badge bg-primary">PayPal</span></td>
                      <td>$299.99</td>
                      <td><span className="badge bg-success">Completed</span></td>
                      <td>John Smith</td>
                      <td>2024-01-15 14:30</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-redo"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>txn_987654321</td>
                      <td><span className="badge bg-info">Stripe</span></td>
                      <td>$149.50</td>
                      <td><span className="badge bg-success">Completed</span></td>
                      <td>Sarah Johnson</td>
                      <td>2024-01-15 13:45</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-redo"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>txn_456789123</td>
                      <td><span className="badge bg-success">Square</span></td>
                      <td>$89.99</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>Mike Wilson</td>
                      <td>2024-01-15 12:20</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-redo"></i>
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
