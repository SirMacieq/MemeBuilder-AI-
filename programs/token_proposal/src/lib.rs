/***********
 * Imports *
 ***********/
/*
 * TODO:
 *   - Find a better data structure for storing votes as Anchor (and Solana in
 * general) does not support complex data structures like HashMap in account
 * data due to serialization constraints and account size limits.
 */
use std::collections::HashMap;
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
use spl_token::instruction as token_instruction;

declare_id!("<PROGRAM_ID>");

/**********
 * Struct *
 **********/
#[derive(AnchorSerialize, AnchorDeserialize)]
struct Token {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub logo_url: String,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
struct SelectedGoals {
    pub lp: bool,
    pub treasury: bool,
    pub kol: bool,
    pub ai: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
struct FundingGoals {
    pub lp: u32,
    pub treasury: u32,
    pub kol: u32,
    pub ai: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
struct FundingModel {
    pub dynamic_unlock: bool,
    pub ends_early_on_hard_cap: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
struct AirdropModules {
    pub drop_score: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
struct Voting {
    pub period_days: u32,
    pub vote_unit: String,
    pub escrowed_fund: bool,
}

#[account]
pub struct Proposal {
    pub token: Token,
    pub selected_goals: SelectedGoals,
    pub funding_goals: FundingGoals,
    pub soft_cap: u32,
    pub hard_cap: u32,
    pub funding_model: FundingModel,
    pub airdrop_modules: AirdropModules,
    pub voting: Voting,

    // Voting Mechanism
    pub complete: bool,
    pub vote_count: u32,
    pub votes: HashMap<Pubkey, bool>, // Problematic HashMap data structure

    pub admin: Pubkey,
}

#[derive(Accounts)]
pub struct CreateTokenProposal<'info> {
    #[account(
        init,
        payer=user,
        space=9000,
        seeds=[b"PROPOSAL_DEMO".as_ref(), user.key().as_ref()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveTokenProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeTokenProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    // Account to pay rent for mint account creation.
    pub rent: AccountInfo<'info>,
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, spl_token::program::SplToken>,
}

#[program]
pub mod token_proposal {
    use super::*;

    pub fn createTokenProposal(
        context: Context<CreateTokenProposal>,
        token: Token,
        selected_goals: SelectedGoals,
        funding_goals: FundingGoals,
        soft_cap: u32,
        hard_cap: u32,
        funding_model: FundingModel,
        airdrop_modules: AirdropModules,
        voting: Voting,
    ) -> ProgramResult {
        let proposal = &mut context.accounts.proposal;

        proposal.token = token;
        proposal.selected_goals = selected_goals;
        proposal.funding_goals = funding_goals;
        proposal.soft_cap = soft_cap;
        proposal.hard_cap = hard_cap;
        proposal.funding_model = funding_model;
        proposal.airdrop_modules = airdrop_modules;
        proposal.voting = voting;

        // Voting Mechanism
        proposal.complete = false;
        proposal.vote_count = 0;
        proposal.votes = HashMap::new();

        proposal.admin = *context.accounts.user.key;

        Ok(())
    }

    pub fn approveTokenProposal(context: Context<ApproveTokenProposal>)
        -> ProgramResult {
            /*
             * TODO:
             *   - Make sure user can vote;
             *   - Make sure user hasn't already voted.
             * E.g. votes.get[..]
             */
            let user_address: &str = &context.accounts.user.key()
                let &mut proposal: Proposal = context.accounts.proposal;

            proposal.votes[user_address] = true;
            proposal.vote_count += 1;

            Ok(())
    }

    pub fn finalizeTokenProposal(context: Context<FinalizeTokenProposal>)
        -> ProgramResult {
            /*
             * TODO:
             *   - Make sure proposal is ready to be finalized;
             *   - Make sure proposal hasn't already been finalized.
             * E.g. require!(proposal.admin == *context.accounts.user.key, CustomError::Unauthorized);
             * E.g. complete === false
             */
            let &mut proposal: Proposal = context.accounts.proposal;

            proposal.complete = true;

            Ok(())
    }

    /*
     * In token theory, creating and minting tokens are two different concepts,
     * steps, and processes: On one hand, creating a new token refers to the
     * creation of the type and structure of a token. It establishes the token's
     * properties, such as name, symbol, total supply, etc. On the other hand,
     * minting a token refers to the making of new copies, the generation of new
     * units, of that established token. Minting a token actually increases the
     * circulating supply. Minting tokens comes after creating a new token.
     * Therefore, creating a new token is equivalent to minting a new token mint
     * account.
     */
    pub fn create_token(context: Context<CreateToken>) -> ProgramResult {
        /*
         * Leverage Anchor's Cross-Program Invocation (CPI) to invoke SPL Token
         * Program's "Initialize Mint" instruction.
         */
        let cpi_accounts = spl_token::instruction::InitializeMint {
            mint: context.accounts.mint.to_account_info(),
            rent: sysvar::rent::id().to_account_info(),
            //rent: context.accounts.mint.to_account_info(),
        };
        let cpi_program = context.accounts.token_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        token_instruction::initialize_mint(
            cpi_context,
            0, // decimals
            &context.accounts.mint_authority.key(),
            None, // freeze authority
        )?;

        Ok(())
    }
}
