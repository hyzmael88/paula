import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john.doe@example.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Aquí debes implementar la lógica para verificar las credenciales contra tu base de datos
        const user = { id: 1, name: "John Doe", email: "john.doe@example.com" }
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  // Configura las páginas de inicio de sesión, error, etc. (opcional)
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  // Añade más configuración según sea necesario
})