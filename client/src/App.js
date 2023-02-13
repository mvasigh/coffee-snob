import './App.css';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { Home, Location } from './pages';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/location/:zipCode" element={<Location />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function Layout() {
  return (
    <div className="Layout">
      <header>
        <Link to="/">
          <h1 className="Logo">☕️ Coffee Snob</h1>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="Footer">
        <p>
          Created with ☕️ by <a href="https://github.com/mvasigh">Mehdi Vasigh</a>,{' '}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
