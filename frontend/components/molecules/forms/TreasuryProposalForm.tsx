"use client";
import {
  useState,
  useEffect,
  Fragment,
  createContext,
  useContext,
} from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useFormContext,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const ProposalFormContext = createContext<{
  carouselApi: CarouselApi;
} | null>(null);

const FundedProposalFormSchema = z.object({
  token: z.object({
    name: z.string().min(3),
    symbol: z.string().min(1),
    description: z.string().min(1),
    logoURL: z.string().url({ message: "Must be a valid URL" }),
  }),
  chain: z.string(),
  fundingGoals: z.object({
    lp: z.number().nonnegative(),
    treasury: z.number().nonnegative(),
    kol: z.number().nonnegative(),
    ai: z.number().nonnegative(),
  }),
  softCap: z.number().nonnegative(),
  hardCap: z.number().nonnegative().nullable(),
  fundingModel: z.object({
    source: z.string(),
    basedOnSelectedGoals: z.boolean(),
    tokensCreatedOnApproval: z.boolean(),
  }),
  tokenomics: z.object({
    supply: z.number().nonnegative(),
    allocations: z.object({
      lp: z.number().nonnegative(),
      daoVoters: z.number().nonnegative(),
      airdrop: z.number().nonnegative(),
    }),
  }),
  airdropModules: z.object({
    dropScore: z.boolean(),
    gta: z.boolean(),
  }),
  voting: z.object({
    periodDays: z.number().int().positive(),
    voteUnit: z.string(),
    quorum: z.string(),
    escrowedFunds: z.boolean(),
    autoExecuteOnApproval: z.boolean(),
  }),
  elegibilityRequilements: z.object({
    previousSuccess: z.boolean(),
    rateLimit: z.string(),
  }),
  proposer_wallet: z.string(),
});
const FundedProposalForm = () => {
  const form = useForm<z.infer<typeof FundedProposalFormSchema>>({
    resolver: zodResolver(FundedProposalFormSchema),
    defaultValues: {
      token: {
        name: "",
        symbol: "",
        description: "",
        logoURL: "",
      },
      chain: "",
      fundingGoals: {
        lp: 0,
        treasury: 0,
        kol: 0,
        ai: 0,
      },
      softCap: 0,
      hardCap: null,
      fundingModel: {
        source: "",
        basedOnSelectedGoals: false,
        tokensCreatedOnApproval: false,
      },
      tokenomics: {
        supply: 0,
        allocations: {
          lp: 0,
          daoVoters: 0,
          airdrop: 0,
        },
      },
      airdropModules: {
        dropScore: false,
        gta: false,
      },
      voting: {
        periodDays: 1,
        voteUnit: "",
        quorum: "",
        escrowedFunds: false,
        autoExecuteOnApproval: false,
      },
      elegibilityRequilements: {
        previousSuccess: false,
        rateLimit: "",
      },
      proposer_wallet: "",
    },
  });
  const formStates = [
    {
      key: "token-identity",
      name: "Token Identity",
      element: <TokenIdentity />,
    },
    {
      key: "campaign-budget-goals",
      name: "Campaign Budget Goals",
      element: <CampaignBudgetGoals />,
    },
    {
      key: "airdrop-modules",
      name: "Airdrop Modules",
      element: <AidropModules />,
    },
    { key: "tokenomics", name: "Tokenomics", element: <Tokenomics /> },
    {
      key: "narrative-visuals",
      name: "Narrative Visuals",
      element: <NarrativeVisuals />,
    },
    { key: "voting-rules", name: "Voting Rules", element: <VotingRules /> },
    {
      key: "summary-submit",
      name: "Summary & Submit",
      element: <SummarySubmit />,
    },
  ];
  const onSubmit = (values: z.infer<typeof FundedProposalFormSchema>) => {
    // TODO:
    console.log(values);
  };
  const [formState, setFormState] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!api) return;
    setFormState(api.selectedScrollSnap());
    api.on("select", () => {
      setFormState(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full pt-[32px]">
      <ProposalFormContext.Provider value={{ carouselApi: api }}>
        <Breadcrumb className="my-[16px]">
          <BreadcrumbList className="flex flex-row justify-center">
            {formStates.map((el, id) => (
              <Fragment key={id}>
                <BreadcrumbItem
                  className={
                    (id === formState ? "text-[#f5a856]" : "") +
                    " cursor-pointer"
                  }
                  onClick={() => {
                    api?.scrollTo(id);
                  }}
                >
                  {el.name}
                </BreadcrumbItem>
                {id !== formStates.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <Form {...form}>
          <form
            className="max-w-md mx-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Carousel opts={{ align: "start" }} setApi={setApi}>
              <CarouselContent>
                {formStates.map((formState, i) => (
                  <CarouselItem key={i}>
                    <Card className="">
                      <CardContent className="flex items-center justify-center p-6">
                        <>{formState.element}</>
                      </CardContent>
                      <CardFooter
                        className={
                          "flex  " +
                          (i === 0 ? "justify-end" : "justify-between")
                        }
                      >
                        <>
                          {i !== 0 && <PrevButton />}
                          {i !== formStates.length - 1 && <NextButton />}
                          {i === formStates.length - 1 && <SubmitButton />}
                        </>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </form>
        </Form>
      </ProposalFormContext.Provider>
    </div>
  );
};
export default FundedProposalForm;

const TokenIdentity = () => {
  const form = useFormContext<z.infer<typeof FundedProposalFormSchema>>();
  // DONE token name,symbol
  // blockchain
  // DONE logo upload + desc
  // social links
  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="token.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token Name</FormLabel>
            <FormControl>
              <Input placeholder="Token Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="token.symbol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token Symbol</FormLabel>
            <FormControl>
              <Input placeholder="Token Symbol" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="token.logoURL"
        render={({ field }) => (
          <FormItem>
            <FormLabel>logoURL</FormLabel>
            <FormControl>
              <Input placeholder="logoURL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="token.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Token Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="chain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chain</FormLabel>
            <FormControl>
              <Input placeholder="Blockchain to use" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
};
const CampaignBudgetGoals = () => {
  const form = useFormContext<z.infer<typeof FundedProposalFormSchema>>();

  //Modular selection: LP Pool, Treasury, KOL, AI Agent
  // SoftCap auto-calculation
  // Optional HardCap
  // Display % and minimums

  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="fundingGoals.lp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LP %</FormLabel>
            <FormControl>
              <Input
                placeholder="LP %"
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fundingGoals.treasury"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Treasury</FormLabel>
            <FormControl>
              <Input
                placeholder="Treasury"
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fundingGoals.kol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kol</FormLabel>
            <FormControl>
              <Input
                placeholder="kol"
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fundingGoals.ai"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ai</FormLabel>
            <FormControl>
              <Input
                placeholder="ai"
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="softCap"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Soft Cap</FormLabel>
            <FormControl>
              <Input
                placeholder="Soft Cap"
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="hardCap"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hard Cap</FormLabel>
            <FormControl>
              <Input
                placeholder="Soft Cap"
                {...field}
                type="number"
                value={field.value ?? undefined}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : null)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
};

const AidropModules = () => {
  const form = useFormContext<z.infer<typeof FundedProposalFormSchema>>();
  // DropScore / GTE toggle
  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="airdropModules.dropScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DropScore</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="airdropModules.gta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gta</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
};

const Tokenomics = () => {
  const form = useFormContext<z.infer<typeof FundedProposalFormSchema>>();
  // Total Supply
  // Allocation sliders (DAO, Voters, Airdrop, etc.)

  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="tokenomics.supply"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Supply</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...form}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tokenomics.allocations.lp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lp allocations</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                onChange={(e) => field.onChange(Number(e.target.value))}
                {...form}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tokenomics.allocations.daoVoters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dao Voters allocations</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                onChange={(e) => field.onChange(Number(e.target.value))}
                {...form}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tokenomics.allocations.airdrop"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Airdrop allocations</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                onChange={(e) => field.onChange(Number(e.target.value))}
                {...form}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
};

const NarrativeVisuals = () => {
  // Markdown support
  // Campaign Slogan / Suggested Tweet
  // Optional Image / Meme Upload

  // TODO:
  return <div>narrative visuals</div>;
};

const VotingRules = () => {
  const form = useFormContext<z.infer<typeof FundedProposalFormSchema>>();
  // 1 NFT = 1 vote (or token equivalent)
  // Funds are escrowed
  // SoftCap must be met
  // HardCap ends proposal early
  // Refund if SoftCap not reached

  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="voting.periodDays"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voting Days</FormLabel>
            <FormControl>
              <Input
                placeholder="votingDays"
                type="number"
                step={1}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value ?? 0}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voting.voteUnit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vote Unit</FormLabel>
            <FormControl>
              <Input placeholder="Vote Unit" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voting.quorum"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quorum</FormLabel>
            <FormControl>
              <Input
                placeholder="votingDays"
                type="number"
                step={1}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value ?? 0}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voting.escrowedFunds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Escrowed Funds</FormLabel>
            <FormControl>
              <Checkbox
                onCheckedChange={field.onChange}
                checked={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voting.autoExecuteOnApproval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Auto-execute on approval</FormLabel>
            <FormControl>
              <Checkbox
                onCheckedChange={field.onChange}
                checked={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="elegibilityRequilements.previousSuccess"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Previous Success</FormLabel>
            <FormControl>
              <Checkbox
                onCheckedChange={field.onChange}
                checked={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="elegibilityRequilements.rateLimit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate Limit</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
};

const SummarySubmit = () => {
  // const form = useFormContext<z.infer<typeof FundedProposalFormSchema>>();
  const values = useWatch<z.infer<typeof FundedProposalFormSchema>>();

  // Preview data
  // Wallet Connect + Ownership Check
  // Confirm & Submit to DAO

  return (
    <div>
      <h2 className="font-medium text-2xl mb-4">Summary</h2>
      <ul>
        <li>Token Name: {values.token?.name}</li>
        <li>Token Symbol: {values.token?.symbol}</li>
        <li>Token Description: {values.token?.description}</li>
        <li>Logo URL: {values.token?.logoURL}</li>
        <li>Chain: {values.chain}</li>
        <li>Funding Goals:</li>
        <ul>
          <li>Lp: {values.fundingGoals?.lp}</li>
          <li>Treasury: {values.fundingGoals?.treasury}</li>
          <li>Kol: {values.fundingGoals?.kol}</li>
          <li>Ai: {values.fundingGoals?.ai}</li>
        </ul>
        <li>Soft Cap: {values.softCap}</li>
        <li>Hard Cap: {values.hardCap?.toString()}</li>
        <li>Funding Model:</li>
        <ul>
          <li>Source: {values.fundingModel?.source}</li>
          <li>
            Based on Selected Goals: {values.fundingModel?.basedOnSelectedGoals}
          </li>
          <li>
            Tokens Created on Approval:{" "}
            {values.fundingModel?.tokensCreatedOnApproval}
          </li>
        </ul>
        <li>Tokenomics:</li>
        <ul>
          <li>Supply: {values.tokenomics?.supply}</li>
          <li>Allocations:</li>
          <ul>
            <li>Lp: {values.tokenomics?.allocations?.lp}</li>
            <li>Dao Voters: {values.tokenomics?.allocations?.daoVoters}</li>
            <li>Airdrop: {values.tokenomics?.allocations?.airdrop}</li>
          </ul>
        </ul>
        <li>Airdrop Modules:</li>
        <ul>
          <li>Drop Score: {values.airdropModules?.dropScore}</li>
          <li>Gta: {values.airdropModules?.gta}</li>
        </ul>
        <li>Voting:</li>
        <ul>
          <li>Period Days: {values.voting?.periodDays}</li>
          <li>Vote Unit: {values.voting?.voteUnit}</li>
          <li>Quorum: {values.voting?.quorum}</li>
          <li>Escrowed Funds: {values.voting?.escrowedFunds}</li>
          <li>
            Auto Execute on Approval: {values.voting?.autoExecuteOnApproval}
          </li>
        </ul>
        <li>Elegibility Requilements:</li>
        <ul>
          <li>
            Previous Success: {values.elegibilityRequilements?.previousSuccess}
          </li>
          <li>Rate Limit: {values.elegibilityRequilements?.rateLimit}</li>
        </ul>
        <li>Proposer Wallet: {values.proposer_wallet}</li>
      </ul>
    </div>
  );
};
const NextButton = () => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  return (
    <Button type="button" onClick={() => api.carouselApi?.scrollNext()}>
      Next
    </Button>
  );
};
const PrevButton = () => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  const onClick = () => {
    api.carouselApi?.scrollPrev();
  };
  return (
    <Button type="button" onClick={onClick}>
      Previous
    </Button>
  );
};
const SubmitButton = () => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  return (
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  );
};
