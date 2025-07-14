import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoanForm from './LoanForm';
import WelcomePage from './welcomepage';
import ErrorPage from './errorpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoanForm />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
