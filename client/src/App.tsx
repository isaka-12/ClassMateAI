
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './features/home/pages/HomePage';
import GenerateFlashcards from './features/flashcards/pages/GenerateFlashcards';
import NotFound from './components/common/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcards" element={<GenerateFlashcards />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;