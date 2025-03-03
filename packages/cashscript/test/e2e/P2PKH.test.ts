import { binToHex } from '@bitauth/libauth';
import {
  Contract, SignatureTemplate, MockNetworkProvider, ElectrumNetworkProvider,
  FailedRequireError,
} from '../../src/index.js';
import {
  bobAddress,
  bobPub,
  bobPriv,
  bobPkh,
  alicePriv,
  alicePub,
} from '../fixture/vars.js';
import { getTxOutputs } from '../test-util.js';
import { Network, Utxo } from '../../src/interfaces.js';
import {
  createOpReturnOutput, randomUtxo, utxoComparator,
} from '../../src/utils.js';
import artifact from '../fixture/p2pkh.json' with { type: 'json' };

describe('P2PKH-no-tokens', () => {
  let p2pkhInstance: Contract;

  const provider = process.env.TESTS_USE_MOCKNET
    ? new MockNetworkProvider()
    : new ElectrumNetworkProvider(Network.CHIPNET);

  beforeAll(() => {
    // Note: We instantiate the contract with bobPkh to avoid mempool conflicts with other (P2PKH tokens) tests
    p2pkhInstance = new Contract(artifact, [bobPkh], { provider });
    console.log(p2pkhInstance.tokenAddress);
    (provider as any).addUtxo?.(p2pkhInstance.address, randomUtxo({ satoshis: 10000000n }));
    (provider as any).addUtxo?.(p2pkhInstance.address, randomUtxo({ satoshis: 10000000n }));
  });

  describe('send', () => {
    it('should fail when using incorrect public key', async () => {
      // given
      const to = p2pkhInstance.address;
      const amount = 10000n;

      // when
      const txPromise = p2pkhInstance.functions
        .spend(alicePub, new SignatureTemplate(bobPriv))
        .to(to, amount)
        .send();

      // then
      await expect(txPromise).rejects.toThrow(FailedRequireError);
      await expect(txPromise).rejects.toThrow('P2PKH.cash:4 Require statement failed at input 0 in contract P2PKH.cash at line 4.');
      await expect(txPromise).rejects.toThrow('Failing statement: require(hash160(pk) == pkh)');
    });

    it('should fail when using incorrect signature', async () => {
      // given
      const to = p2pkhInstance.address;
      const amount = 10000n;

      // when
      const txPromise = p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(alicePriv))
        .to(to, amount)
        .send();

      // then
      await expect(txPromise).rejects.toThrow(FailedRequireError);
      await expect(txPromise).rejects.toThrow('P2PKH.cash:5 Require statement failed at input 0 in contract P2PKH.cash at line 5.');
      await expect(txPromise).rejects.toThrow('Failing statement: require(checkSig(s, pk))');
    });

    it('should succeed when using correct function arguments', async () => {
      // given
      const to = p2pkhInstance.address;
      const amount = 10000n;

      // when
      const tx = await p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .to(to, amount)
        .send();

      // then
      const txOutputs = getTxOutputs(tx);
      expect(txOutputs).toEqual(expect.arrayContaining([{ to, amount }]));
      expect(tx.txid).toBeDefined();
    });

    it('should fail when not enough satoshis are provided in utxos', async () => {
      // given
      const to = p2pkhInstance.address;
      const amount = 1000n;
      const utxos = (await p2pkhInstance.getUtxos()).sort(utxoComparator).reverse();
      const { utxos: gathered } = gatherUtxos(utxos, { amount });
      const failureAmount = gathered.reduce((acc, utxo) => acc + utxo.satoshis, 0n) + 1n;

      // when
      const txPromise = p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .from(gathered)
        .to(to, failureAmount)
        .send();

      // then
      await expect(txPromise).rejects.toThrow();
    });

    it('should succeed when providing UTXOs', async () => {
      // given
      const to = p2pkhInstance.address;
      const amount = 1000n;
      const utxos = (await p2pkhInstance.getUtxos()).sort(utxoComparator).reverse();
      const { utxos: gathered } = gatherUtxos(utxos, { amount });

      // when
      const receipt = await p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .from(gathered)
        .to(to, amount)
        .send();

      // then
      expect.hasAssertions();
      receipt.inputs.forEach((input) => {
        expect(gathered.find((utxo) => (
          utxo.txid === binToHex(input.outpointTransactionHash)
          && utxo.vout === input.outpointIndex
        ))).toBeTruthy();
      });
    });

    it('can call to() multiple times', async () => {
      // given
      const outputs = [
        { to: p2pkhInstance.address, amount: 10000n },
        { to: p2pkhInstance.address, amount: 20000n },
      ];

      // when
      const tx = await p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .to(outputs[0].to, outputs[0].amount)
        .to(outputs[1].to, outputs[1].amount)
        .send();

      // then
      const txOutputs = getTxOutputs(tx);
      expect(txOutputs).toEqual(expect.arrayContaining(outputs));
    });

    it('can send to list of recipients', async () => {
      // given
      const outputs = [
        { to: p2pkhInstance.address, amount: 10000n },
        { to: p2pkhInstance.address, amount: 20000n },
      ];

      // when
      const tx = await p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .to(outputs)
        .send();

      // then
      const txOutputs = getTxOutputs(tx);
      expect(txOutputs).toEqual(expect.arrayContaining(outputs));
    });

    it('can include OP_RETURN data as an output', async () => {
      // given
      const opReturn = ['0x6d02', 'Hello, World!', '0x01'];
      const to = p2pkhInstance.address;
      const amount = 10000n;

      // when
      const tx = await p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .to(to, amount)
        .withOpReturn(opReturn)
        .send();

      // then
      const txOutputs = getTxOutputs(tx);
      const expectedOutputs = [{ to, amount }, createOpReturnOutput(opReturn)];
      expect(txOutputs).toEqual(expect.arrayContaining(expectedOutputs));
    });

    it('can include UTXOs from P2PKH addresses', async () => {
      // given
      const to = bobAddress;
      const amount = 10000n;

      const contractUtxos = (await p2pkhInstance.getUtxos()).sort(utxoComparator).reverse();
      const bobUtxos = await provider.getUtxos(bobAddress);

      // when
      const tx = await p2pkhInstance.functions
        .spend(bobPub, new SignatureTemplate(bobPriv))
        .fromP2PKH(bobUtxos[0], new SignatureTemplate(bobPriv))
        .from(contractUtxos[0])
        .fromP2PKH(bobUtxos[1], new SignatureTemplate(bobPriv))
        .from(contractUtxos[1])
        .to(to, amount)
        .to(to, amount)
        .send();

      // then
      const txOutputs = getTxOutputs(tx);
      expect(txOutputs).toEqual(expect.arrayContaining([{ to, amount }]));
    });
  });
});

function gatherUtxos(
  utxos: Utxo[],
  options?: { amount?: bigint, fees?: bigint },
): { utxos: Utxo[], total: bigint } {
  const targetUtxos: Utxo[] = [];
  let total = 0n;

  // 1000 for fees
  const { amount = 0n, fees = 1000n } = options ?? {};

  for (const utxo of utxos) {
    if (total - fees > amount) break;
    total += utxo.satoshis;
    targetUtxos.push(utxo);
  }

  return {
    utxos: targetUtxos,
    total,
  };
}
