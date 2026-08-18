import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

// Redux Store
import { store } from "./config/reduxconfig/store/store.js";

// Styling
import "./index.css";

// Components & Pages
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Products from "./components/Products.jsx";
import Cart from "./components/Cart.jsx";
import ProductsDetails from "./components/ProductsDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Optional: Error Boundary class component to prevent blank screen crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Error inside Route Component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong loading this page.</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: "0.5rem 1rem", marginTop: "1rem", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected E-Commerce Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductsDetails />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


// // src/main.jsx
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./config/reduxconfig/store/store.js";
// import './index.css';

// import Login from "./components/Login.jsx";
// import Register from "./components/Register.jsx";
// import Products from "./components/Products.jsx";
// import ProductsDetails from "./components/ProductsDetails.jsx";
// import Cart from "./components/Cart.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Routes */}
//         <Route 
//           path="/products" 
//           element={
//             <ProtectedRoute>
//               <Products />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/products/:id" 
//           element={
//             <ProtectedRoute>
//               <ProductsDetails />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/cart" 
//           element={
//             <ProtectedRoute>
//               <Cart />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Default redirect */}
//         <Route path="*" element={<Navigate to="/products" replace />} />
//       </Routes>
//     </BrowserRouter>
//   </Provider>
// );