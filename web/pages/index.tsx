import { getSession, getAccessToken,  GetServerSidePropsResultWithSession } from "@auth0/nextjs-auth0"
import type { GetServerSideProps, NextPage } from "next"

const Home: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res)
  const newToken = getAccessToken(req, res)
  console.log(newToken)

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/login",
        permanent: false,
      },
    }
  } else {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    }
  }
}

export default Home
