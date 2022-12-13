import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CalculatorPage from './pages/calculator/CalculatorPage';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<CalculatorPage/>}/>
      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
