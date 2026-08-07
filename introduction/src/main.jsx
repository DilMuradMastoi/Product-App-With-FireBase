import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./config/reduxconfig/store/store.js";
import './index.css';

import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Products from "./components/Products.jsx";
import Cart from "./components/Cart.jsx";
import ProductsDetails from "./components/ProductsDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={ <ProtectedRoute>
              <Products />
            </ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute>
              <Cart />
            </ProtectedRoute>} />
        <Route path="/products/:id" element={       <ProtectedRoute>
              <ProductsDetails />
            </ProtectedRoute> } />
             <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  </Provider>
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