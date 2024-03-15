
import './App.css';
import Post from './Post';
import Header from './Header';
import {Route, Routes} from 'react-router-dom'
import Layout from './Layout';
import {UserContextProvider} from "./UserContext";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index elements={<IndexPage />}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/create" element={<CreatePost />} />
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
