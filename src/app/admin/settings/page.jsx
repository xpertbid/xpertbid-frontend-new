export default function SettingsPage() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="f-cog me-2"></i>
                General Settings
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="siteName" className="form-label">Site Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="siteName" 
                        defaultValue="XpertBid"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="siteEmail" className="form-label">Site Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="siteEmail" 
                        defaultValue="admin@xpertbid.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="defaultCurrency" className="form-label">Default Currency</label>
                      <select className="form-select" id="defaultCurrency">
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="defaultLanguage" className="form-label">Default Language</label>
                      <select className="form-select" id="defaultLanguage">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="siteDescription" className="form-label">Site Description</label>
                  <textarea 
                    className="form-control" 
                    id="siteDescription" 
                    rows={3}
                    defaultValue="Professional multi-vendor marketplace with advanced auction management system"
                  ></textarea>
                </div>

                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="maintenanceMode" />
                  <label className="form-check-label" htmlFor="maintenanceMode">
                    Maintenance Mode
                  </label>
                </div>

                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="registrationEnabled" defaultChecked />
                  <label className="form-check-label" htmlFor="registrationEnabled">
                    Enable User Registration
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">
                  <i className="f-save me-2"></i>
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

