export type TatamiV2 = {
  "version": "0.1.0",
  "name": "tatami_v2",
  "constants": [
    {
      "name": "REALMS_ID",
      "type": "publicKey",
      "value": "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
    }
  ],
  "instructions": [
    {
      "name": "createConfig",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initProject",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamTokenAccount",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "teamWallet",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "recipients",
          "type": "u16"
        },
        {
          "name": "supply",
          "type": {
            "array": [
              "u64",
              2
            ]
          }
        }
      ]
    },
    {
      "name": "initializeDao",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilMint",
          "isMut": true,
          "isSigner": true,
          "isOptional": true
        },
        {
          "name": "realmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityTokenHolding",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "councilTokenHolding",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "realmConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nativeTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "realmProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "supply",
          "type": "u64"
        },
        {
          "name": "minVoteToGovern",
          "type": "u64"
        },
        {
          "name": "isCouncil",
          "type": "bool"
        },
        {
          "name": "quorum",
          "type": "u8"
        },
        {
          "name": "voteDuration",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeLp",
      "accounts": [],
      "args": []
    },
    {
      "name": "airdropTokens",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiver",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "burnAuthority",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "daoInit",
            "type": "bool"
          },
          {
            "name": "lpInit",
            "type": "bool"
          },
          {
            "name": "mintExist",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "recipients",
            "type": "u16"
          },
          {
            "name": "recipientsPaid",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NoCouncilTokenHolding",
      "msg": "council token holding account not provided"
    },
    {
      "code": 6001,
      "name": "InvalidQuorum",
      "msg": "quorum should be in the range of 1 and 100"
    },
    {
      "code": 6002,
      "name": "MaxRecipientsPaid",
      "msg": "max recipients has been paid out"
    }
  ]
};

export const IDL: TatamiV2 = {
  "version": "0.1.0",
  "name": "tatami_v2",
  "constants": [
    {
      "name": "REALMS_ID",
      "type": "publicKey",
      "value": "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw"
    }
  ],
  "instructions": [
    {
      "name": "createConfig",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initProject",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamTokenAccount",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "teamWallet",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "recipients",
          "type": "u16"
        },
        {
          "name": "supply",
          "type": {
            "array": [
              "u64",
              2
            ]
          }
        }
      ]
    },
    {
      "name": "initializeDao",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilMint",
          "isMut": true,
          "isSigner": true,
          "isOptional": true
        },
        {
          "name": "realmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityTokenHolding",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "councilTokenHolding",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "realmConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nativeTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "realmProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "supply",
          "type": "u64"
        },
        {
          "name": "minVoteToGovern",
          "type": "u64"
        },
        {
          "name": "isCouncil",
          "type": "bool"
        },
        {
          "name": "quorum",
          "type": "u8"
        },
        {
          "name": "voteDuration",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeLp",
      "accounts": [],
      "args": []
    },
    {
      "name": "airdropTokens",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiver",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "burnAuthority",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "daoInit",
            "type": "bool"
          },
          {
            "name": "lpInit",
            "type": "bool"
          },
          {
            "name": "mintExist",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "recipients",
            "type": "u16"
          },
          {
            "name": "recipientsPaid",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NoCouncilTokenHolding",
      "msg": "council token holding account not provided"
    },
    {
      "code": 6001,
      "name": "InvalidQuorum",
      "msg": "quorum should be in the range of 1 and 100"
    },
    {
      "code": 6002,
      "name": "MaxRecipientsPaid",
      "msg": "max recipients has been paid out"
    }
  ]
};
