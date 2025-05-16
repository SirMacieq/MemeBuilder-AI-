#! /bin/bash
cp programs/funded_token_proposal/target/types/funded_token_proposal.ts frontend/types/idlType.ts
cp programs/funded_token_proposal/target/idl/funded_token_proposal.json frontend/idl.json
cp programs/funded_token_proposal/target/idl/funded_token_proposal.json backend/src/services/monitoring/idl.json
