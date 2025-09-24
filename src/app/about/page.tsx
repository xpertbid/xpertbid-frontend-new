import Layout from '@/components/Layout';

export default function AboutPage() {
  return (
    <Layout>
      <div className="about-page">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h1 className="page-title mb-4">About WoodMart</h1>
              <div className="about-content">
                <p className="lead">
                  Welcome to WoodMart, your premier destination for modern furniture and home decor. 
                  We specialize in bringing you the finest collection of contemporary furniture pieces 
                  that blend style, functionality, and sustainability.
                </p>
                
                <h2>Our Story</h2>
                <p>
                  Founded in 2020, WoodMart began with a simple mission: to make high-quality, 
                  beautifully designed furniture accessible to everyone. We believe that great 
                  design should not only look amazing but also stand the test of time.
                </p>
                
                <h2>Our Commitment</h2>
                <p>
                  We are committed to sustainability and responsible sourcing. All our products 
                  are made from ethically sourced materials, and we work closely with artisans 
                  who share our values of quality and environmental responsibility.
                </p>
                
                <h2>Why Choose WoodMart?</h2>
                <ul>
                  <li>Premium quality materials and craftsmanship</li>
                  <li>Sustainable and ethically sourced products</li>
                  <li>Modern designs that complement any space</li>
                  <li>Excellent customer service and support</li>
                  <li>Fast and reliable shipping worldwide</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
