import { airdropIfRequired, getKeypairFromEnvironment } from '@solana-developers/helpers';
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
    clusterApiUrl,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import 'dotenv/config';

export async function incrementPingCounter() {
    const payer: Keypair = getKeypairFromEnvironment('PRIVATE_KEY');
    const connection = new Connection(clusterApiUrl('devnet'));

    const newBalance = await airdropIfRequired(
        connection,
        payer.publicKey,
        1 * LAMPORTS_PER_SOL,
        0.5 * LAMPORTS_PER_SOL
    );

    console.log(`The new sender balance is ${newBalance / LAMPORTS_PER_SOL} SOL`);

    const transaction = new Transaction();
    const pingProgramId = new PublicKey(
        process.env['PING_PROGRAM_ADDRESS'] || 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
    );
    const pingProgramDataId = new PublicKey(
        process.env['PING_PROGRAM_DATA_ADDRESS'] || 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'
    );

    const instruction = new TransactionInstruction({
        keys: [
            {
                pubkey: pingProgramDataId,
                isSigner: false,
                isWritable: true,
            },
        ],
        programId: pingProgramId,
    });

    transaction.add(instruction);

    let signature;

    try {
        console.log('Sending transaction, please wait');
        // TODO can u implement a spinner?
        // let interval = setInterval(() => process.stdout.write('.'), 1000);
        // signature = setInterval(
        //     async () => await sendAndConfirmTransaction(connection, transaction, [payer]),
        //     100000
        // );
        signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(`✅ Transaction completed! Signature is ${signature}`);
    process.exit(0);

    //? How can I see the code of the Program I've interacted with
}
