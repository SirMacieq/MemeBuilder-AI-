// NPM Packages
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from 'assert';

const { BN } = anchor.default;
const { Keypair, PublicKey, SystemProgram } = anchor.web3;

// Constants
const LAMPORTS_PER_SOL = 1_000_000_000;
const PUBKEY_COUNT_MAX = 10_000;
const TIMESTAMP_TOLERANCE = 3; // Seconds
const TOKEN_PROPOSAL_FACTORY_TOKEN_PROPOSALS_MAX = 100;
const TOKEN_PROPOSAL_NAME_LENGTH_MAX = 50;
const TOKEN_PROPOSAL_SYMBOL_LENGTH_MAX = 3;
const TOKEN_PROPOSAL_DESCRIPTION_LENGTH_MAX = 255;
const TOKEN_PROPOSAL_LOGO_URL_LENGTH_MAX = 127;
const TOKEN_PROPOSAL_VOTING_VOTE_UNIT_LENGTH_MAX = 10;
const USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX = 100;
const VOTING_PERIOD_SECONDS = 5 * 24 * 60 * 60; // 5 days (fixed for MVP)

// Helpers
function getCurrentUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

describe("Funded Token Proposal", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FundedTokenProposal;

  // Admin
  const admin = provider.wallet;

  // User
  const user = Keypair.generate();

  // Generate new keypair to use as address for mint account.
  const mintKeypair = new Keypair();

  let contributionAccountId;
  let contributionBump;
  let initialTokenProposalFactoryTokenProposalCount;
  let tokenProposalAccount;
  let tokenProposalAccountId;
  let tokenProposalBump;
  let tokenProposalFactoryAccountId;
  let tokenProposalFactoryBump;
  let userAccountId;
  let userBump;

  before(async () => {
    /*
     * Airdrop to wallets.
     */
    // User
    await provider.connection.requestAirdrop(
      user.publicKey,
      LAMPORTS_PER_SOL
    );

    /*
     * Generate PDA for the Token Proposal Factory account:
     *
     * seeds = [
     *     b"token_proposal_factory".as_ref(),
     * ],
     */
    [tokenProposalFactoryAccountId, tokenProposalFactoryBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('token_proposal_factory'),
      ],
      program.programId,
    );

    /*
     * Generate PDA for a User account:
     *
     * seeds = [
     *     b"user".as_ref(),
     *     signer.key().as_ref(),
     * ],
     */
    [userAccountId, userBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('user'),
        admin.publicKey.toBytes(),
      ],
      program.programId,
    );

    /*
     * Generate PDA for a Token Proposal account:
     *
     * seeds=[
     *     b"token_proposal".as_ref(),
     *     token_proposal_factory.token_proposal_count.to_le_bytes().as_ref(),
     * ]
     */
    initialTokenProposalFactoryTokenProposalCount = 0;
    [tokenProposalAccountId, tokenProposalBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('token_proposal'),
        // Initial Token Proposal Factory's Token Proposal count
        new BN(initialTokenProposalFactoryTokenProposalCount)
          .toBuffer('le', 4),
      ],
      program.programId,
    );

    /*
     * Generate PDA for a Contribution account:
     *
     * seeds = [
     *     b"contribution".as_ref(),
     *     token_proposal.key().as_ref(),
     *     signer.key().as_ref(),
     * ],
     */
    [contributionAccountId, contributionBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('contribution'),
        tokenProposalAccountId.toBytes(),
        admin.publicKey.toBytes(),
      ],
      program.programId,
    );
  });

  let tokenProposalFactoryAccount;
  let currentUnixTimestamp;

  describe("Initialize Token Proposal Factory:", () => {
    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();

      const tx = await program.methods.initializeTokenProposalFactory()
        .accounts({
          signer: admin.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .rpc();

      // Wait for confirmation.
      await provider.connection.confirmTransaction(tx);

      tokenProposalFactoryAccount = await program.account.tokenProposalFactory
        .fetch(tokenProposalFactoryAccountId);
    });

    it("should create a Token Proposal Factory account.", async () => {
      assert.ok(tokenProposalFactoryAccount);
    });

    it("should set the Token Proposal Factory's admin to the admin.", async () => {
      assert.deepEqual(tokenProposalFactoryAccount.admin, admin.publicKey);
    });

    it("should set the Token Proposal Factory's Token Proposal IDs to an empty collection.", async () => {
      assert.deepEqual(tokenProposalFactoryAccount.tokenProposalIds, []);
    });

    it("should set the Token Proposal Factory's Token Proposal count to the zero.", async () => {
      assert.equal(tokenProposalFactoryAccount.tokenProposalCount, 0);
    });

    it("should set the Token Proposal Factory's created at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalFactoryAccount.createdAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the Token Proposal Factory's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalFactoryAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("Create User:", () => {
    let userAccount;

    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();

      const tx = await program.methods.createUser()
        .accounts({
          signer: admin.publicKey,
          //signer: user.publicKey,
          systemProgram: SystemProgram.programId,
          user: userAccountId,
        })
        .rpc();

      userAccount = await program.account.user
        .fetch(userAccountId);
    });

    it("should create a User account.", async () => {
      assert.ok(userAccount);
    });

    it("should set the User's Contribution IDs to an empty collection.", async () => {
      assert.deepEqual(userAccount.contributionIds, []);
    });

    it("should set the User's total contributions to zero.", async () => {
      assert.equal(userAccount.totalContributions, 0);
    });

    it("should set the User's created at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          userAccount.createdAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the User's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          userAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("Create Token Proposal:", () => {
    let airdropModules;
    let fundingGoals;
    let fundingModel;
    let hardCap;
    let selectedGoals;
    let softCap;
    let token;
    let voting;

    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();

      token = {
        name: "Test Token",
        symbol: 'TST',
        description: "Test Description",
        logoUrl: 'https://test.com/logo.png',
      };
      selectedGoals = {
        lp: false,
        treasury: false,
        kol: false,
        ai: false,
      };
      fundingGoals = {
        lp: 0,
        treasury: 0,
        kol: 0,
        ai: 0,
      };
      softCap = new BN(0),
      hardCap = new BN(10 * LAMPORTS_PER_SOL),
      fundingModel = {
        dynamicUnlock: false,
        endsEarlyOnHardCap: false,
      };
      airdropModules = {
        dropScore: false,
      };
      voting = {
        periodDays: 0,
        voteUnit: 'DAYS',
        escrowedFund: false
      };

      const tx = await program.methods.createTokenProposal(
        token,
        selectedGoals,
        fundingGoals,
        softCap,
        hardCap,
        fundingModel,
        airdropModules,
        voting,
      )
        .accounts({
          signer: admin.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: tokenProposalAccountId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .rpc();

      tokenProposalAccount = await program.account.tokenProposal
        .fetch(tokenProposalAccountId);
    });

    it("should create a Token Proposal account.", async () => {
      assert.ok(tokenProposalAccount);
    });

    it("should set the Token Proposal's index to zero.", async () => {
      assert.equal(tokenProposalAccount.index, 0);
    });

    it("should set the Token Proposal's owner to the user.", async () => {
      assert.deepEqual(tokenProposalAccount.owner, admin.publicKey);
    });

    it("should set the Token Proposal's token to the token.", async () => {
      assert.deepEqual(tokenProposalAccount.token, token);
    });

    it("should set the Token Proposal's selected goals to the selected goals.", async () => {
      assert.deepEqual(tokenProposalAccount.selectedGoals, selectedGoals);
    });

    it("should set the Token Proposal's selected goals to the funding goals.", async () => {
      assert.deepEqual(tokenProposalAccount.fundingGoals, fundingGoals);
    });

    it("should set the Token Proposal's soft cap to the soft cap.", async () => {
      assert.equal(tokenProposalAccount.softCap.toNumber(), softCap.toNumber());
    });

    it("should set the Token Proposal's hard cap to the hard cap.", async () => {
      assert.equal(tokenProposalAccount.hardCap.toNumber(), hardCap.toNumber());
    });

    it("should set the Token Proposal's funding model to the funding model.", async () => {
      assert.deepEqual(tokenProposalAccount.fundingModel, fundingModel);
    });

    it("should set the Token Proposal's airdrop modules to the airdrop modules.", async () => {
      assert.deepEqual(tokenProposalAccount.airdropModules, airdropModules);
    });

    it("should set the Token Proposal's voting to the voting.", async () => {
      assert.deepEqual(tokenProposalAccount.voting, voting);
    });

    it("should set the Token Proposal's amount contributed to zero.", async () => {
      assert.equal(tokenProposalAccount.amountContributed, 0);
    });

    it("should set the Token Proposal's contribution count to zero.", async () => {
      assert.equal(tokenProposalAccount.contributionCount, 0);
    });

    it("should set the Token Proposal's voting started at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalAccount.votingStartedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the Token Proposal's voting ended at to zero.", async () => {
      assert.equal(tokenProposalAccount.votingEndedAt.toNumber(), 0);
    });

    it("should set the Token Proposal's soft cap reached at to zero.", async () => {
      assert.equal(tokenProposalAccount.softCapReachedAt.toNumber(), 0);
    });

    it("should set the Token Proposal's hard cap reached at to zero.", async () => {
      assert.equal(tokenProposalAccount.hardCapReachedAt.toNumber(), 0);
    });

    it("should set the Token Proposal's passed at to zero.", async () => {
      assert.equal(tokenProposalAccount.passedAt.toNumber(), 0);
    });

    it("should set the Token Proposal's rejected at to zero.", async () => {
      assert.equal(tokenProposalAccount.rejectedAt.toNumber(), 0);
    });

    it("should set the Token Proposal's token mint created at to zero.", async () => {
      assert.equal(tokenProposalAccount.tokenMintCreatedAt.toNumber(), 0);
    });

    it("should set the Token Proposal's funds returned at to zero.", async () => {
      assert.equal(tokenProposalAccount.fundsReturnedAt.toNumber(), 0);
    });

    it("should not change the Token Proposal Factory's admin.", async () => {
      assert.deepEqual(tokenProposalFactoryAccount.admin, admin.publicKey);
    });

    it("should add the newly created Token Proposal ID to the Token Proposal Factory's Token Proposal IDs collection.", async () => {
      const updatedTokenProposalFactoryAccount = await program.account.tokenProposalFactory
        .fetch(tokenProposalFactoryAccountId);

      assert.deepEqual(updatedTokenProposalFactoryAccount.tokenProposalIds, [tokenProposalAccountId]);
    });

    it("should increment the Token Proposal Factory's Token Proposal count.", async () => {
      const updatedTokenProposalFactoryAccount = await program.account.tokenProposalFactory
        .fetch(tokenProposalFactoryAccountId);

      assert.equal(updatedTokenProposalFactoryAccount.tokenProposalCount, 1);
    });

    it("should set the Token Proposal's created at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalAccount.createdAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the Token Proposal's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the Token Proposal Factory's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalFactoryAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("Contribute to Token Proposal:", () => {
    let amount;
    let contributionAccount;
    let tokenProposalAccount;
    let userAccount;

    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();

      amount = new BN(100000000); // 0.1 SOL in lamports

      const tx = await program.methods.contributeToTokenProposal(amount)
        .accounts({
          contribution: contributionAccountId,
          signer: admin.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: tokenProposalAccountId,
          user: userAccountId,
        })
        .rpc();

      // Wait for confirmation.
      await provider.connection.confirmTransaction(tx);

      contributionAccount = await program.account.contribution
        .fetch(contributionAccountId);

      userAccount = await program.account.user
        .fetch(userAccountId);

      tokenProposalAccount = await program.account.tokenProposal
        .fetch(tokenProposalAccountId);
    });

    it("should create a Contribution account.", async () => {
      assert.ok(contributionAccount);
    });

    it("should set the Contribution's amount to the amount.", async () => {
      assert.equal(contributionAccount.amount.toNumber(), amount.toNumber());
    });

    it("should set the Contribution's Token Proposal ID to the Token Proposal ID.", async () => {
      assert.deepEqual(contributionAccount.tokenProposalId, tokenProposalAccountId);
    });

    it("should set the Contribution's User ID to the User ID.", async () => {
      assert.deepEqual(contributionAccount.userId, userAccountId);
    });

    it("should set the Contribution's created at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          contributionAccount.createdAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the Contribution's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          contributionAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should add the Contribution's amount to the Token Proposal's amount contributed.", async () => {
      assert.equal(tokenProposalAccount.amountContributed.toNumber(), amount.toNumber());
    });

    it("should increment the Token Proposal's contribution count.", async () => {
      assert.equal(tokenProposalAccount.contributionCount, 1);
    });

    it("should set the Token Proposal's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should add the newly created Contribution ID to the User's Contribution IDs collection.", async () => {
      const updatedUserAccount = await program.account.user
        .fetch(userAccountId);

      assert.deepEqual(updatedUserAccount.contributionIds, [contributionAccountId]);
    });

    it("should add the Contribution's amount to the User's total contributions.", async () => {
      assert.equal(userAccount.totalContributions.toNumber(), amount.toNumber());
    });

    it("should set the User's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          userAccount.updatedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("End Token Proposal's Voting Period:", () => {
    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();
      let tokenProposalAccountVotingEndedAt = currentUnixTimestamp
        + VOTING_PERIOD_SECONDS
        + TIMESTAMP_TOLERANCE;

      const tx = await program.methods.endTokenProposalVotingPeriod(
        initialTokenProposalFactoryTokenProposalCount
      )
        .accounts({
          signer: admin.publicKey,
          tokenProposal: tokenProposalAccountId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .rpc();

      tokenProposalAccount = await program.account.tokenProposal
        .fetch(tokenProposalAccountId);
    });

    it("should set the Token Proposal's voting ended at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalAccount.votingEndedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  /*
   * Works just on Devnet.
   */
  //describe("Create Token Mint:", () => {
  //  let transactionSignature;

  //  before(async () => {
  //    transactionSignature = await program.methods.createTokenMint()
  //      .accounts({
  //        mintAccount: mintKeypair.publicKey,
  //        payer: admin.publicKey,
  //        tokenProposal: tokenProposalAccountId,
  //      })
  //      .signers([mintKeypair])
  //      .rpc();

  //    console.log("Mint Address: ", mintKeypair.publicKey);
  //    console.log("Transaction Signature: ", transactionSignature);
  //  });

  //  it("should create a Token Mint", async () => {
  //    assert.ok(transactionSignature);
  //  });
  //});
});
