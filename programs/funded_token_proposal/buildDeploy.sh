#! /bin/bash
# solana confi
anchor keys sync
anchor build
anchor deploy --provider.cluster devnet
