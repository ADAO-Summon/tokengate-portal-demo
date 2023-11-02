'use client'
import { useSession } from "next-auth/react"

export default function Secret({ data }: { data: string | null }) {
    const { status } = useSession()

    return <>
        {status === "loading" && <p>Loading...</p>}
        {status === "unauthenticated" && <p>Unauthenticated</p>}
        {status === "authenticated" && (
            <>
                <p>Authenticated</p>
                <pre>Data: {data}</pre>
            </>
        )}</>
}