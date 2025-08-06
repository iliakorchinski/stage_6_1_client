import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/hello');
      const data = await response.json();
      console.log(data);
    };
    fetchData();
  }, []);

  return <h1>Client</h1>;
}

export default App;
