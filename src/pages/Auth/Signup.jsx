// pages/auth/signup.js
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const name = event.target.name.value;

    try {
      const response = await axios.post('/api/auth/register', { email, password, name });

      if (response.status === 201) {
        // Automatically sign in the user after successful registration
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        });

        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
          window.location.href = '/';
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <h1>You are already signed in</h1>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" placeholder="Name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <hr />
      <button onClick={() => signIn('google')}>Log in with Google</button>
    </div>
  );
}

export default Signup;
