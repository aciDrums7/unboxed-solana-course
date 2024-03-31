import { airdropIfRequired, getKeypairFromEnvironment } from '@solana-developers/helpers';
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import 'dotenv/config';

async function transferLamports() {
    const suppliedPubKey: string = process.argv[2];

    const cluster = process.env['CLUSTER_URL'];

    if (!suppliedPubKey) {
        console.error(`Please provide a public key to send to`);
        process.exit(1);
    }

    let toPubkey: PublicKey;
    try {
        toPubkey = new PublicKey(suppliedPubKey);
    } catch (error) {
        console.error(`Invalid public key provided:`, error);
        process.exit(1);
    }

    console.log(`The supplied public key is: `, toPubkey.toBase58());

    const senderKeypair: Keypair = getKeypairFromEnvironment('PRIVATE_KEY');
    const connection: Connection = new Connection(`${cluster}`, 'confirmed');

    console.log(
        `\n✅ Loaded our own keypair, the destination public key, and connected to Solana Cluster: ${cluster}`
    );

    const transaction = new Transaction();

    const LAMPORTS_TO_SEND = LAMPORTS_PER_SOL; // 1000 * LAMPORTS_PER_SOL

    const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey,
        lamports: LAMPORTS_TO_SEND,
    });

    transaction.add(sendSolInstruction);

    await airdropIfRequired(
        connection,
        senderKeypair.publicKey,
        1 * LAMPORTS_PER_SOL,
        0.5 * LAMPORTS_PER_SOL
    );

    await airdropIfRequired(connection, toPubkey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

    const balanceInLamports = await connection.getBalance(senderKeypair.publicKey);
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
    console.log(`\n💰 The balance for address ${senderKeypair.publicKey} is ${balanceInSOL}`);

    let signature;
    try {
        signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
    } catch (error) {
        console.error(`\n${error}`);
        process.exit(1);
    }

    console.log(`\n💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey} `);
    console.log(`\nTransaction signature is ${signature}`);
}
