import './App.css';
import Header from "./components/header/Header";
import BodyContainer from "./components/bodyContainer/BodyContainer";
import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
<UserProvider>
    <div className="page">
    <Header/>
      <BodyContainer/>
    </div>
    </UserProvider>
    </Router>
    
  );
}

export default App;
