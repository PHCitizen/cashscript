export default {
  contractName: 'P2Palindrome',
  constructorInputs: [],
  abi: [
    {
      name: 'spend',
      inputs: [
        {
          name: 'palindrome',
          type: 'string',
        },
      ],
    },
  ],
  bytecode: 'OP_DUP OP_REVERSEBYTES OP_EQUAL',
  source: 'contract P2Palindrome() {\n    function spend(string palindrome) {\n        require(palindrome.reverse() == palindrome);\n    }\n}\n',
  debug: {
    bytecode: '0079bc517a87',
    sourceMap: '3:16:3:26;;:::36:1;:40::50:0;;:16:::1',
    logs: [],
    requires: [
      {
        ip: 6,
        line: 3,
      },
    ],
  },
  compiler: {
    name: 'cashc',
    version: '0.10.4',
  },
  updatedAt: '2024-12-03T13:57:08.710Z',
} as const;
