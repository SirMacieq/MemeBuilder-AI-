use anchor_lang::prelude::*;

declare_id!("5QSWc8MXRMNDqqCJ8fVnbg3mwgJwGP7aq1p9fBfhSbkP");

#[program]
pub mod dao_governance_proposal {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
