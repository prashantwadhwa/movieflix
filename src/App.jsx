import {
  BrowserRouter as Router,
} from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";

import AnimatedRoutes from "./components/AnimatedRoutes/AnimatedRoutes";

function App() {

  return (
    <Router>
      <Navigation />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
