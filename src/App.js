import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Intro from './components/profile/intro';
import Form from './components/admin/form';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/profile/:id" element={<Intro />} />
        <Route path="*" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;