import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './Contexts/app.contexts'
import { path } from './constants/path'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import ProductDetail from './pages/ProductDetail'
import ProductList from './pages/ProductList'
import Profile from './pages/User/pages/Profile'
import Register from './pages/Register'
import Cart from './pages/Cart'
import UserLayout from './pages/User/layouts/UserLayout'
import ChangePassword from './pages/User/pages/ChangePassword'
import HistoryPurchase from './pages/User/pages/HistoryPurchase'
import Payment from './pages/Payment'
import LayoutHeaderV2 from './layouts/LayoutHeaderV2'
import PaymentReturn from './pages/PaymentReturn'

const Login = lazy(() => import('./pages/Login'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Home Page
    {
      index: true,
      path: '/',
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    // Login - Register Page
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        },
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    // Product Detail
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    // Profile Page
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <LayoutHeaderV2 searchBar={true} namePage='Giỏ Hàng'>
              <Cart />
            </LayoutHeaderV2>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.changPassword,
              element: <ChangePassword />
            },
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        },
        {
          path: path.payment,
          element: (
            <LayoutHeaderV2 searchBar={false} namePage='Thanh Toán'>
              <Payment />
            </LayoutHeaderV2>
          )
        },
        {
          path: path.paymentReturn,
          element: (
            <LayoutHeaderV2 searchBar={false} namePage='Thanh Toán VNPAY'>
              <PaymentReturn />
            </LayoutHeaderV2>
          )
        }
      ]
    }
  ])
  return routeElements
}
