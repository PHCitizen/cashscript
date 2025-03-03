export default {
  contractName: 'P2PKH',
  constructorInputs: [
    {
      name: 'pkh',
      type: 'bytes20',
    },
  ],
  abi: [
    {
      name: 'spend',
      inputs: [
        {
          name: 'pk',
          type: 'pubkey',
        },
        {
          name: 's',
          type: 'sig',
        },
      ],
    },
  ],
  bytecode: 'OP_OVER OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
  source: 'contract P2PKH(bytes20 pkh) {\n    // Require pk to match stored pkh and signature to match\n    function spend(pubkey pk, sig s) {\n        require(hash160(pk) == pkh);\n        require(checkSig(s, pk));\n    }\n}\n',
  debug: {
    bytecode: '5179a9517a8769517a517aac',
    sourceMap: '4:24:4:26;;:16::27:1;:31::34:0;;:16:::1;:8::36;5:25:5:26:0;;:28::30;;:16::31:1',
    logs: [],
    requires: [
      {
        ip: 7,
        line: 4,
      },
      {
        ip: 13,
        line: 5,
      },
    ],
  },
  compiler: {
    name: 'cashc',
    version: '0.10.4',
  },
  updatedAt: '2024-12-03T13:57:11.056Z',
} as const;
