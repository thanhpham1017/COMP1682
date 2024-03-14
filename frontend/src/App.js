
import './App.css';
import Post from './Post';
import Header from './Header';
import {Route, Routes} from 'react-router-dom'
import Layout from './Layout';
import {UserContextProvider} from "./UserContext";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index elements={<IndexPage />}/>
      </Route>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
