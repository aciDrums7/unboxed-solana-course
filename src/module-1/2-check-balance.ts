import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import 'dotenv/config'

try {
    // const publicKey = new PublicKey(process.env.PUBLIC_KEY!)
    const keysOfInterest: string[] = ['TONY_SOL', 'SHAQ_SOL', 'MCCAN_SOL']
    // const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed')
    keysOfInterest.forEach(async (address) => {
        try {
            const publicKey = new PublicKey(process.env[address]!)
            const balanceInLamports = await connection.getBalance(publicKey)
            const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL
            console.log(
                `\n💰 Finished! The balance for the wallet ${address} at address ${publicKey} is ${balanceInSOL}!`
            )
        } catch (error) {
            console.log(error)
        }
    })
} catch (error) {
    console.error(error)
}
