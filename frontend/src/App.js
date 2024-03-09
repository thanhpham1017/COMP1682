
import './App.css';
import Post from './Post';
import Header from './Header';
import {Route, Routes} from 'react-router-dom'
import Layout from './Layout';
import IndexPage from './Page/IndexPage';
import LoginPage from './Page/LoginPage';
import RegisterPage from './Page/RegisterPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index elements={<IndexPage />}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Route>
    </Routes>
    
  );
}

export default App;
