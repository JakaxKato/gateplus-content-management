import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/admin/protected-route';
import { AdminLayout } from './components/layout/admin-layout';
import { PublicLayout } from './components/layout/public-layout';
import { AdminContentListPage } from './pages/admin/admin-content-list-page';
import { ContentCreatePage } from './pages/admin/content-create-page';
import { ContentEditPage } from './pages/admin/content-edit-page';
import { LoginPage } from './pages/admin/login-page';
import { ContentDetailPage } from './pages/public/content-detail-page';
import { ContentListPage } from './pages/public/content-list-page';
import { NotFoundPage } from './pages/public/not-found-page';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/contents" replace />} />
        <Route path="/contents" element={<ContentListPage />} />
        <Route path="/contents/:id" element={<ContentDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/contents" replace />} />
        <Route path="contents" element={<AdminContentListPage />} />
        <Route path="contents/new" element={<ContentCreatePage />} />
        <Route path="contents/:id/edit" element={<ContentEditPage />} />
      </Route>
    </Routes>
  );
}
