/***********
 * Imports *
 ***********/
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::sysvar;
/*
 * The SPL Token Program is part of the Solana Program Library. It's a separate
 * program that is already deployed on-chain and that manages token creation,
 * minting, transfers, and management. More than just a program, it's the
 * standardized protocol for working with tokens on the Solana blockchain.
 * As a standardized protocol, it ensures consistent behavior and
 * interoperability for tokens across the Solana ecosystem.
 */
//use spl_token::instruction as token_instruction;

declare_id!("7iEZx5UGZZfiTEj1vXqLXWsxybw9De7Xh1J7DHrRecin");

// Constants
pub const DISCRIMINATOR_SPACE: usize = 8;
pub const BOOL_SPACE: usize = 4;
pub const PUBKEY_COUNT_MAX: usize = 10_000;
pub const PUBKEY_SPACE: usize = 32;
pub const STRING_SPACE: usize = 4;
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

// Texts
pub const TEXTS_TOKEN_PROPOSAL_FACTORY_INITIALIZE_SUCCESS: &str = "You successfully initialized Token Proposal Factory. Token Proposal Factory ID:";
pub const TEXTS_USER_CREATE_SUCCESS: &str = "You successfully created User. User ID:";

/***********
 * Program *
 ***********/
#[program]
pub mod meme_builder_ai {
    use super::*;

    pub fn initialize_token_proposal_factory(
        ctx: Context<InitializeTokenProposalFactory>
    ) -> ProgramResult {
        let token_proposal_factory = &mut ctx.accounts.token_proposal_factory;

        token_proposal_factory.token_proposal_ids = Vec::new();
        token_proposal_factory.token_proposal_count = 0;

        // Owner
        token_proposal_factory.admin = *ctx.accounts.signer.key;

        msg!("{} {:?}", TEXTS_TOKEN_PROPOSAL_FACTORY_INITIALIZE_SUCCESS, ctx.program_id);

        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>) -> ProgramResult {
        let user = &mut ctx.accounts.user;

        user.contribution_ids = Vec::new();
        user.total_contributions = 0;

        msg!("{} {:?}", TEXTS_USER_CREATE_SUCCESS, ctx.program_id);

        Ok(())
    }

    pub fn create_token_proposal(
        ctx: Context<CreateTokenProposal>,
        token: Token,
        selected_goals: SelectedGoals,
        funding_goals: FundingGoals,
        soft_cap: u32,
        hard_cap: u32,
        funding_model: FundingModel,
        airdrop_modules: AirdropModules,
        voting: Voting,
    ) -> ProgramResult {
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

        // Flags
        token_proposal.ready_to_be_finalized = false;
        token_proposal.finalized = false;
        token_proposal.completed = false;

        // Owner
        token_proposal.owner = *ctx.accounts.signer.key;

        /*
         * Store Token Proposal's Program Derived Addresses (PDA) in Token
         * Proposal Factory.
         */
        let token_proposal_factory = &mut ctx.accounts.token_proposal_factory;

        token_proposal_factory.token_proposal_ids
            .push(*ctx.accounts.token_proposal.to_account_info().key);
        token_proposal_factory.token_proposal_count += 1;

        Ok(())
    }

    pub fn contribute_to_token_proposal(
        ctx: Context<ContributeToTokenProposal>,
        amount: u64
    ) -> ProgramResult {
        // Create the transfer instruction.
        let instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.signer.key(),
            &ctx.accounts.token_proposal.key(),
            amount,
        );

        // Invoke the transfer instruction.
        let _ = anchor_lang::solana_program::program::invoke(
            &instruction,
            &[
                ctx.accounts.signer.to_account_info(),
                ctx.accounts.token_proposal.to_account_info(),
            ],
        );

        // Create Contribution.
        let contribution = &mut ctx.accounts.contribution;

        contribution.amount = amount;
        contribution.token_proposal_id = *ctx.accounts.token_proposal.to_account_info().key;
        contribution.user_id = *ctx.accounts.user.to_account_info().key;

        // Update User's Contributions.
        let user = &mut ctx.accounts.user;

        user.contribution_ids.push(*ctx.accounts.contribution.to_account_info().key);
        user.total_contributions += amount;

        // Update Token Proposal.
        let token_proposal = &mut ctx.accounts.token_proposal;

        token_proposal.amount_contributed += amount;
        token_proposal.contribution_count += 1;

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
        seeds=[
            b"token_proposal_factory".as_ref(),
            signer.key().as_ref(),
        ],
        bump,
        payer=signer,
        space = DISCRIMINATOR_SPACE // discriminator
            + VEC_SPACE + (PUBKEY_SPACE * TOKEN_PROPOSAL_FACTORY_TOKEN_PROPOSALS_MAX) // token_proposal_ids (Vec<Pubkey>)
            + U32_SPACE //  token_proposal_count (u32)
            + PUBKEY_SPACE // admin (Pubkey)
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
        seeds = [b"user".as_ref(), signer.key().as_ref()],
        bump,
        payer = signer,
        space = DISCRIMINATOR_SPACE // discriminator
            + VEC_SPACE + (PUBKEY_SPACE * USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX) // contribution_ids (Vec<Pubkey>)
            + U64_SPACE // total_contributions (u64)
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
        seeds=[
            b"token_proposal".as_ref(),
            token_proposal_factory.key().as_ref(),
            token_proposal_factory.token_proposal_count.to_le_bytes().as_ref(),
            signer.key().as_ref(),
        ],
        bump,
        payer=signer,
        space= DISCRIMINATOR_SPACE // discriminator
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
            + BOOL_SPACE // ready_to_be_finalized (bool)
            + BOOL_SPACE // finalized (bool)
            + BOOL_SPACE // completed (bool)
            + PUBKEY_SPACE // owner (Pubkey)
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
        space = DISCRIMINATOR_SPACE // discriminator
            + U64_SPACE // amount (u64)
            + PUBKEY_SPACE // token_proposal_id (Pubkey)
            + PUBKEY_SPACE // user_id (Pubkey)
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

/************
 * Accounts *
 ************/
#[account]
#[derive(InitSpace)]
pub struct TokenProposalFactory {
    #[max_len(TOKEN_PROPOSAL_FACTORY_TOKEN_PROPOSALS_MAX)]
    pub token_proposal_ids: Vec<Pubkey>,
    pub token_proposal_count: u32,

    // Owner
    pub admin: Pubkey,

    //pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    #[max_len(USER_TOKEN_PROPOSAL_CONTRIBUTIONS_MAX)]
    pub contribution_ids: Vec<Pubkey>,
    pub total_contributions: u64,

    //pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Contribution {
    pub amount: u64,
    pub token_proposal_id: Pubkey,
    pub user_id: Pubkey,

    //pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TokenProposal {
    pub token: Token,
    pub selected_goals: SelectedGoals,
    pub funding_goals: FundingGoals,
    pub soft_cap: u32,
    pub hard_cap: u32,
    pub funding_model: FundingModel,
    pub airdrop_modules: AirdropModules,
    pub voting: Voting,

    // Contributions
    pub amount_contributed: u64,
    pub contribution_count: u32,

    // Flags
    pub ready_to_be_finalized: bool,
    pub finalized: bool,
    pub completed: bool,

    // Owner
    pub owner: Pubkey,

    //pub bump: u8,
}

/***********
 * Structs *
 **********/
#[derive(Clone)]
#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Token {
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
pub enum CustomError {
    #[msg("The Token Proposal has already been completed.")]
    TokenProposalAlreadyCompleted,
    #[msg("The Token Proposal has already been finalized.")]
    TokenProposalAlreadyFinalized,
    #[msg("The Token Proposal has not been finalized.")]
    TokenProposalNotFinalized,
    #[msg("The Token Proposal is not ready to be finalized.")]
    TokenProposalNotReadyToBeFinalized,
    #[msg("The User has already voted on the Token Proposal.")]
    UserAlreadyVoted,
    #[msg("The User is not the Owner of the Token Proposal.")]
    UserNotOwner,
}
