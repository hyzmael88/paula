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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">You are already signed in</h1>
        <button
          onClick={() => signOut()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">It must be a combination of minimum 8 letters, numbers, and symbols.</p>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Sign Up</button>
        </form>
        <hr className="my-6 w-full max-w-md" />
        <button
          onClick={() => signIn('google')}
          className="w-full max-w-md bg-white border border-gray-300 text-gray-700 py-2 rounded flex items-center justify-center"
        >
          <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5 mr-2" />
          Log in with Google
        </button>
        <p className="mt-6 text-center">
          Already have an account? <a href="/auth/login" className="text-blue-500">Log In</a>
        </p>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-pink-500">
        {/* You can add an image or any other content here */}
      </div>
    </div>
  );
}

export default Signup;
