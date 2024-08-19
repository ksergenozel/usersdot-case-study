import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import EditUser from './pages/EditUser';
import UserList from './pages/UserList';
import AddNewUser from './pages/AddNewUser';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/users/:id" element={<EditUser />} />
      <Route path="/add-new-user" element={<AddNewUser />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>
  </Router>
);

export default App;
