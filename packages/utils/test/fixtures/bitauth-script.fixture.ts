/* eslint-disable max-len */
import { LineToAsmMap, LineToOpcodesMap } from '@cashscript/utils';
import { Op } from '../../src/script.js';
import { hexToBin } from '@bitauth/libauth';

export interface Fixture {
  name: string;
  sourceCode: string;
  asmBytecode: string;
  sourceMap: string;
  expectedLineToOpcodeMap: LineToOpcodesMap;
  expectedLineToAsmMap: LineToAsmMap;
  expectedBitAuthScript: string;
}

export const fixtures: Fixture[] = [
  {
    name: 'TransferWithTimeout',
    sourceCode: `
contract TransferWithTimeout(bytes20 senderPkh, bytes20 recipientPkh, int timeout) {
  function transfer(pubkey signingPk, sig s) {
    require(checkSig(s, signingPk));
    require(hash160(signingPk) == recipientPkh);
  }

  function timeout(pubkey signingPk, sig s) {
    require(senderPkh == 0xdeadbeef);
    require(timeout == timeout);
    require(s == s);
    require(signingPk == signingPk);
    require(checkSig(s, signingPk));
    require(hash160(signingPk) == senderPkh);
    require(tx.time >= timeout);
  }
}`,
    asmBytecode: 'OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF OP_5 OP_ROLL OP_5 OP_PICK OP_CHECKSIG OP_VERIFY OP_4 OP_ROLL OP_HASH160 OP_2 OP_ROLL OP_EQUAL OP_NIP OP_NIP OP_NIP OP_ELSE OP_3 OP_ROLL OP_1 OP_NUMEQUAL OP_VERIFY OP_0 OP_PICK deadbeef OP_EQUAL OP_VERIFY OP_2 OP_PICK OP_3 OP_PICK OP_NUMEQUAL OP_VERIFY OP_4 OP_PICK OP_5 OP_PICK OP_EQUAL OP_VERIFY OP_3 OP_PICK OP_4 OP_PICK OP_EQUAL OP_VERIFY OP_4 OP_ROLL OP_4 OP_PICK OP_CHECKSIG OP_VERIFY OP_3 OP_ROLL OP_HASH160 OP_1 OP_ROLL OP_EQUAL OP_VERIFY OP_1 OP_ROLL OP_CHECKLOCKTIMEVERIFY OP_DROP OP_1 OP_NIP OP_ENDIF',
    sourceMap: '3:2:6:3;;;;;4:21:4:22;;:24::33;;:12::34;:4::36;5:20:5:29;;:12::30;:34::46;;:12;3:2:6:3:1;;;;8::16::0;;;;;9:12:9:21;;:25::35;:12;:4::37;10:12:10:19;;:23::30;;:12;:4::32;11:12:11:13;;:17::18;;:12;:4::20;12:12:12:21;;:25::34;;:12;:4::36;13:21:13:22;;:24::33;;:12::34;:4::36;14:20:14:29;;:12::30;:34::43;;:12;:4::45;15:23:15:30;;:4::32;;8:2:16:3:1;;',
    expectedLineToOpcodeMap: {
      3: [Op.OP_3, Op.OP_PICK, new Uint8Array([]), Op.OP_NUMEQUAL, Op.OP_IF],
      4: [Op.OP_5, Op.OP_ROLL, Op.OP_5, Op.OP_PICK, Op.OP_CHECKSIG, Op.OP_VERIFY],
      5: [Op.OP_4, Op.OP_ROLL, Op.OP_HASH160, Op.OP_2, Op.OP_ROLL, Op.OP_EQUAL],
      6: [Op.OP_NIP, Op.OP_NIP, Op.OP_NIP, Op.OP_ELSE],
      8: [Op.OP_3, Op.OP_ROLL, Op.OP_1, Op.OP_NUMEQUAL, Op.OP_VERIFY],
      9: [new Uint8Array([]), Op.OP_PICK, new Uint8Array([0xde, 0xad, 0xbe, 0xef]), Op.OP_EQUAL, Op.OP_VERIFY],
      10: [Op.OP_2, Op.OP_PICK, Op.OP_3, Op.OP_PICK, Op.OP_NUMEQUAL, Op.OP_VERIFY],
      11: [Op.OP_4, Op.OP_PICK, Op.OP_5, Op.OP_PICK, Op.OP_EQUAL, Op.OP_VERIFY],
      12: [Op.OP_3, Op.OP_PICK, Op.OP_4, Op.OP_PICK, Op.OP_EQUAL, Op.OP_VERIFY],
      13: [Op.OP_4, Op.OP_ROLL, Op.OP_4, Op.OP_PICK, Op.OP_CHECKSIG, Op.OP_VERIFY],
      14: [Op.OP_3, Op.OP_ROLL, Op.OP_HASH160, Op.OP_1, Op.OP_ROLL, Op.OP_EQUAL, Op.OP_VERIFY],
      15: [Op.OP_1, Op.OP_ROLL, Op.OP_CHECKLOCKTIMEVERIFY, Op.OP_DROP],
      16: [Op.OP_1, Op.OP_NIP, Op.OP_ENDIF],
    },
    expectedLineToAsmMap: {
      3: 'OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF',
      4: 'OP_5 OP_ROLL OP_5 OP_PICK OP_CHECKSIG OP_VERIFY',
      5: 'OP_4 OP_ROLL OP_HASH160 OP_2 OP_ROLL OP_EQUAL',
      6: 'OP_NIP OP_NIP OP_NIP OP_ELSE',
      8: 'OP_3 OP_ROLL OP_1 OP_NUMEQUAL OP_VERIFY',
      9: 'OP_0 OP_PICK <0xdeadbeef> OP_EQUAL OP_VERIFY',
      10: 'OP_2 OP_PICK OP_3 OP_PICK OP_NUMEQUAL OP_VERIFY',
      11: 'OP_4 OP_PICK OP_5 OP_PICK OP_EQUAL OP_VERIFY',
      12: 'OP_3 OP_PICK OP_4 OP_PICK OP_EQUAL OP_VERIFY',
      13: 'OP_4 OP_ROLL OP_4 OP_PICK OP_CHECKSIG OP_VERIFY',
      14: 'OP_3 OP_ROLL OP_HASH160 OP_1 OP_ROLL OP_EQUAL OP_VERIFY',
      15: 'OP_1 OP_ROLL OP_CHECKLOCKTIMEVERIFY OP_DROP',
      16: 'OP_1 OP_NIP OP_ENDIF',
    },
    expectedBitAuthScript: `
                                                        /*                                                                                      */
                                                        /* contract TransferWithTimeout(bytes20 senderPkh, bytes20 recipientPkh, int timeout) { */
OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF                     /*   function transfer(pubkey signingPk, sig s) {                                       */
OP_5 OP_ROLL OP_5 OP_PICK OP_CHECKSIG OP_VERIFY         /*     require(checkSig(s, signingPk));                                                 */
OP_4 OP_ROLL OP_HASH160 OP_2 OP_ROLL OP_EQUAL           /*     require(hash160(signingPk) == recipientPkh);                                     */
OP_NIP OP_NIP OP_NIP OP_ELSE                            /*   }                                                                                  */
                                                        /*                                                                                      */
OP_3 OP_ROLL OP_1 OP_NUMEQUAL OP_VERIFY                 /*   function timeout(pubkey signingPk, sig s) {                                        */
OP_0 OP_PICK <0xdeadbeef> OP_EQUAL OP_VERIFY            /*     require(senderPkh == 0xdeadbeef);                                                */
OP_2 OP_PICK OP_3 OP_PICK OP_NUMEQUAL OP_VERIFY         /*     require(timeout == timeout);                                                     */
OP_4 OP_PICK OP_5 OP_PICK OP_EQUAL OP_VERIFY            /*     require(s == s);                                                                 */
OP_3 OP_PICK OP_4 OP_PICK OP_EQUAL OP_VERIFY            /*     require(signingPk == signingPk);                                                 */
OP_4 OP_ROLL OP_4 OP_PICK OP_CHECKSIG OP_VERIFY         /*     require(checkSig(s, signingPk));                                                 */
OP_3 OP_ROLL OP_HASH160 OP_1 OP_ROLL OP_EQUAL OP_VERIFY /*     require(hash160(signingPk) == senderPkh);                                        */
OP_1 OP_ROLL OP_CHECKLOCKTIMEVERIFY OP_DROP             /*     require(tx.time >= timeout);                                                     */
OP_1 OP_NIP OP_ENDIF                                    /*   }                                                                                  */
                                                        /* }                                                                                    */
`.replace(/^\n+/, '').replace(/\n+$/, ''),
  },
  {
    // TODO: These fixtures were copied from the current output of the compiler, but there are some small inaccuracies that we should fix later
    name: 'Mecenas',
    sourceCode: `
pragma cashscript >=0.8.0;

/* This is an unofficial CashScript port of Licho's Mecenas contract. It is
 * not compatible with Licho's EC plugin, but rather meant as a demonstration
 * of covenants in CashScript.
 * The time checking has been removed so it can be tested without time requirements.
 */
contract Mecenas(bytes20 recipient, bytes20 funder, int pledge/*, int period */) {
    function receive() {
        // require(tx.age >= period);

        // Check that the first output sends to the recipient
        require(tx.outputs[0].lockingBytecode == new LockingBytecodeP2PKH(recipient));

        int minerFee = 1000;
        int currentValue = tx.inputs[this.activeInputIndex].value;
        int changeValue = currentValue - pledge - minerFee;

        // If there is not enough left for *another* pledge after this one, we send the remainder to the recipient
        // Otherwise we send the remainder to the recipient and the change back to the contract
        if (changeValue <= pledge + minerFee) {
            require(tx.outputs[0].value == currentValue - minerFee);
        } else {
            require(tx.outputs[0].value == pledge);
            require(tx.outputs[1].lockingBytecode == tx.inputs[this.activeInputIndex].lockingBytecode);
            require(tx.outputs[1].value == changeValue);
        }
    }

    function reclaim(pubkey pk, sig s) {
        require(hash160(pk) == funder);
        require(checkSig(s, pk));
    }
}`,
    asmBytecode: 'OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF OP_0 OP_OUTPUTBYTECODE 76a914 OP_2 OP_ROLL OP_CAT 88ac OP_CAT OP_EQUAL OP_VERIFY e803 OP_INPUTINDEX OP_UTXOVALUE OP_0 OP_PICK OP_4 OP_PICK OP_SUB OP_2 OP_PICK OP_SUB OP_0 OP_PICK OP_5 OP_PICK OP_4 OP_PICK OP_ADD OP_LESSTHANOREQUAL OP_IF OP_0 OP_OUTPUTVALUE OP_2 OP_PICK OP_4 OP_PICK OP_SUB OP_NUMEQUAL OP_VERIFY OP_ELSE OP_0 OP_OUTPUTVALUE OP_5 OP_PICK OP_NUMEQUAL OP_VERIFY OP_1 OP_OUTPUTBYTECODE OP_INPUTINDEX OP_UTXOBYTECODE OP_EQUAL OP_VERIFY OP_1 OP_OUTPUTVALUE OP_1 OP_PICK OP_NUMEQUAL OP_VERIFY OP_ENDIF OP_1 OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_ELSE OP_3 OP_ROLL OP_1 OP_NUMEQUAL OP_VERIFY OP_3 OP_PICK OP_HASH160 OP_2 OP_ROLL OP_EQUAL OP_VERIFY OP_3 OP_ROLL OP_3 OP_ROLL OP_CHECKSIG OP_NIP OP_NIP OP_ENDIF',
    sourceMap: '9:4:28:5;;;;;13:27:13:28;:16::45;:49::84;:74::83;;:49::84;;;:16:::1;:8::86;15:23:15:27:0;16:37:16:58;:27::65;17:26:17:38;;:41::47;;:26:::1;:50::58:0;;:26:::1;21:12:21:23:0;;:27::33;;:36::44;;:27:::1;:12;:46:23:9:0;22:31:22:32;:20::39;:43::55;;:58::66;;:43:::1;:20;:12::68;23:15:27:9;24:31:24:32:0;:20::39;:43::49;;:20:::1;:12::51;25:31:25:32:0;:20::49;:63::84;:53::101;:20:::1;:12::103;26:31:26:32:0;:20::39;:43::54;;:20:::1;:12::56;23:15:27:9;9:4:28:5;;;;;;;;30::33::0;;;;;31:24:31:26;;:16::27:1;:31::37:0;;:16:::1;:8::39;32:25:32:26:0;;:28::30;;:16::31:1;30:4:33:5;;8:0:34:1',
    expectedLineToOpcodeMap: {
      9: [Op.OP_3, Op.OP_PICK, new Uint8Array([]), Op.OP_NUMEQUAL, Op.OP_IF],
      13: [Op.OP_0, Op.OP_OUTPUTBYTECODE, hexToBin('76a914'), Op.OP_2, Op.OP_ROLL, Op.OP_CAT, hexToBin('88ac'), Op.OP_CAT, Op.OP_EQUAL, Op.OP_VERIFY],
      15: [hexToBin('e803')],
      16: [Op.OP_INPUTINDEX, Op.OP_UTXOVALUE],
      17: [Op.OP_0, Op.OP_PICK, Op.OP_4, Op.OP_PICK, Op.OP_SUB, Op.OP_2, Op.OP_PICK, Op.OP_SUB],
      21: [Op.OP_0, Op.OP_PICK, Op.OP_5, Op.OP_PICK, Op.OP_4, Op.OP_PICK, Op.OP_ADD, Op.OP_LESSTHANOREQUAL, Op.OP_IF],
      22: [Op.OP_0, Op.OP_OUTPUTVALUE, Op.OP_2, Op.OP_PICK, Op.OP_4, Op.OP_PICK, Op.OP_SUB, Op.OP_NUMEQUAL, Op.OP_VERIFY],
      24: [Op.OP_0, Op.OP_OUTPUTVALUE, Op.OP_5, Op.OP_PICK, Op.OP_NUMEQUAL, Op.OP_VERIFY],
      25: [Op.OP_1, Op.OP_OUTPUTBYTECODE, Op.OP_INPUTINDEX, Op.OP_UTXOBYTECODE, Op.OP_EQUAL, Op.OP_VERIFY],
      26: [Op.OP_1, Op.OP_OUTPUTVALUE, Op.OP_1, Op.OP_PICK, Op.OP_NUMEQUAL, Op.OP_VERIFY],
      27: [Op.OP_ELSE, Op.OP_ENDIF],
      28: [Op.OP_1, Op.OP_NIP, Op.OP_NIP, Op.OP_NIP, Op.OP_NIP, Op.OP_NIP, Op.OP_NIP, Op.OP_ELSE],
      30: [Op.OP_3, Op.OP_ROLL, Op.OP_1, Op.OP_NUMEQUAL, Op.OP_VERIFY],
      31: [Op.OP_3, Op.OP_PICK, Op.OP_HASH160, Op.OP_2, Op.OP_ROLL, Op.OP_EQUAL, Op.OP_VERIFY],
      32: [Op.OP_3, Op.OP_ROLL, Op.OP_3, Op.OP_ROLL, Op.OP_CHECKSIG],
      33: [Op.OP_NIP, Op.OP_NIP],
      34: [Op.OP_ENDIF],
    },
    expectedLineToAsmMap: {
      9: 'OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF',
      13: 'OP_0 OP_OUTPUTBYTECODE <0x76a914> OP_2 OP_ROLL OP_CAT <0x88ac> OP_CAT OP_EQUAL OP_VERIFY',
      15: '<0xe803>',
      16: 'OP_INPUTINDEX OP_UTXOVALUE',
      17: 'OP_0 OP_PICK OP_4 OP_PICK OP_SUB OP_2 OP_PICK OP_SUB',
      21: 'OP_0 OP_PICK OP_5 OP_PICK OP_4 OP_PICK OP_ADD OP_LESSTHANOREQUAL OP_IF',
      22: 'OP_0 OP_OUTPUTVALUE OP_2 OP_PICK OP_4 OP_PICK OP_SUB OP_NUMEQUAL OP_VERIFY',
      24: 'OP_0 OP_OUTPUTVALUE OP_5 OP_PICK OP_NUMEQUAL OP_VERIFY',
      25: 'OP_1 OP_OUTPUTBYTECODE OP_INPUTINDEX OP_UTXOBYTECODE OP_EQUAL OP_VERIFY',
      26: 'OP_1 OP_OUTPUTVALUE OP_1 OP_PICK OP_NUMEQUAL OP_VERIFY',
      27: 'OP_ELSE OP_ENDIF',
      28: 'OP_1 OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_ELSE',
      30: 'OP_3 OP_ROLL OP_1 OP_NUMEQUAL OP_VERIFY',
      31: 'OP_3 OP_PICK OP_HASH160 OP_2 OP_ROLL OP_EQUAL OP_VERIFY',
      32: 'OP_3 OP_ROLL OP_3 OP_ROLL OP_CHECKSIG',
      33: 'OP_NIP OP_NIP',
      34: 'OP_ENDIF',
    },
    expectedBitAuthScript: `
                                                                                             /*                                                                                                                    */
                                                                                             /* pragma cashscript >=0.8.0;                                                                                         */
                                                                                             /*                                                                                                                    */
                                                                                             /* /* This is an unofficial CashScript port of Licho's Mecenas contract. It is                                        */
                                                                                             /*  * not compatible with Licho's EC plugin, but rather meant as a demonstration                                      */
                                                                                             /*  * of covenants in CashScript.                                                                                     */
                                                                                             /*  * The time checking has been removed so it can be tested without time requirements.                               */
                                                                                             /*  */                                                                                                                */
    OP_3 OP_PICK OP_0 OP_NUMEQUAL OP_IF                                                      /* contract Mecenas(bytes20 recipient, bytes20 funder, int pledge/*, int period */) {                                 */
                                                                                             /*     function receive() {                                                                                           */
                                                                                             /*         // require(tx.age >= period);                                                                              */
                                                                                             /*                                                                                                                    */
    OP_0 OP_OUTPUTBYTECODE <0x76a914> OP_2 OP_ROLL OP_CAT <0x88ac> OP_CAT OP_EQUAL OP_VERIFY /*         // Check that the first output sends to the recipient                                                      */
                                                                                             /*         require(tx.outputs[0].lockingBytecode == new LockingBytecodeP2PKH(recipient));                             */
    <0xe803>                                                                                 /*                                                                                                                    */
    OP_INPUTINDEX OP_UTXOVALUE                                                               /*         int minerFee = 1000;                                                                                       */
    OP_0 OP_PICK OP_4 OP_PICK OP_SUB OP_2 OP_PICK OP_SUB                                     /*         int currentValue = tx.inputs[this.activeInputIndex].value;                                                 */
                                                                                             /*         int changeValue = currentValue - pledge - minerFee;                                                        */
                                                                                             /*                                                                                                                    */
                                                                                             /*         // If there is not enough left for *another* pledge after this one, we send the remainder to the recipient */
    OP_0 OP_PICK OP_5 OP_PICK OP_4 OP_PICK OP_ADD OP_LESSTHANOREQUAL OP_IF                   /*         // Otherwise we send the remainder to the recipient and the change back to the contract                    */
    OP_0 OP_OUTPUTVALUE OP_2 OP_PICK OP_4 OP_PICK OP_SUB OP_NUMEQUAL OP_VERIFY               /*         if (changeValue <= pledge + minerFee) {                                                                    */
                                                                                             /*             require(tx.outputs[0].value == currentValue - minerFee);                                               */
    OP_0 OP_OUTPUTVALUE OP_5 OP_PICK OP_NUMEQUAL OP_VERIFY                                   /*         } else {                                                                                                   */
    OP_1 OP_OUTPUTBYTECODE OP_INPUTINDEX OP_UTXOBYTECODE OP_EQUAL OP_VERIFY                  /*             require(tx.outputs[0].value == pledge);                                                                */
    OP_1 OP_OUTPUTVALUE OP_1 OP_PICK OP_NUMEQUAL OP_VERIFY                                   /*             require(tx.outputs[1].lockingBytecode == tx.inputs[this.activeInputIndex].lockingBytecode);            */
    OP_ELSE OP_ENDIF                                                                         /*             require(tx.outputs[1].value == changeValue);                                                           */
    OP_1 OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_NIP OP_ELSE                                   /*         }                                                                                                          */
                                                                                             /*     }                                                                                                              */
    OP_3 OP_ROLL OP_1 OP_NUMEQUAL OP_VERIFY                                                  /*                                                                                                                    */
    OP_3 OP_PICK OP_HASH160 OP_2 OP_ROLL OP_EQUAL OP_VERIFY                                  /*     function reclaim(pubkey pk, sig s) {                                                                           */
    OP_3 OP_ROLL OP_3 OP_ROLL OP_CHECKSIG                                                    /*         require(hash160(pk) == funder);                                                                            */
    OP_NIP OP_NIP                                                                            /*         require(checkSig(s, pk));                                                                                  */
    OP_ENDIF                                                                                 /*     }                                                                                                              */
                                                                                             /* }                                                                                                                  */
`,
  },
];