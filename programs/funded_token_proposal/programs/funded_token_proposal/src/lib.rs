#![allow(clippy::result_large_err)]

/***********
 * Imports *
 ***********/
use anchor_lang::prelude::*;
//use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::sysvar;
/*
 * The SPL Token Program is part of the Solana Program Library. It's a separate
 * program that is already deployed on-chain and that manages token creation,
 * minting, transfers, and management. More than just a program, it's the
 * standardized protocol for working with tokens on the Solana blockchain.
 * As a standardized protocol, it ensures consistent behavior and
 * interoperability for tokens across the Solana ecosystem.
 */
use anchor_spl::metadata::{
    CreateMetadataAccountsV3,
    Metadata,
    create_metadata_accounts_v3,
    mpl_token_metadata::types::DataV2,
};
use anchor_spl::token::{Mint, Token};

declare_id!("CtaFEhyUB8FJvcHRfRutN2WGd2bQ9cL3DgXxpkwajfCf");

// Constants
pub const ANCHOR_DISCRIMINATOR_SPACE: usize = 8;
pub const BOOL_SPACE: usize = 4;
pub const I64_SPACE: usize = 8;
pub const PUBKEY_COUNT_MAX: usize = 10_000;
pub const PUBKEY_SPACE: usize = 32;
pub const STATUS_LENGTH_MAX: usize = 17; // "token-mint-created"
pub const STRING_SPACE: usize = 4;
pub const TIMESTAMP_SPACE: usize = I64_SPACE;
pub const TOKEN_DECIMAL: u8 = 9; // SPL Token default decimals
pub const TOKEN_METADATA_URI: &str = "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json";
pub const TOKEN_PROPOSAL_FACTORY_TOKEN_PROPOSALS_MAX: usize = 100;
pub const TOKEN_PROPOSAL_NAME_LENGTH_MAX: usize = 50;
pub const TOKEN_PROPOSAL_SYMBOL_LENGTH_MAX: usize = 3;
pub const TOKEN_PROPOSAL_DESCRIPTION_LENGTH_MAX: usize = 255;
pub const TOKEN_PROPOSAL_LOGO_URL_LENGTH_MAX: usize = 127;
pub const TOKEN_PROPOSAL_VOTING_VOTE_UNIT_LENGTH_MAX: usize = 10;
pub const USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX: usize = 100;
pub const U32_SPACE: usize = 4;
pub const U64_SPACE: usize = 8;
pub const VEC_SPACE: usize = 4;
pub const VOTING_PERIOD_SECONDS: i64 = 5 * 24 * 60 * 60; // 5 days (fixed for MVP)

// Texts
pub const TEXTS_TOKEN_METADATA_ACCOUNT_CREATE_SUCCESS: &str = "You successfully created Token Metadata Account. Token Metadata Account ID:";
pub const TEXTS_TOKEN_MINT_CREATE_SUCCESS: &str = "You successfully created Token Mint.";
pub const TEXTS_TOKEN_PROPOSAL_FACTORY_INITIALIZE_SUCCESS: &str = "You successfully initialized Token Proposal Factory. Token Proposal Factory ID:";
pub const TEXTS_TOKEN_PROPOSAL_HARD_CAP_REACHED: &str = "The HardCap has been reached! Reached at:";
pub const TEXTS_TOKEN_PROPOSAL_SOFT_CAP_REACHED: &str = "The SoftCap has been reached! Reached at:";
pub const TEXTS_USER_CREATE_SUCCESS: &str = "You successfully created User. User ID:";

/***********
 * Program *
 ***********/
#[program]
pub mod funded_token_proposal {
    use super::*;

    pub fn initialize_token_proposal_factory(
        ctx: Context<InitializeTokenProposalFactory>,
    ) -> Result<()> {
        // Clock
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        /*
         * Token Proposal Factory
         */
        let token_proposal_factory = &mut ctx.accounts.token_proposal_factory;
        token_proposal_factory.token_proposal_ids = Vec::new();
        token_proposal_factory.token_proposal_count = 0;
        // Admin
        token_proposal_factory.admin = *ctx.accounts.signer.key;
        // Timestamps
        token_proposal_factory.created_at = current_timestamp;
        token_proposal_factory.updated_at = current_timestamp;

        msg!("{} {:?}", TEXTS_TOKEN_PROPOSAL_FACTORY_INITIALIZE_SUCCESS, ctx.program_id);

        Ok(())
    }

    pub fn create_user(
        ctx: Context<CreateUser>,
    ) -> Result<()> {
        // Clock
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        /*
         * User
         */
        let user = &mut ctx.accounts.user;
        user.contribution_ids = Vec::new();
        user.total_contributions = 0;
        user.votes = Vec::new();
        // Timestamps
        user.created_at = current_timestamp;
        user.updated_at = current_timestamp;

        msg!("{} {:?}", TEXTS_USER_CREATE_SUCCESS, ctx.program_id);

        Ok(())
    }

    pub fn create_token_proposal(
        ctx: Context<CreateTokenProposal>,
        token: ProposalToken,
        selected_goals: SelectedGoals,
        funding_goals: FundingGoals,
        soft_cap: u64,
        hard_cap: u64,
        funding_model: FundingModel,
        airdrop_modules: AirdropModules,
        voting: Voting,
    ) -> Result<()> {
        // Clock
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        /*
         * Token Proposal
         */
        let token_proposal = &mut ctx.accounts.token_proposal;
        token_proposal.token = token;
        token_proposal.selected_goals = selected_goals;
        token_proposal.funding_goals = funding_goals;
        token_proposal.soft_cap = soft_cap;
        token_proposal.hard_cap = hard_cap;
        token_proposal.funding_model = funding_model;
        token_proposal.airdrop_modules = airdrop_modules;
        token_proposal.voting = voting;
        // Contributions
        token_proposal.amount_contributed = 0;
        token_proposal.contribution_count = 0;
        // Status
        token_proposal.status = String::from("voting-started");
        // Lifecycle States (Key States/Flags) Timestamps
        token_proposal.voting_started_at = current_timestamp;
        token_proposal.voting_ended_at = 0;
        token_proposal.soft_cap_reached_at = 0;
        token_proposal.hard_cap_reached_at = 0;
        token_proposal.passed_at = 0;
        token_proposal.rejected_at = 0;
        token_proposal.token_mint_created_at = 0;
        token_proposal.funds_returned_at = 0;
        // Owner
        token_proposal.owner = *ctx.accounts.signer.key;
        // Timestamps
        token_proposal.created_at = current_timestamp;
        token_proposal.updated_at = current_timestamp;

        /*
         * Store Token Proposal's Program Derived Addresses (PDA) in Token
         * Proposal Factory.
         */
        let token_proposal_factory = &mut ctx.accounts.token_proposal_factory;
        token_proposal_factory.token_proposal_ids
            .push(*token_proposal.to_account_info().key);
        token_proposal_factory.token_proposal_count += 1;
        // Timestamps
        token_proposal_factory.updated_at = current_timestamp;

        Ok(())
    }

    pub fn end_token_proposal_voting_period(
        ctx: Context<EndTokenProposalVotingPeriod>,
        _token_proposal_index: u32,
    ) -> Result<()> {
        // Clock
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        /*
         * Token Proposal
         */
        let token_proposal = &mut ctx.accounts.token_proposal;

        /*
         * Guard Checks
         */
        //require!(
        //    current_timestamp >
        //    token_proposal.voting_started_at,
        //    CustomError::VotingPeriodNotStartedYet
        //);

        require!(
            current_timestamp <
            (token_proposal.voting_started_at + VOTING_PERIOD_SECONDS),
            CustomError::VotingPeriodAlreadyEnded
        );

        /*
         * End Token Proposal's voting period.
         */
        // Status
        token_proposal.status = String::from("voting-ended");
        // Lifecycle States (Key States/Flags) Timestamps
        token_proposal.voting_ended_at = current_timestamp;

        /*
         * Voting Mechanics
         */
        if token_proposal.soft_cap_reached_at > 0 {
            msg!(
                "{} {}",
                TEXTS_TOKEN_PROPOSAL_SOFT_CAP_REACHED, current_timestamp
            );

            token_proposal.status = String::from("passed");

            // -> Automatically launch Token.
        } else {
            token_proposal.status = String::from("rejected");

            // -> Automatically refund Contributions.
        }

        Ok(())
    }

    pub fn contribute_to_token_proposal(
        ctx: Context<ContributeToTokenProposal>,
        amount: u64,
    ) -> Result<()> {
        // Clock
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        /*
         * Token Proposal
         */
        let token_proposal = &mut ctx.accounts.token_proposal;

        /*
         * Guard Checks
         */
        //require!(
        //    current_timestamp >
        //    token_proposal.voting_started_at,
        //    CustomError::VotingPeriodNotStartedYet
        //);

        require!(
            current_timestamp <
            (token_proposal.voting_started_at + VOTING_PERIOD_SECONDS),
            CustomError::VotingPeriodAlreadyEnded
        );

        require!(
            token_proposal.hard_cap_reached_at == 0,
            CustomError::VotesAlreadyReachedHardCap
        );

        /*
         * User
         */
        let user = &mut ctx.accounts.user;
        require!(
            !user.votes.contains(&token_proposal.to_account_info().key),
            CustomError::UserAlreadyVoted
        );

        /*
         * Signer
         */
        let signer = &ctx.accounts.signer;

        /*
         * Transfer
         */
        // Create the transfer instruction.
        let instruction = anchor_lang::solana_program::system_instruction::transfer(
            &signer.key(),
            &token_proposal.key(),
            amount,
        );
        // Invoke the transfer instruction.
        let _ = anchor_lang::solana_program::program::invoke(
            &instruction,
            &[
                signer.to_account_info(),
                token_proposal.to_account_info(),
            ],
        );

        /*
         * Contribution
         */
        let contribution = &mut ctx.accounts.contribution;
        contribution.amount = amount;
        contribution.token_proposal_id = *token_proposal.to_account_info().key;
        contribution.user_id = *user.to_account_info().key;
        // Timestamps
        contribution.created_at = current_timestamp;
        contribution.updated_at = current_timestamp;

        /*
         * Token Proposal
         */
        token_proposal.amount_contributed += amount;
        token_proposal.contribution_count += 1;
        // Timestamps
        token_proposal.updated_at = current_timestamp;

        /*
         * User
         */
        user.contribution_ids.push(*contribution.to_account_info().key);
        user.total_contributions += amount;
        user.votes.push(*token_proposal.to_account_info().key);
        // Timestamps
        user.updated_at = current_timestamp;

        /*
         * Voting Mechanics
         */
        // If voting active,
        if current_timestamp <
            (token_proposal.voting_started_at + VOTING_PERIOD_SECONDS) {
                // If HardCap has been reached,
                if token_proposal.amount_contributed >= token_proposal.hard_cap {
                    msg!(
                        "{} {}",
                        TEXTS_TOKEN_PROPOSAL_HARD_CAP_REACHED, current_timestamp
                    );

                    token_proposal.status = String::from("hard-cap-reached");
                    token_proposal.hard_cap_reached_at = current_timestamp;
                    // end the vote early.
                    token_proposal.voting_ended_at = current_timestamp;

                    // -> Automatically launch Token.

                    // Else if SoftCap has been reached,
                } else if token_proposal.amount_contributed >= token_proposal.soft_cap {
                    msg!(
                        "{} {}",
                        TEXTS_TOKEN_PROPOSAL_SOFT_CAP_REACHED, current_timestamp
                    );

                    token_proposal.status = String::from("soft-cap-reached");
                    token_proposal.soft_cap_reached_at = current_timestamp;

                    // -> Voting continue.
                }
            }

        Ok(())
    }

    pub fn create_token_mint(
        ctx: Context<CreateTokenMint>,
    ) -> Result<()> {
        // Clock
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        /*
         * Accounts
         */
        let metadata_account = &ctx.accounts.metadata_account;
        let mint_account = &ctx.accounts.mint_account;
        let payer = &mut ctx.accounts.payer;
        let rent = &ctx.accounts.rent;
        let system_program = &ctx.accounts.system_program;
        let token_metadata_program = &ctx.accounts.token_metadata_program;
        let token_program = &ctx.accounts.token_program;
        let token_proposal = &mut ctx.accounts.token_proposal;

        msg!(
            "{} {}",
            TEXTS_TOKEN_METADATA_ACCOUNT_CREATE_SUCCESS,
            metadata_account.key()
        );

        /*
         * Cross Program Invocation (CPI):
         *
         * Invoking the create_metadata_account_v3 instruction on the token
         * metadata program.
         */
        create_metadata_accounts_v3(
            CpiContext::new(
                token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: metadata_account.to_account_info(),
                    mint: mint_account.to_account_info(),
                    mint_authority: payer.to_account_info(),
                    payer: payer.to_account_info(),
                    rent: rent.to_account_info(),
                    system_program: system_program.to_account_info(),
                    update_authority: payer.to_account_info(),
                },
            ),
            DataV2 {
                name: token_proposal.token.name.clone(),
                symbol: token_proposal.token.symbol.clone(),
                uri: TOKEN_METADATA_URI.to_string(),
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            false, // Is mutable?
            true, // Is update authority the signer?
            None, // Any collection details?
        )?;

        msg!(TEXTS_TOKEN_MINT_CREATE_SUCCESS);

        /*
         * Token Proposal
         */
        // Status
        token_proposal.status = String::from("token-mint-created");
        // Lifecycle States (Key States/Flags) Timestamps
        token_proposal.token_mint_created_at = current_timestamp;

        Ok(())
    }
}

/************
 * Contexts *
 ************/
#[derive(Accounts)]
pub struct InitializeTokenProposalFactory<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        seeds = [
            b"token_proposal_factory".as_ref(),
        ],
        bump,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SPACE // discriminator
            + VEC_SPACE + (PUBKEY_SPACE * TOKEN_PROPOSAL_FACTORY_TOKEN_PROPOSALS_MAX) // token_proposal_ids (Vec<Pubkey>)
            + U32_SPACE //  token_proposal_count (u32)
            + PUBKEY_SPACE // admin (Pubkey)
            + TIMESTAMP_SPACE // created_at (i64 timestamp)
            + TIMESTAMP_SPACE // updated_at (i64 timestamp)
    )]
    pub token_proposal_factory: Account<'info, TokenProposalFactory>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        seeds = [
            b"user".as_ref(),
            signer.key().as_ref(),
        ],
        bump,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SPACE // discriminator
            + VEC_SPACE + (PUBKEY_SPACE * USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX) // contribution_ids (Vec<Pubkey>)
            + U64_SPACE // total_contributions (u64)
            + VEC_SPACE + (PUBKEY_SPACE * USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX) // votes (Vec<Pubkey>)
            + TIMESTAMP_SPACE // created_at (i64 timestamp)
            + TIMESTAMP_SPACE // updated_at (i64 timestamp)
    )]
    pub user: Account<'info, User>,
}

#[derive(Accounts)]
pub struct CreateTokenProposal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        seeds = [
            b"token_proposal".as_ref(),
            token_proposal_factory.token_proposal_count.to_le_bytes().as_ref(),
        ],
        bump,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SPACE // discriminator
            // Token struct
            + (STRING_SPACE * TOKEN_PROPOSAL_NAME_LENGTH_MAX)
            + (STRING_SPACE * TOKEN_PROPOSAL_SYMBOL_LENGTH_MAX)
            + (STRING_SPACE * TOKEN_PROPOSAL_DESCRIPTION_LENGTH_MAX)
            + (STRING_SPACE * TOKEN_PROPOSAL_LOGO_URL_LENGTH_MAX)
            // SelectedGoals struct
            + BOOL_SPACE // lp (bool)
            + BOOL_SPACE // treasury (bool)
            + BOOL_SPACE // kol (bool)
            + BOOL_SPACE // ai (bool)
            // FundingGoals struct
            + U32_SPACE // lp (u32)
            + U32_SPACE // treasury (u32)
            + U32_SPACE // kol (u32)
            + U32_SPACE // ai (u32)
            // SoftCap and HardCap
            + U64_SPACE // soft_cap (u64)
            + U64_SPACE // hard_cap (u64)
            // FundingModel struct
            + BOOL_SPACE // dynamic_unlock (bool)
            + BOOL_SPACE // ends_early_on_hard_cap (bool)
            // AirdropModules struct
            + BOOL_SPACE // drop_score (bool)
            // Voting struct
            + U32_SPACE // period_days (u32)
            + (STRING_SPACE + TOKEN_PROPOSAL_VOTING_VOTE_UNIT_LENGTH_MAX) // vote_unit (String)
            + BOOL_SPACE // escrowed_fund (bool)
            // Other fields
            + U64_SPACE // amount_contributed (u64)
            + U32_SPACE // contribution_count (u32)
            // Status
            + (STRING_SPACE * STATUS_LENGTH_MAX) // status (String)
            // Lifecycle States (Key States/Flags) Timestamps
            + TIMESTAMP_SPACE // voting_started_at (i64 timestamp)
            + TIMESTAMP_SPACE // voting_ended_at (i64 timestamp)
            + TIMESTAMP_SPACE // soft_cap_reached_at (i64 timestamp)
            + TIMESTAMP_SPACE // hard_cap_reached_at: i64
            + TIMESTAMP_SPACE // passed_at (i64 timestamp)
            + TIMESTAMP_SPACE // rejected_at (i64 timestamp)
            + TIMESTAMP_SPACE // token_mint_created_at (i64 timestamp)
            + TIMESTAMP_SPACE // funds_returned_at (i64 timestamp)
            // Owner
            + PUBKEY_SPACE // owner (Pubkey)
            // Timestamps
            + TIMESTAMP_SPACE // created_at (i64 timestamp)
            + TIMESTAMP_SPACE // updated_at (i64 timestamp)
    )]
    pub token_proposal: Account<'info, TokenProposal>,
    #[account(mut)]
    pub token_proposal_factory: Account<'info, TokenProposalFactory>,
}

#[derive(Accounts)]
#[instruction(_token_proposal_index: u32)]
pub struct EndTokenProposalVotingPeriod<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"token_proposal".as_ref(),
            _token_proposal_index.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub token_proposal: Account<'info, TokenProposal>,
    #[account(mut)]
    pub token_proposal_factory: Account<'info, TokenProposalFactory>,
}

#[derive(Accounts)]
pub struct ContributeToTokenProposal<'info> {
    #[account(
        init,
        seeds = [
            b"contribution".as_ref(),
            token_proposal.key().as_ref(),
            signer.key().as_ref(),
        ],
        bump,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SPACE // discriminator
            + U64_SPACE // amount (u64)
            + PUBKEY_SPACE // token_proposal_id (Pubkey)
            + PUBKEY_SPACE // user_id (Pubkey)
            + TIMESTAMP_SPACE // created_at (i64 timestamp)
            + TIMESTAMP_SPACE // updated_at (i64 timestamp)
    )]
    pub contribution: Account<'info, Contribution>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub token_proposal: Account<'info, TokenProposal>,
    #[account(mut)]
    pub user: Account<'info, User>,
}

#[derive(Accounts)]
pub struct CreateTokenMint<'info> {
    /// CHECK: Validate address by deriving PDA.
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint_account.key().as_ref(),
        ],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,
    // Create new mint account.
    #[account(
        init,
        payer = payer,
        mint::decimals = TOKEN_DECIMAL,
        mint::authority = payer.key(),
    )]
    pub mint_account: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub token_proposal: Account<'info, TokenProposal>,
}

/************
 * Accounts *
 ************/
#[account]
#[derive(InitSpace)]
pub struct TokenProposalFactory {
    #[max_len(TOKEN_PROPOSAL_FACTORY_TOKEN_PROPOSALS_MAX)]
    pub token_proposal_ids: Vec<Pubkey>,
    pub token_proposal_count: u32,
    // Admin
    pub admin: Pubkey,
    // Timestamps
    pub created_at: i64,
    pub updated_at: i64,

    //pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    #[max_len(USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX)]
    pub contribution_ids: Vec<Pubkey>,
    pub total_contributions: u64,
    #[max_len(USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX)]
    pub votes: Vec<Pubkey>, // Token Proposal IDs
    // Timestamps
    pub created_at: i64,
    pub updated_at: i64,

    //pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Contribution {
    pub amount: u64,
    pub token_proposal_id: Pubkey,
    pub user_id: Pubkey,
    // Timestamps
    pub created_at: i64,
    pub updated_at: i64,

    //pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TokenProposal {
    pub token: ProposalToken,
    pub selected_goals: SelectedGoals,
    pub funding_goals: FundingGoals,
    pub soft_cap: u64,
    pub hard_cap: u64,
    pub funding_model: FundingModel,
    pub airdrop_modules: AirdropModules,
    pub voting: Voting,
    // Contributions
    pub amount_contributed: u64,
    pub contribution_count: u32,
    /*
     * Status:
     *   - "voting-started";
     *   - "voting-ended";
     *   - "soft-cap-reached";
     *   - "hard-cap-reached";
     *   - "passed";
     *   - "rejected";
     *   - "token-mint-created".
     *   - "funds-returned";
     */
    #[max_len(STATUS_LENGTH_MAX)]
    pub status: String,
    // Lifecycle States (Key States/Flags) Timestamps
    pub voting_started_at: i64,
    pub voting_ended_at: i64,
    pub soft_cap_reached_at: i64,
    pub hard_cap_reached_at: i64,
    pub passed_at: i64,
    pub rejected_at: i64,
    pub token_mint_created_at: i64,
    pub funds_returned_at: i64,
    // Owner
    pub owner: Pubkey,
    // Timestamps
    pub created_at: i64,
    pub updated_at: i64,

    //pub bump: u8,
}

/***********
 * Structs *
 **********/
#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProposalToken {
    #[max_len(TOKEN_PROPOSAL_NAME_LENGTH_MAX)]
    pub name: String,
    #[max_len(TOKEN_PROPOSAL_SYMBOL_LENGTH_MAX)]
    pub symbol: String,
    #[max_len(TOKEN_PROPOSAL_DESCRIPTION_LENGTH_MAX)]
    pub description: String,
    #[max_len(TOKEN_PROPOSAL_LOGO_URL_LENGTH_MAX)]
    pub logo_url: String,
}

#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SelectedGoals {
    pub lp: bool,
    pub treasury: bool,
    pub kol: bool,
    pub ai: bool,
}

#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct FundingGoals {
    pub lp: u32,
    pub treasury: u32,
    pub kol: u32,
    pub ai: u32,
}

#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct FundingModel {
    pub dynamic_unlock: bool,
    pub ends_early_on_hard_cap: bool,
}

#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AirdropModules {
    pub drop_score: bool,
}

#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Voting {
    pub period_days: u32,
    #[max_len(TOKEN_PROPOSAL_VOTING_VOTE_UNIT_LENGTH_MAX)]
    pub vote_unit: String,
    pub escrowed_fund: bool,
}

/*********
 * Enums *
 *********/
#[error_code]
enum CustomError {
    #[msg("The voting period on the Token Proposal has not started yet.")]
    VotingPeriodNotStartedYet,
    #[msg("The voting period on the Token Proposal has already ended.")]
    VotingPeriodAlreadyEnded,
    #[msg("The votes on the Token Proposal have already reached the hard cap.")]
    VotesAlreadyReachedHardCap,
    #[msg("The User has already voted on the Token Proposal.")]
    UserAlreadyVoted,
}
