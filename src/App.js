import './App.css';
import SelfSignedCert from './components/SelfSignedCert';
import ListCerts from './components/ListCerts';
import CSR from './components/CSR';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>List certificates</h2>
        <ListCerts />
        <h2>Create self signed certificate</h2>
        <SelfSignedCert />
        <h2>Create CSR</h2>
        <CSR />
      </header>
    </div>
  );
}

export default App;
