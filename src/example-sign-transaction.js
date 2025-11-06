/**
 * Example: Signing a Bitcoin transaction using bitcoinjs-lib
 *
 * This demo creates a dummy transaction, signs it using a random private key,
 * and prints both the raw transaction hex and the public address.
 */

import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';

const ECPair = ECPairFactory(tinysecp);

export function signExampleTx() {
  const keyPair = ECPair.makeRandom();
  const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

  // Create a fake transaction
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
  psbt.addInput({
    hash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    index: 0,
    witnessUtxo: {
      script: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }).output,
      value: 10_000,
    },
  });
  psbt.addOutput({
    address: address,
    value: 9_000,
  });

  // Sign & finalize
  psbt.signAllInputs(keyPair);
  psbt.finalizeAllInputs();

  const txHex = psbt.extractTransaction().toHex();
  console.log('Signed transaction (hex):', txHex);
  console.log('Sender address:', address);
  return txHex;
}

// Uncomment below for direct testing
// signExampleTx();
