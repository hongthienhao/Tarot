import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

/**
 * AppWithAuth wraps App with GoogleOAuthProvider.
 * 
 * This file exists as a separate lazy-loaded module so that:
 * - @react-oauth/google is NOT in the initial JS bundle
 * - The Google Identity SDK only loads after the React tree is already painting
 * - Mobile devices don't have to parse the OAuth SDK before seeing any UI
 */
const AppWithAuth = ({ googleClientId }) => (
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
)

export default AppWithAuth
