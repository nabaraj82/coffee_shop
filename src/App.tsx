import { ToastContainer } from "react-toastify";
import Hero from "./components/hero/Hero";
const App = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <ToastContainer />
    </div>
  );
};

export default App;
