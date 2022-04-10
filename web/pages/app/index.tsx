import { getAccessToken, getSession, useUser } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"

export default function Home() {
  const { user } = useUser()

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <a href="/api/auth/login">login</a>
      <br />
      <a href="/api/auth/logout">logout</a>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res)
  const token = getAccessToken(req, res)
  console.log("a?", token)

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/login",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
