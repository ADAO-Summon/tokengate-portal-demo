import Secret from "@/components/secret"
import { getSecretData } from "./actions"

export default async function Home() {
  const data = await getSecretData()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
       <Secret data={data}/>
      </div>
    </main>
  )
}
