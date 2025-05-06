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
import { Card, CardContent } from "@/components/ui/card";
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

const ProposalFormSchema = z.object({
  token: z.object({
    name: z.string(),
    symbol: z.string(),
    description: z.string(),
    logoURL: z.string().url({ message: "Must be a valid URL" }),
  }),
  selectedGoals: z.object({
    lp: z.boolean(),
    treasury: z.boolean(),
    kol: z.boolean(),
    ai: z.boolean(),
  }),
  fundingGoals: z.object({
    lp: z.number().nonnegative(),
    treasury: z.number().nonnegative(),
    kol: z.number().nonnegative(),
    ai: z.number().nonnegative(),
  }),
  softCap: z.number().nonnegative(),
  hardCap: z.union([z.number().nonnegative(), z.literal("dynamic")]),
  fundingModel: z.object({
    dynamicUnlock: z.boolean(),
    endsEarlyOnHardCap: z.boolean(),
  }),
  airdropModules: z
    .object({
      dropScore: z.boolean(),
    })
    .optional(),
  voting: z.object({
    periodDays: z.number().int().positive(),
    voteUnit: z.string(),
    escrowedFunds: z.boolean(),
  }),
  proposer_wallet: z.string(),
});
const ProposalForm = () => {
  const form = useForm<z.infer<typeof ProposalFormSchema>>({
    resolver: zodResolver(ProposalFormSchema),
    defaultValues: {
      token: {
        name: undefined,
        symbol: undefined,
        description: undefined,
        logoURL: undefined,
      },
      selectedGoals: {
        lp: undefined,
        treasury: undefined,
        kol: undefined,
        ai: undefined,
      },
      fundingGoals: {
        lp: undefined,
        treasury: undefined,
        kol: undefined,
        ai: undefined,
      },
      softCap: undefined,
      hardCap: undefined,
      fundingModel: {
        dynamicUnlock: undefined,
        endsEarlyOnHardCap: undefined,
      },
      airdropModules: {
        dropScore: undefined,
      },
      voting: {
        periodDays: undefined,
        voteUnit: undefined,
        escrowedFunds: undefined,
      },
      proposer_wallet: undefined,
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
  const onSubmit = (values: z.infer<typeof ProposalFormSchema>) => {
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
    <div>
      <ProposalFormContext.Provider value={{ carouselApi: api }}>
        <Breadcrumb>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Carousel orientation="horizontal" setApi={setApi}>
              <CarouselContent>
                {formStates.map((formState, i) => (
                  <CarouselItem key={i}>
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <>{formState.element}</>
                      </CardContent>
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
export default ProposalForm;

const TokenIdentity = () => {
  const form = useFormContext();
  // DONE token name,symbol
  // blockchain
  // DONE logo upload + desc
  // social links
  return (
    <>
      <FormField
        control={form.control}
        name="tokenName"
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
        name="tokenSymbol"
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
        name="tokenLogourl"
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
        name="tokenDescription"
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
    </>
  );
};
const CampaignBudgetGoals = () => {
  const form = useFormContext();
  const watchIsLp = useWatch({ control: form.control, name: "isLp" });
  const watchIsTreasury = useWatch({
    control: form.control,
    name: "isTreasury",
  });
  const watchIsKol = useWatch({ control: form.control, name: "isKol" });
  const watchIsAi = useWatch({ control: form.control, name: "isAi" });

  //Modular selection: LP Pool, Treasury, KOL, AI Agent
  // SoftCap auto-calculation
  // Optional HardCap
  // Display % and minimums

  return (
    <>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="isLp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is LP</FormLabel>
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
        {watchIsLp === true && (
          <FormField
            control={form.control}
            name="lp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LP %</FormLabel>
                <FormControl>
                  <Input placeholder="LP %" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="isTreasury"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Treasusy</FormLabel>
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
        {watchIsTreasury === true && (
          <FormField
            control={form.control}
            name="treasury"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treasury</FormLabel>
                <FormControl>
                  <Input placeholder="Treasury" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="isKol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Kol</FormLabel>
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
        {watchIsKol === true && (
          <FormField
            control={form.control}
            name="kol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kol</FormLabel>
                <FormControl>
                  <Input placeholder="kol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="isAi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Ai</FormLabel>
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
        {watchIsAi === true && (
          <FormField
            control={form.control}
            name="ai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ai</FormLabel>
                <FormControl>
                  <Input placeholder="ai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </>
  );
};

const AidropModules = () => {
  const form = useFormContext();
  // DropScore / GTE toggle
  return (
    <>
      <FormField
        control={form.control}
        name="dropScore"
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
    </>
  );
};

const Tokenomics = () => {
  const form = useFormContext();
  // Total Supply
  // Allocation sliders (DAO, Voters, Airdrop, etc.)

  return (
    <>
      <FormField
        control={form.control}
        name="dynamicUnlock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dynamic Unlock</FormLabel>
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
    </>
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
  const form = useFormContext();
  // 1 NFT = 1 vote (or token equivalent)
  // Funds are escrowed
  // SoftCap must be met
  // HardCap ends proposal early
  // Refund if SoftCap not reached

  // TODO:
  return (
    <>
      <FormField
        control={form.control}
        name="endsEarlyOnHardCap"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ends Early on HardCap</FormLabel>
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
        name="votingDays"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voting Days</FormLabel>
            <FormControl>
              <Input placeholder="votingDays" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voteUnit"
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
        name="escrowedFunds"
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
    </>
  );
};

const SummarySubmit = () => {
  // Preview data
  // Wallet Connect + Ownership Check
  // Confirm & Submit to DAO

  // TODO:
  return <div>summary submit</div>;
};
const NextButton = () => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  return <Button onClick={() => api.carouselApi?.scrollNext()}>Next</Button>;
};
const PrevButton = () => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  return <Button onClick={() => api.carouselApi?.scrollPrev()}>Next</Button>;
};
