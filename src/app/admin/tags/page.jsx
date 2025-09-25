export default function TagsPage() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="f-tags me-2"></i>
                Tags Management
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search tags..."
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="f-search"></i>
                    </button>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <button className="btn btn-primary">
                    <i className="f-plus me-2"></i>
                    Add New Tag
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Color</th>
                      <th>Products Count</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Electronics</td>
                      <td>electronics</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#007bff' }}>Electronics</span>
                      </td>
                      <td>25</td>
                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="f-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="f-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Fashion</td>
                      <td>fashion</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#28a745' }}>Fashion</span>
                      </td>
                      <td>18</td>
                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="f-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="f-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Home & Garden</td>
                      <td>home-garden</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#ffc107' }}>Home & Garden</span>
                      </td>
                      <td>12</td>
                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="f-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="f-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <nav aria-label="Tags pagination">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex={-1}>Previous</a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

