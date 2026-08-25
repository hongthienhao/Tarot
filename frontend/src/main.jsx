import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

// Block DevTools shortcuts and right-click
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12') e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j') e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') e.preventDefault();
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '934942203815-ktluiivcbv9ff4iukv0nhciurrb70mit.apps.googleusercontent.com'

// Lazy-load the root App so @react-oauth/google SDK doesn't block initial JS parse
// GoogleOAuthProvider is loaded in the same lazy chunk as App
const AppWithAuth = lazy(() => import('./AppWithAuth.jsx'))

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Suspense fallback={null}>
      <AppWithAuth googleClientId={GOOGLE_CLIENT_ID} />
    </Suspense>
  </BrowserRouter>
)
