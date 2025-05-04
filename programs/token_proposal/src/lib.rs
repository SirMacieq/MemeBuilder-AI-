use anchor_lang::prelude::*;

declare_id!("9ccnvyPjHbJ5rb76UhvHTu4zeGcHxTaGcWC7HNcWNHx3");

#[program]
pub mod token_proposal {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
