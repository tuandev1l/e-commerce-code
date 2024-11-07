import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
    <ToastContainer />
  </QueryClientProvider>
);
