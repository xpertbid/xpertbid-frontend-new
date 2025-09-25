import Layout from '@/components/Layout';
import MyAccountPage from '@/components/MyAccountPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Account() {
  return (
    <Layout>
      <ProtectedRoute>
        <MyAccountPage />
      </ProtectedRoute>
    </Layout>
  );
}

