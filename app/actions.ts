'use server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"

export async function checkLogin() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect('/api/auth/signin')
        return null
    }
    else return session
}

export async function getSecretData() {
    const session = await checkLogin()
    if (!session) return null

    return await getUsersPubkeyHash(session.accessToken)
}

async function getUsersPubkeyHash(access_token: string) {
    const res = await fetch('https://testnetapi.summonplatform.io/v1/oauth/userinfo', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    const json = await res.json()
    return json.stake_pubkey_hash_hex

}