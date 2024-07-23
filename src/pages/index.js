import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {data:session,status} = useSession();
  return (
    <div>
      {
        session?

        <h1 className="text-3xl underline font-bold">
        Bienvenido {session.user.name}!
      </h1>
      :
      <h1 className="text-3xl underline font-bold">
        Hello World!
      </h1>
      }
    </div>
  );
}
