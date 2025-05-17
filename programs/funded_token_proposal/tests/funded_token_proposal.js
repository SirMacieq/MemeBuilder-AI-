// NPM Packages
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from "assert";

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
  // Provider
  const provider = anchor.AnchorProvider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  // Program
  const program = anchor.workspace.FundedTokenProposal;

  // Admin
  const admin = provider.wallet;

  // User
  const user = Keypair.generate();

  // Users (Alice, Bob, Chris & Diana)
  const alice = Keypair.generate();
  const bob = Keypair.generate();
  const chris = Keypair.generate();
  const diana = Keypair.generate();

  // Generate new keypair to use as address for mint account.
  const mintKeypair = new Keypair();

  // Variables used/shared accross tests
  let aliceAccountId;
  let aliceContributionAccount;
  let aliceContributionAccountId;
  let aliceContributionAmount;
  let aliceTokenProposalAccount;
  let aliceTokenProposalAccountId;
  let aliceTokenProposalAccountSoftCapReachedAt;
  let aliceUserAccount;
  let bobAccountId;
  let bobContributionAccount;
  let bobContributionAccountId;
  let bobContributionAmount;
  let bobUserAccount;
  let chrisAccountId;
  let chrisContributionAccount;
  let chrisContributionAccountId;
  let chrisUserAccount;
  let contributionAccountId;
  let currentTokenProposalFactoryTokenProposalCount;
  let dianaAccountId;
  let dianaContributionAccount;
  let dianaContributionAccountId;
  let dianaUserAccount;
  let initialTokenProposalFactoryTokenProposalCount;
  let tokenProposalAccount;
  let tokenProposalAccountId;
  let tokenProposalFactoryAccountId;
  let userAccountId;

  before(async () => {
    /*
     * Airdrop to wallets.
     */
    // User
    await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL);

    // Alice
    await provider.connection.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL);

    // Bob
    await provider.connection.requestAirdrop(bob.publicKey, LAMPORTS_PER_SOL);

    // Chris
    await provider.connection.requestAirdrop(chris.publicKey, LAMPORTS_PER_SOL);

    // Diana
    await provider.connection.requestAirdrop(diana.publicKey, LAMPORTS_PER_SOL);

    /*
     * Generate PDA for the Token Proposal Factory account:
     *
     * seeds = [
     *     b"token_proposal_factory".as_ref(),
     * ],
     */
    [tokenProposalFactoryAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("token_proposal_factory")],
      program.programId
    );

    /*
     * Generate PDA for a User account:
     *
     * seeds = [
     *     b"user".as_ref(),
     *     signer.key().as_ref(),
     * ],
     */
    [userAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("user"), admin.publicKey.toBytes()],
      program.programId
    );

    /*
     * Users (Alice, Bob, Chris & Diana) accounts (PDAs)
     */
    // Alice
    [aliceAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("user"), alice.publicKey.toBytes()],
      program.programId
    );

    // Bob
    [bobAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("user"), bob.publicKey.toBytes()],
      program.programId
    );

    // Chris
    [chrisAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("user"), chris.publicKey.toBytes()],
      program.programId
    );

    // Diana
    [dianaAccountId] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("user"), diana.publicKey.toBytes()],
      program.programId
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
    [tokenProposalAccountId] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("token_proposal"),
        // Initial Token Proposal Factory's Token Proposal count
        new BN(initialTokenProposalFactoryTokenProposalCount).toBuffer("le", 4),
      ],
      program.programId
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
    [contributionAccountId] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("contribution"),
        tokenProposalAccountId.toBytes(),
        admin.publicKey.toBytes(),
      ],
      program.programId
    );

    /*
     * Generate PDA for Alice's Token Proposal account:
     *
     * seeds=[
     *     b"token_proposal".as_ref(),
     *     token_proposal_factory.token_proposal_count.to_le_bytes().as_ref(),
     * ]
     */
    currentTokenProposalFactoryTokenProposalCount =
      initialTokenProposalFactoryTokenProposalCount + 1;
    [aliceTokenProposalAccountId] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("token_proposal"),
        // Current Token Proposal Factory's Token Proposal count
        new BN(currentTokenProposalFactoryTokenProposalCount).toBuffer("le", 4),
      ],
      program.programId
    );

    // Generate PDA for Alice's Contribution account.
    [aliceContributionAccountId] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("contribution"),
        aliceTokenProposalAccountId.toBytes(),
        alice.publicKey.toBytes(),
      ],
      program.programId
    );

    // Generate PDA for Bob's Contribution account.
    [bobContributionAccountId] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("contribution"),
        aliceTokenProposalAccountId.toBytes(),
        bob.publicKey.toBytes(),
      ],
      program.programId
    );

    // Generate PDA for Chris's Contribution account.
    [chrisContributionAccountId] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("contribution"),
        aliceTokenProposalAccountId.toBytes(),
        chris.publicKey.toBytes(),
      ],
      program.programId
    );
  });

  let tokenProposalFactoryAccount;
  let currentUnixTimestamp;

  describe("Initialize Token Proposal Factory:", () => {
    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();

      const tx = await program.methods
        .initializeTokenProposalFactory()
        .accounts({
          signer: admin.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .rpc();

      // Wait for confirmation.
      await provider.connection.confirmTransaction(tx);

      tokenProposalFactoryAccount =
        await program.account.tokenProposalFactory.fetch(
          tokenProposalFactoryAccountId
        );
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
          tokenProposalFactoryAccount.createdAt.toNumber() -
            currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set the Token Proposal Factory's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalFactoryAccount.updatedAt.toNumber() -
            currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("Create User:", () => {
    let userAccount;

    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();

      const tx = await program.methods
        .createUser()
        .accounts({
          signer: admin.publicKey,
          //signer: user.publicKey,
          systemProgram: SystemProgram.programId,
          user: userAccountId,
        })
        .rpc();

      userAccount = await program.account.user.fetch(userAccountId);
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
        Math.abs(userAccount.createdAt.toNumber() - currentUnixTimestamp) <=
          TIMESTAMP_TOLERANCE
      );
    });

    it("should set the User's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(userAccount.updatedAt.toNumber() - currentUnixTimestamp) <=
          TIMESTAMP_TOLERANCE
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
        symbol: "TST",
        description: "Test Description",
        logoUrl: "https://test.com/logo.png",
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
      softCap = new BN(0);
      hardCap = new BN(10 * LAMPORTS_PER_SOL);
      fundingModel = {
        dynamicUnlock: false,
        endsEarlyOnHardCap: false,
      };
      airdropModules = {
        dropScore: false,
      };
      voting = {
        periodDays: 0,
        voteUnit: "DAYS",
        escrowedFund: false,
      };

      const tx = await program.methods
        .createTokenProposal(
          token,
          selectedGoals,
          fundingGoals,
          softCap,
          hardCap,
          fundingModel,
          airdropModules,
          voting
        )
        .accounts({
          signer: admin.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: tokenProposalAccountId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .rpc();

      tokenProposalAccount = await program.account.tokenProposal.fetch(
        tokenProposalAccountId
      );
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
      const updatedTokenProposalFactoryAccount =
        await program.account.tokenProposalFactory.fetch(
          tokenProposalFactoryAccountId
        );

      assert.deepEqual(updatedTokenProposalFactoryAccount.tokenProposalIds, [
        tokenProposalAccountId,
      ]);
    });

    it("should increment the Token Proposal Factory's Token Proposal count.", async () => {
      const updatedTokenProposalFactoryAccount =
        await program.account.tokenProposalFactory.fetch(
          tokenProposalFactoryAccountId
        );

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
          tokenProposalFactoryAccount.updatedAt.toNumber() -
            currentUnixTimestamp
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

      const tx = await program.methods
        .contributeToTokenProposal(amount)
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

      contributionAccount = await program.account.contribution.fetch(
        contributionAccountId
      );

      userAccount = await program.account.user.fetch(userAccountId);

      tokenProposalAccount = await program.account.tokenProposal.fetch(
        tokenProposalAccountId
      );
    });

    it("should create a Contribution account.", async () => {
      assert.ok(contributionAccount);
    });

    it("should set the Contribution's amount to the amount.", async () => {
      assert.equal(contributionAccount.amount.toNumber(), amount.toNumber());
    });

    it("should set the Contribution's Token Proposal ID to the Token Proposal ID.", async () => {
      assert.deepEqual(
        contributionAccount.tokenProposalId,
        tokenProposalAccountId
      );
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
      assert.equal(
        tokenProposalAccount.amountContributed.toNumber(),
        amount.toNumber()
      );
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
      const updatedUserAccount = await program.account.user.fetch(
        userAccountId
      );

      assert.deepEqual(updatedUserAccount.contributionIds, [
        contributionAccountId,
      ]);
    });

    it("should add the Contribution's amount to the User's total contributions.", async () => {
      assert.equal(
        userAccount.totalContributions.toNumber(),
        amount.toNumber()
      );
    });

    it("should set the User's updated at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(userAccount.updatedAt.toNumber() - currentUnixTimestamp) <=
          TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("End Token Proposal's Voting Period:", () => {
    before(async () => {
      currentUnixTimestamp = getCurrentUnixTimestamp();
      let tokenProposalAccountVotingEndedAt =
        currentUnixTimestamp + VOTING_PERIOD_SECONDS + TIMESTAMP_TOLERANCE;

      const tx = await program.methods
        .endTokenProposalVotingPeriod(
          initialTokenProposalFactoryTokenProposalCount
        )
        .accounts({
          signer: admin.publicKey,
          tokenProposal: tokenProposalAccountId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .rpc();

      tokenProposalAccount = await program.account.tokenProposal.fetch(
        tokenProposalAccountId
      );
    });

    it("should set the Token Proposal's voting ended at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          tokenProposalAccount.votingEndedAt.toNumber() - currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("Alice creates a User account:", () => {
    before(async () => {
      const tx = await program.methods
        .createUser()
        .accounts({
          signer: alice.publicKey,
          systemProgram: SystemProgram.programId,
          user: aliceAccountId,
        })
        .signers([alice])
        .rpc();

      aliceUserAccount = await program.account.user.fetch(aliceAccountId);
    });

    it("should create a User account for Alice.", async () => {
      assert.ok(aliceUserAccount);
    });

    it("should set Alice's Contribution IDs to an empty collection.", async () => {
      assert.deepEqual(aliceUserAccount.contributionIds, []);
    });

    it("should set Alice's total contributions to zero.", async () => {
      assert.equal(aliceUserAccount.totalContributions, 0);
    });
  });

  describe("Alice creates a Token Proposal for the ALICE token:", () => {
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
        name: "Alice's Token",
        symbol: "ALICE",
        description: "This is Alice's token.",
        logoUrl: "https://alice-token.com/logo.png",
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
      softCap = new BN(3 * LAMPORTS_PER_SOL);
      hardCap = new BN(5 * LAMPORTS_PER_SOL);
      fundingModel = {
        dynamicUnlock: false,
        endsEarlyOnHardCap: false,
      };
      airdropModules = {
        dropScore: false,
      };
      voting = {
        periodDays: 5,
        voteUnit: "DAYS",
        escrowedFund: false,
      };

      const tx = await program.methods
        .createTokenProposal(
          token,
          selectedGoals,
          fundingGoals,
          softCap,
          hardCap,
          fundingModel,
          airdropModules,
          voting
        )
        .accounts({
          signer: alice.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: aliceTokenProposalAccountId,
          tokenProposalFactory: tokenProposalFactoryAccountId,
        })
        .signers([alice])
        .rpc();

      aliceTokenProposalAccount = await program.account.tokenProposal.fetch(
        aliceTokenProposalAccountId
      );
    });

    it("should create a Token Proposal account for Alice's Token Proposal.", async () => {
      assert.ok(aliceTokenProposalAccount);
    });

    it("should set Alice Token Proposal's owner to Alice.", async () => {
      assert.deepEqual(aliceTokenProposalAccount.owner, alice.publicKey);
    });

    it("should set Alice Token Proposal's token to the token.", async () => {
      assert.deepEqual(aliceTokenProposalAccount.token, token);
    });

    it("should set Alice Token Proposal's selected goals to the selected goals.", async () => {
      assert.deepEqual(aliceTokenProposalAccount.selectedGoals, selectedGoals);
    });

    it("should set Alice Token Proposal's selected goals to the funding goals.", async () => {
      assert.deepEqual(aliceTokenProposalAccount.fundingGoals, fundingGoals);
    });

    it("should set Alice Token Proposal's soft cap to the soft cap.", async () => {
      assert.equal(aliceTokenProposalAccount.softCap.toNumber(), softCap);
    });

    it("should set Alice Token Proposal's hard cap to the hard cap.", async () => {
      assert.equal(aliceTokenProposalAccount.hardCap.toNumber(), hardCap);
    });

    it("should set Alice Token Proposal's funding model to the funding model.", async () => {
      assert.deepEqual(aliceTokenProposalAccount.fundingModel, fundingModel);
    });

    it("should set Alice Token Proposal's airdrop modules to the airdrop modules.", async () => {
      assert.deepEqual(
        aliceTokenProposalAccount.airdropModules,
        airdropModules
      );
    });

    it("should set Alice Token Proposal's voting to the voting.", async () => {
      assert.deepEqual(aliceTokenProposalAccount.voting, voting);
    });

    it("should set Alice Token Proposal's amount contributed to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.amountContributed, 0);
    });

    it("should set Alice Token Proposal's contribution count to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.contributionCount, 0);
    });

    it("should set Alice Token Proposal's voting started at to Alice current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          aliceTokenProposalAccount.votingStartedAt.toNumber() -
            currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set Alice Token Proposal's voting ended at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.votingEndedAt.toNumber(), 0);
    });

    it("should set Alice Token Proposal's soft cap reached at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.softCapReachedAt.toNumber(), 0);
    });

    it("should set Alice Token Proposal's hard cap reached at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.hardCapReachedAt.toNumber(), 0);
    });

    it("should set Alice Token Proposal's passed at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.passedAt.toNumber(), 0);
    });

    it("should set Alice Token Proposal's rejected at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.rejectedAt.toNumber(), 0);
    });

    it("should set Alice Token Proposal's token mint created at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.tokenMintCreatedAt.toNumber(), 0);
    });

    it("should set Alice Token Proposal's funds returned at to zero.", async () => {
      assert.equal(aliceTokenProposalAccount.fundsReturnedAt.toNumber(), 0);
    });

    it("should not change the Token Proposal Factory's admin.", async () => {
      assert.deepEqual(tokenProposalFactoryAccount.admin, admin.publicKey);
    });

    it("should add Alice Token Proposal ID to the Token Proposal Factory's Token Proposal IDs collection.", async () => {
      const updatedTokenProposalFactoryAccount =
        await program.account.tokenProposalFactory.fetch(
          tokenProposalFactoryAccountId
        );

      assert.deepEqual(updatedTokenProposalFactoryAccount.tokenProposalIds, [
        tokenProposalAccountId,
        aliceTokenProposalAccountId,
      ]);
    });
  });

  describe("Alice contributes to her own Token Proposal:", () => {
    before(async () => {
      aliceContributionAmount = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL in lamports

      const tx = await program.methods
        .contributeToTokenProposal(aliceContributionAmount)
        .accounts({
          contribution: aliceContributionAccountId,
          signer: alice.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: aliceTokenProposalAccountId,
          user: aliceAccountId,
        })
        .signers([alice])
        .rpc();

      // Wait for confirmation.
      await provider.connection.confirmTransaction(tx);

      aliceContributionAccount = await program.account.contribution.fetch(
        aliceContributionAccountId
      );

      aliceUserAccount = await program.account.user.fetch(aliceAccountId);

      aliceTokenProposalAccount = await program.account.tokenProposal.fetch(
        aliceTokenProposalAccountId
      );
    });

    it("should create a Contribution account for Alice's contribution.", async () => {
      assert.ok(aliceContributionAccount);
    });

    it("should set Alice Contribution's amount to the amount.", async () => {
      assert.equal(
        aliceContributionAccount.amount.toNumber(),
        aliceContributionAmount.toNumber()
      );
    });

    it("should set Alice Contribution's Token Proposal ID to the Alice Token Proposal ID.", async () => {
      assert.deepEqual(
        aliceContributionAccount.tokenProposalId,
        aliceTokenProposalAccountId
      );
    });

    it("should set Alice Contribution's User ID to Alice ID.", async () => {
      assert.deepEqual(aliceContributionAccount.userId, aliceAccountId);
    });

    it("should add Alice Contribution ID to Alice's Contribution IDs collection.", async () => {
      const updatedAliceUserAccount = await program.account.user.fetch(
        aliceAccountId
      );

      assert.deepEqual(updatedAliceUserAccount.contributionIds, [
        aliceContributionAccountId,
      ]);
    });

    it("should add Alice Contribution's amount to Alice's total contributions.", async () => {
      assert.equal(
        aliceUserAccount.totalContributions.toNumber(),
        aliceContributionAmount.toNumber()
      );
    });

    it("should add Alice Contribution's amount to the Alice Token Proposal's amount contributed.", async () => {
      assert.equal(
        aliceTokenProposalAccount.amountContributed.toNumber(),
        aliceContributionAmount.toNumber()
      );
    });

    it("should increment Alice Token Proposal's contribution count", async () => {
      assert.equal(aliceTokenProposalAccount.contributionCount, 1);
    });

    it("should not change Alice Token Proposal's soft cap reached at.", async () => {
      assert.equal(aliceTokenProposalAccount.softCapReachedAt.toNumber(), 0);
    });

    it("should not change Alice Token Proposal's hard cap reached at.", async () => {
      assert.equal(aliceTokenProposalAccount.hardCapReachedAt.toNumber(), 0);
    });
  });

  describe("Bob creates a User account:", () => {
    before(async () => {
      const tx = await program.methods
        .createUser()
        .accounts({
          signer: bob.publicKey,
          systemProgram: SystemProgram.programId,
          user: bobAccountId,
        })
        .signers([bob])
        .rpc();

      bobUserAccount = await program.account.user.fetch(bobAccountId);
    });

    it("should create a User account for Bob.", async () => {
      assert.ok(bobUserAccount);
    });

    it("should set Bob's Contribution IDs to an empty collection.", async () => {
      assert.deepEqual(bobUserAccount.contributionIds, []);
    });

    it("should set Bob's total contributions to zero.", async () => {
      assert.equal(bobUserAccount.totalContributions, 0);
    });
  });

  describe("Bob contributes to Alice's Token Proposal:", () => {
    before(async () => {
      bobContributionAmount = new BN(2 * LAMPORTS_PER_SOL); // 2 SOL in lamports

      const tx = await program.methods
        .contributeToTokenProposal(bobContributionAmount)
        .accounts({
          contribution: bobContributionAccountId,
          signer: bob.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: aliceTokenProposalAccountId,
          user: bobAccountId,
        })
        .signers([bob])
        .rpc();

      // Wait for confirmation.
      await provider.connection.confirmTransaction(tx);

      bobContributionAccount = await program.account.contribution.fetch(
        bobContributionAccountId
      );

      bobUserAccount = await program.account.user.fetch(bobAccountId);

      aliceTokenProposalAccount = await program.account.tokenProposal.fetch(
        aliceTokenProposalAccountId
      );
    });

    it("should create a Contribution account for Bob's contribution.", async () => {
      assert.ok(bobContributionAccount);
    });

    it("should set Bob Contribution's amount to the amount.", async () => {
      assert.equal(
        bobContributionAccount.amount.toNumber(),
        bobContributionAmount.toNumber()
      );
    });

    it("should set Bob Contribution's Token Proposal ID to the Alice Token Proposal ID.", async () => {
      assert.deepEqual(
        bobContributionAccount.tokenProposalId,
        aliceTokenProposalAccountId
      );
    });

    it("should set Bob Contribution's User ID to Bob ID.", async () => {
      assert.deepEqual(bobContributionAccount.userId, bobAccountId);
    });

    it("should add Bob Contribution ID to the Bob's Contribution IDs collection.", async () => {
      const updatedBobUserAccount = await program.account.user.fetch(
        bobAccountId
      );

      assert.deepEqual(updatedBobUserAccount.contributionIds, [
        bobContributionAccountId,
      ]);
    });

    it("should add Bob Contribution's amount to the Bob's total contributions.", async () => {
      assert.equal(
        bobUserAccount.totalContributions.toNumber(),
        bobContributionAmount.toNumber()
      );
    });

    it("should add Bob Contribution's amount to the Alice Token Proposal's amount contributed.", async () => {
      assert.equal(
        aliceTokenProposalAccount.amountContributed.toNumber(),
        aliceContributionAmount.toNumber() + bobContributionAmount.toNumber()
      );
    });

    it("should increment Alice Token Proposal's contribution count", async () => {
      assert.equal(aliceTokenProposalAccount.contributionCount, 1 + 1);
    });

    it("should set Alice Token Proposal's soft cap reached at to the current UNIX timestamp.", async () => {
      aliceTokenProposalAccountSoftCapReachedAt = currentUnixTimestamp;
      assert.ok(
        Math.abs(
          aliceTokenProposalAccount.softCapReachedAt.toNumber() -
            aliceTokenProposalAccountSoftCapReachedAt
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should not change Alice Token Proposal's hard cap reached at.", async () => {
      assert.equal(aliceTokenProposalAccount.hardCapReachedAt.toNumber(), 0);
    });
  });

  describe("Chris creates a User account:", () => {
    before(async () => {
      const tx = await program.methods
        .createUser()
        .accounts({
          signer: chris.publicKey,
          systemProgram: SystemProgram.programId,
          user: chrisAccountId,
        })
        .signers([chris])
        .rpc();

      chrisUserAccount = await program.account.user.fetch(chrisAccountId);
    });

    it("should create a User account for Chris.", async () => {
      assert.ok(chrisUserAccount);
    });

    it("should set Chris's Contribution IDs to an empty collection.", async () => {
      assert.deepEqual(chrisUserAccount.contributionIds, []);
    });

    it("should set Chris's total contributions to zero.", async () => {
      assert.equal(chrisUserAccount.totalContributions, 0);
    });
  });

  describe("Chris contributes to Alice's Token Proposal:", () => {
    let chrisContributionAmount;

    before(async () => {
      chrisContributionAmount = new BN(3 * LAMPORTS_PER_SOL); // 3 SOL in lamports

      const tx = await program.methods
        .contributeToTokenProposal(chrisContributionAmount)
        .accounts({
          contribution: chrisContributionAccountId,
          signer: chris.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProposal: aliceTokenProposalAccountId,
          user: chrisAccountId,
        })
        .signers([chris])
        .rpc();

      // Wait for confirmation.
      await provider.connection.confirmTransaction(tx);

      chrisContributionAccount = await program.account.contribution.fetch(
        chrisContributionAccountId
      );

      chrisUserAccount = await program.account.user.fetch(chrisAccountId);

      aliceTokenProposalAccount = await program.account.tokenProposal.fetch(
        aliceTokenProposalAccountId
      );
    });

    it("should create a Contribution account for Chris's contribution.", async () => {
      assert.ok(chrisContributionAccount);
    });

    it("should set Chris Contribution's amount to the amount.", async () => {
      assert.equal(
        chrisContributionAccount.amount.toNumber(),
        chrisContributionAmount.toNumber()
      );
    });

    it("should set Chris Contribution's Token Proposal ID to the Alice Token Proposal ID.", async () => {
      assert.deepEqual(
        chrisContributionAccount.tokenProposalId,
        aliceTokenProposalAccountId
      );
    });

    it("should set Chris Contribution's User ID to Chris ID.", async () => {
      assert.deepEqual(chrisContributionAccount.userId, chrisAccountId);
    });

    it("should add Chris Contribution ID to the Chris's Contribution IDs collection.", async () => {
      const updatedChrisUserAccount = await program.account.user.fetch(
        chrisAccountId
      );

      assert.deepEqual(updatedChrisUserAccount.contributionIds, [
        chrisContributionAccountId,
      ]);
    });

    it("should add Chris Contribution's amount to the Chris's total contributions.", async () => {
      assert.equal(
        chrisUserAccount.totalContributions.toNumber(),
        chrisContributionAmount.toNumber()
      );
    });

    it("should add Chris Contribution's amount to the Alice Token Proposal's amount contributed.", async () => {
      assert.equal(
        aliceTokenProposalAccount.amountContributed.toNumber(),
        aliceContributionAmount.toNumber() +
          bobContributionAmount.toNumber() +
          chrisContributionAmount.toNumber()
      );
    });

    it("should increment Alice Token Proposal's contribution count", async () => {
      assert.equal(aliceTokenProposalAccount.contributionCount, 1 + 1 + 1);
    });

    it("should not change Alice Token Proposal's soft cap reached at.", async () => {
      assert.ok(
        Math.abs(
          aliceTokenProposalAccount.softCapReachedAt.toNumber() -
            aliceTokenProposalAccountSoftCapReachedAt
        ) <= TIMESTAMP_TOLERANCE
      );
    });

    it("should set Alice Token Proposal's hard cap reached at to the current UNIX timestamp.", async () => {
      assert.ok(
        Math.abs(
          aliceTokenProposalAccount.hardCapReachedAt.toNumber() -
            currentUnixTimestamp
        ) <= TIMESTAMP_TOLERANCE
      );
    });
  });

  describe("Diana creates a User account:", () => {
    before(async () => {
      const tx = await program.methods
        .createUser()
        .accounts({
          signer: diana.publicKey,
          systemProgram: SystemProgram.programId,
          user: dianaAccountId,
        })
        .signers([diana])
        .rpc();

      dianaUserAccount = await program.account.user.fetch(dianaAccountId);
    });

    it("should create a User account for Diana.", async () => {
      assert.ok(dianaUserAccount);
    });

    it("should set Diana's Contribution IDs to an empty collection.", async () => {
      assert.deepEqual(dianaUserAccount.contributionIds, []);
    });

    it("should set Diana's total contributions to zero.", async () => {
      assert.equal(dianaUserAccount.totalContributions, 0);
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
