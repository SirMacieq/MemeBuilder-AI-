use anchor_lang::prelude::*;

declare_id!("ePAo5kVTwsKtX9tZxL8sSVoCAzFVXP18L5Z1AtnwCCx");

#[program]
pub mod treasury_token_proposal {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
