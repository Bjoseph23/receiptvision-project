import { useEffect } from 'react';
import supabase from './supabaseClient'; // Adjust path if necessary
import { useNavigate } from 'react-router-dom';

const OneTapComponent = () => {
  const navigate = useNavigate();

  // Generate nonce for extra security
  const generateNonce = async () => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return [nonce, hashedNonce];
  };

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      console.log('Initializing Google One Tap');
      window.addEventListener('load', async () => {
        const [nonce, hashedNonce] = await generateNonce();

        // Check if a session already exists
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session', error);
        }
        if (data.session) {
          navigate('/'); // Redirect if already logged in
          return;
        }

        /* global google */
        google.accounts.id.initialize({
          client_id: process.env.VITE_GOOGLE_CLIENT_ID, // Ensure this is in your .env file
          callback: async (response) => {
            try {
              // Log in with the ID token returned by Google
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              });

              if (error) throw error;
              console.log('Successfully logged in with Google One Tap');
              navigate('/dashboard'); // Redirect to home or a protected page
            } catch (error) {
              console.error('Error logging in with Google One Tap', error);
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true, // Chrome's FedCM prompt
        });

        google.accounts.id.prompt(); // Show the Google One-Tap UI
      });
    };

    initializeGoogleOneTap();
    return () => window.removeEventListener('load', initializeGoogleOneTap);
  }, [navigate]);

  return (
    <>
      {/* Standard script tag to load Google One Tap API */}
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;
