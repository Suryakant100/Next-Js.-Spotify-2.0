import React from "react";
import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen w-full">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
      {/* <h3 className="text-white">Login with</h3> */}
      {Object.values(providers).map((val) => {
        return (
          <>
            <div key={val.name}>
              <button
                className="bg-[#18D860] text-white p-5 rounded-full"
                onClick={() => signIn(val.id, { callbackUrl: "/" })}
              >
                Login with {val.name}
              </button>
            </div>
            ;
          </>
        );
      })}
    </div>
  );
}

export default login;
export async function getServerSideProps() {
  const providers = await getProviders();
  console.log(providers);
  return {
    props: {
      providers,
    },
  };
}
