import { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Blog from './pages/Blog';
import Books from './pages/Books';
import Category from './pages/Category';
import ChangePassword from './pages/ChangePassword';
import DashboardApp from './pages/DashboardApp';
//
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Products from './pages/Products';
import Register from './pages/Register';
import User2 from './pages/testUser';
import User from './pages/User';
import ProductDetailCard from './components/_dashboard/productDetail';
// ----------------------------------------------------------------------
export default function Router() {
  // eslint-disable-next-line
  const { store } = useContext(ReactReduxContext);
  const token = useSelector(() => store.getState().user.current.token);
  const isLoggeed = !!token;
  // console.log(Object.keys(store.getState().user.current).length !== 0);
  function checkRole() {
    const userCurrent = store.getState().user.current;
    if (Object.keys(userCurrent).length !== 0) {
      if (userCurrent.data.user.role[0] === 'normal') {
        return <Navigate to="/dashboard/products" replace />;
      }
    }
    return <Navigate to="/dashboard/app" replace />;
  }
  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggeed ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        {
          path: '/',
          element: <Navigate to="/dashboard/app" replace />
        },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'user2', element: <User2 /> },
        { path: 'category', element: <Category /> },
        {
          path: 'products',
          element: <Products />
        },
        {
          path: 'products/:id',
          element: <ProductDetailCard />
        },
        { path: 'books', element: <Books /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" replace /> },
        {
          path: 'login',
          element: !isLoggeed ? <Login /> : checkRole()
        },
        { path: 'register', element: <Register /> },
        { path: 'changepassword', element: <ChangePassword /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
