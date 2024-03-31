import 'dotenv/config';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { Keypair } from '@solana/web3.js';

function generateKeypair() {
    const generatedKeypair = Keypair.generate();

    console.log(`\n✅ Generated keypair!`);
    console.log(`The generated public key is: `, generatedKeypair.publicKey.toBase58());
    console.log(`The generated private key is: `, uint8ArrayToHex(generatedKeypair.secretKey));

    function uint8ArrayToHex(uint8Array: Uint8Array) {
        return Array.from(uint8Array)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    const restoredKeypair = getKeypairFromEnvironment('PRIVATE_KEY');

    console.log(`\n✅ Finished! We've loaded our secret key securely, using an env file!`);
    console.log(`The restored public key is: `, restoredKeypair.publicKey.toBase58());
    console.log(`The restored private key is: `, uint8ArrayToHex(restoredKeypair.secretKey));
}
