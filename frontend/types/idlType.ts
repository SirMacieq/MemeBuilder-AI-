/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/funded_token_proposal.json`.
 */
export type FundedTokenProposal = {
  "address": "Bwfn53i3zdqs8n9KqiZaphPgATv1LPdaNToXujFso9bD",
  "metadata": {
    "name": "fundedTokenProposal",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "contributeToTokenProposal",
      "discriminator": [
        141,
        232,
        182,
        155,
        6,
        64,
        109,
        159
      ],
      "accounts": [
        {
          "name": "contribution",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
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
                  110
                ]
              },
              {
                "kind": "account",
                "path": "tokenProposal"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProposal",
          "writable": true
        },
        {
          "name": "user",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTokenMint",
      "discriminator": [
        35,
        109,
        237,
        196,
        54,
        218,
        33,
        119
      ],
      "accounts": [
        {
          "name": "metadataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProposal",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createTokenProposal",
      "discriminator": [
        184,
        177,
        112,
        165,
        100,
        128,
        143,
        66
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
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
                  108
                ]
              },
              {
                "kind": "account",
                "path": "token_proposal_factory.token_proposal_count",
                "account": "tokenProposalFactory"
              }
            ]
          }
        },
        {
          "name": "tokenProposalFactory",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": {
            "defined": {
              "name": "proposalToken"
            }
          }
        },
        {
          "name": "selectedGoals",
          "type": {
            "defined": {
              "name": "selectedGoals"
            }
          }
        },
        {
          "name": "fundingGoals",
          "type": {
            "defined": {
              "name": "fundingGoals"
            }
          }
        },
        {
          "name": "softCap",
          "type": "u64"
        },
        {
          "name": "hardCap",
          "type": "u64"
        },
        {
          "name": "fundingModel",
          "type": {
            "defined": {
              "name": "fundingModel"
            }
          }
        },
        {
          "name": "airdropModules",
          "type": {
            "defined": {
              "name": "airdropModules"
            }
          }
        },
        {
          "name": "voting",
          "type": {
            "defined": {
              "name": "voting"
            }
          }
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "endTokenProposalVotingPeriod",
      "discriminator": [
        55,
        221,
        22,
        243,
        5,
        20,
        203,
        180
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
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
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "tokenProposalIndex"
              }
            ]
          }
        },
        {
          "name": "tokenProposalFactory",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "tokenProposalIndex",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeTokenProposalFactory",
      "discriminator": [
        25,
        24,
        25,
        127,
        239,
        178,
        160,
        123
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProposalFactory",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
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
                  121
                ]
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contribution",
      "discriminator": [
        182,
        187,
        14,
        111,
        72,
        167,
        242,
        212
      ]
    },
    {
      "name": "tokenProposal",
      "discriminator": [
        192,
        42,
        4,
        79,
        215,
        17,
        144,
        39
      ]
    },
    {
      "name": "tokenProposalFactory",
      "discriminator": [
        78,
        247,
        145,
        137,
        65,
        41,
        172,
        119
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "votingPeriodNotEndedYet",
      "msg": "The voting period on the Token Proposal has not ended yet."
    },
    {
      "code": 6001,
      "name": "votingPeriodAlreadyEnded",
      "msg": "The voting period on the Token Proposal has already ended."
    },
    {
      "code": 6002,
      "name": "votesAlreadyReachedHardCap",
      "msg": "The votes on the Token Proposal have already reached the hard cap."
    },
    {
      "code": 6003,
      "name": "userAlreadyVoted",
      "msg": "The User has already voted on the Token Proposal."
    }
  ],
  "types": [
    {
      "name": "airdropModules",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dropScore",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "contribution",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tokenProposalId",
            "type": "pubkey"
          },
          {
            "name": "userId",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "fundingGoals",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lp",
            "type": "u32"
          },
          {
            "name": "treasury",
            "type": "u32"
          },
          {
            "name": "kol",
            "type": "u32"
          },
          {
            "name": "ai",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "fundingModel",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dynamicUnlock",
            "type": "bool"
          },
          {
            "name": "endsEarlyOnHardCap",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "proposalToken",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "logoUrl",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "selectedGoals",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lp",
            "type": "bool"
          },
          {
            "name": "treasury",
            "type": "bool"
          },
          {
            "name": "kol",
            "type": "bool"
          },
          {
            "name": "ai",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "tokenProposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "token",
            "type": {
              "defined": {
                "name": "proposalToken"
              }
            }
          },
          {
            "name": "selectedGoals",
            "type": {
              "defined": {
                "name": "selectedGoals"
              }
            }
          },
          {
            "name": "fundingGoals",
            "type": {
              "defined": {
                "name": "fundingGoals"
              }
            }
          },
          {
            "name": "softCap",
            "type": "u64"
          },
          {
            "name": "hardCap",
            "type": "u64"
          },
          {
            "name": "fundingModel",
            "type": {
              "defined": {
                "name": "fundingModel"
              }
            }
          },
          {
            "name": "airdropModules",
            "type": {
              "defined": {
                "name": "airdropModules"
              }
            }
          },
          {
            "name": "voting",
            "type": {
              "defined": {
                "name": "voting"
              }
            }
          },
          {
            "name": "amountContributed",
            "type": "u64"
          },
          {
            "name": "contributionCount",
            "type": "u32"
          },
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "votingStartedAt",
            "type": "i64"
          },
          {
            "name": "votingEndedAt",
            "type": "i64"
          },
          {
            "name": "softCapReachedAt",
            "type": "i64"
          },
          {
            "name": "hardCapReachedAt",
            "type": "i64"
          },
          {
            "name": "passedAt",
            "type": "i64"
          },
          {
            "name": "rejectedAt",
            "type": "i64"
          },
          {
            "name": "tokenMintCreatedAt",
            "type": "i64"
          },
          {
            "name": "fundsReturnedAt",
            "type": "i64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokenProposalFactory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenProposalIds",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "tokenProposalCount",
            "type": "u32"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contributionIds",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "totalContributions",
            "type": "u64"
          },
          {
            "name": "votes",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "voting",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "periodDays",
            "type": "u32"
          },
          {
            "name": "voteUnit",
            "type": "string"
          },
          {
            "name": "escrowedFund",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
