/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/meme_builder_ai.json`.
 */
export type MemeBuilderAi = {
  address: "BBzF2mZwMXBSDdt2n2VFKANreLob8DufeSFPCAvqHsFr";
  metadata: {
    name: "memeBuilderAi";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "contributeToTokenProposal";
      discriminator: [141, 232, 182, 155, 6, 64, 109, 159];
      accounts: [
        {
          name: "contribution";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  105,
                  111,
                  110,
                ];
              },
              {
                kind: "account";
                path: "tokenProposal";
              },
              {
                kind: "account";
                path: "signer";
              },
            ];
          };
        },
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProposal";
          writable: true;
        },
        {
          name: "user";
          writable: true;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "createTokenProposal";
      discriminator: [184, 177, 112, 165, 100, 128, 143, 66];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProposal";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108,
                ];
              },
              {
                kind: "account";
                path: "tokenProposalFactory";
              },
              {
                kind: "account";
                path: "signer";
              },
            ];
          };
        },
        {
          name: "tokenProposalFactory";
          writable: true;
        },
      ];
      args: [
        {
          name: "token";
          type: {
            defined: {
              name: "token";
            };
          };
        },
        {
          name: "selectedGoals";
          type: {
            defined: {
              name: "selectedGoals";
            };
          };
        },
        {
          name: "fundingGoals";
          type: {
            defined: {
              name: "fundingGoals";
            };
          };
        },
        {
          name: "softCap";
          type: "u32";
        },
        {
          name: "hardCap";
          type: "u32";
        },
        {
          name: "fundingModel";
          type: {
            defined: {
              name: "fundingModel";
            };
          };
        },
        {
          name: "airdropModules";
          type: {
            defined: {
              name: "airdropModules";
            };
          };
        },
        {
          name: "voting";
          type: {
            defined: {
              name: "voting";
            };
          };
        },
      ];
    },
    {
      name: "createUser";
      discriminator: [108, 227, 130, 130, 252, 109, 75, 218];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "account";
                path: "signer";
              },
            ];
          };
        },
      ];
      args: [];
    },
    {
      name: "initializeTokenProposalFactory";
      discriminator: [25, 24, 25, 127, 239, 178, 160, 123];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProposalFactory";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108,
                  95,
                  102,
                  97,
                  99,
                  116,
                  111,
                  114,
                  121,
                ];
              },
              {
                kind: "account";
                path: "signer";
              },
            ];
          };
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "contribution";
      discriminator: [182, 187, 14, 111, 72, 167, 242, 212];
    },
    {
      name: "tokenProposal";
      discriminator: [192, 42, 4, 79, 215, 17, 144, 39];
    },
    {
      name: "tokenProposalFactory";
      discriminator: [78, 247, 145, 137, 65, 41, 172, 119];
    },
    {
      name: "user";
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "tokenProposalAlreadyCompleted";
      msg: "The Token Proposal has already been completed.";
    },
    {
      code: 6001;
      name: "tokenProposalAlreadyFinalized";
      msg: "The Token Proposal has already been finalized.";
    },
    {
      code: 6002;
      name: "tokenProposalNotFinalized";
      msg: "The Token Proposal has not been finalized.";
    },
    {
      code: 6003;
      name: "tokenProposalNotReadyToBeFinalized";
      msg: "The Token Proposal is not ready to be finalized.";
    },
    {
      code: 6004;
      name: "userAlreadyVoted";
      msg: "The User has already voted on the Token Proposal.";
    },
    {
      code: 6005;
      name: "userNotOwner";
      msg: "The User is not the Owner of the Token Proposal.";
    },
  ];
  types: [
    {
      name: "airdropModules";
      type: {
        kind: "struct";
        fields: [
          {
            name: "dropScore";
            type: "bool";
          },
        ];
      };
    },
    {
      name: "contribution";
      type: {
        kind: "struct";
        fields: [
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "tokenProposalId";
            type: "pubkey";
          },
          {
            name: "userId";
            type: "pubkey";
          },
        ];
      };
    },
    {
      name: "fundingGoals";
      type: {
        kind: "struct";
        fields: [
          {
            name: "lp";
            type: "u32";
          },
          {
            name: "treasury";
            type: "u32";
          },
          {
            name: "kol";
            type: "u32";
          },
          {
            name: "ai";
            type: "u32";
          },
        ];
      };
    },
    {
      name: "fundingModel";
      type: {
        kind: "struct";
        fields: [
          {
            name: "dynamicUnlock";
            type: "bool";
          },
          {
            name: "endsEarlyOnHardCap";
            type: "bool";
          },
        ];
      };
    },
    {
      name: "selectedGoals";
      type: {
        kind: "struct";
        fields: [
          {
            name: "lp";
            type: "bool";
          },
          {
            name: "treasury";
            type: "bool";
          },
          {
            name: "kol";
            type: "bool";
          },
          {
            name: "ai";
            type: "bool";
          },
        ];
      };
    },
    {
      name: "token";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "logoUrl";
            type: "string";
          },
        ];
      };
    },
    {
      name: "tokenProposal";
      type: {
        kind: "struct";
        fields: [
          {
            name: "token";
            type: {
              defined: {
                name: "token";
              };
            };
          },
          {
            name: "selectedGoals";
            type: {
              defined: {
                name: "selectedGoals";
              };
            };
          },
          {
            name: "fundingGoals";
            type: {
              defined: {
                name: "fundingGoals";
              };
            };
          },
          {
            name: "softCap";
            type: "u32";
          },
          {
            name: "hardCap";
            type: "u32";
          },
          {
            name: "fundingModel";
            type: {
              defined: {
                name: "fundingModel";
              };
            };
          },
          {
            name: "airdropModules";
            type: {
              defined: {
                name: "airdropModules";
              };
            };
          },
          {
            name: "voting";
            type: {
              defined: {
                name: "voting";
              };
            };
          },
          {
            name: "amountContributed";
            type: "u64";
          },
          {
            name: "contributionCount";
            type: "u32";
          },
          {
            name: "readyToBeFinalized";
            type: "bool";
          },
          {
            name: "finalized";
            type: "bool";
          },
          {
            name: "completed";
            type: "bool";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "tokenProposalFactory";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tokenProposalIds";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "admin";
            type: "pubkey";
          },
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "contributionIds";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "totalContributions";
            type: "u64";
          },
        ];
      };
    },
    {
      name: "voting";
      type: {
        kind: "struct";
        fields: [
          {
            name: "periodDays";
            type: "u32";
          },
          {
            name: "voteUnit";
            type: "string";
          },
          {
            name: "escrowedFund";
            type: "bool";
          },
        ];
      };
    },
  ];
};
