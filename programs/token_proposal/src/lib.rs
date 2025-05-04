/***********
 * Imports *
 ***********/
use std::collections::HashMap;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

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
    pub votes: HashMap<String, bool>,

    pub admin: String, //Pubkey,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer=user, space=9000, seeds=[b"PROPOSAL_DEMO".as_ref(), user.key().as_ref()], bump)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Approve<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Finalize<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[program]
pub mod token_proposal {
    use super::*;

    pub fn create(
        context: Context<Create>,
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

    pub fn approve(context: Context<Approve>) -> ProgramResult {
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

    pub fn finalize(context: Context<Finalize>) -> ProgramResult {
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
}
