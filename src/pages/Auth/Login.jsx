// pages/auth/login.js
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

function Login() {
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

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
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" required />
        </label>
        <button type="submit">Log in</button>
      </form>
      <hr />
      <button onClick={() => signIn('google')}>Log in with Google</button>
    </div>
  );
}

export default Login;
