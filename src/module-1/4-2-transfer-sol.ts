import { airdropIfRequired, getKeypairFromEnvironment } from '@solana-developers/helpers';
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemInstruction,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import 'dotenv/config';

export async function transferSol() {
    const sender: Keypair = getKeypairFromEnvironment('PRIVATE_KEY');

    const toPubkey = new PublicKey(
        process.env['PING_PROGRAM_DATA_ADDRESS'] || 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'
    );

    const instruction = SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey,
        lamports: 0.5 * LAMPORTS_PER_SOL,
    });

    const connection = new Connection(clusterApiUrl('devnet'));

    const transaction = new Transaction().add(instruction);

    await airdropIfRequired(connection, sender.publicKey, LAMPORTS_PER_SOL, LAMPORTS_PER_SOL);
    // await airdropIfRequired(connection, toPubkey, LAMPORTS_PER_SOL, LAMPORTS_PER_SOL);

    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);

    console.log(`✅ Transaction completed! Signature is ${signature}`);
}
