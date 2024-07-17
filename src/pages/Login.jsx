import { signIn } from 'next-auth/react';

function Login() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Inicia sesión con credenciales
    const result = await signIn('credentials', { redirect: false, email, password });
    if (!result.error) {
      // Redirige al usuario después del inicio de sesión exitoso
      window.location.href = '/';
    } else {
      // Manejar errores, como credenciales incorrectas
      console.error(result.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Iniciar sesión</button>
      </form>
      <button onClick={() => signIn('google')}>Iniciar sesión con Google</button>
    </div>
  );
}

export default Login;