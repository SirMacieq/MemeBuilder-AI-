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

const DAOProposalFormSchema = z.object({
  proposal: z.object({
    name: z.string(),
    description: z.string(),
    relatedLinks: z.array(z.string()).optional(),
  }),
  governanceGoals: z.object({
    subDAO: z.boolean(),
    fundsAllocation: z.number().nonnegative().optional(),
    otherActions: z.boolean(),
  }),
  governanceFunding: z
    .object({
      subDAOCreation: z.number().nonnegative().optional(),
      generalReserve: z.number().nonnegative().optional(),
    })
    .optional(),
  quorum: z.number().nonnegative().int(),
  voting: z.object({
    periodDays: z.number().int().positive(),
    voteUnit: z.string(),
  }),
});
const DAOProposalForm = () => {
  const form = useForm<z.infer<typeof DAOProposalFormSchema>>({
    resolver: zodResolver(DAOProposalFormSchema),
    defaultValues: {
      proposal: {
        name: "",
        description: "",
        relatedLinks: [],
      },
      governanceGoals: {
        subDAO: false,
        fundsAllocation: undefined,
        otherActions: false,
      },
      governanceFunding: {
        subDAOCreation: 0,
        generalReserve: 0,
      },
      quorum: 0,
      voting: {
        periodDays: 0,
        voteUnit: "",
      },
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
  const onSubmit = (values: z.infer<typeof DAOProposalFormSchema>) => {
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
export default DAOProposalForm;

const TokenIdentity = () => {
  const form = useFormContext<z.infer<typeof DAOProposalFormSchema>>();
  // DONE token name,symbol
  // blockchain
  // DONE logo upload + desc
  // social links
  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="proposal.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proposal Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Proposal Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="proposal.relatedLinks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Related links</FormLabel>
            <FormControl>
              <Input
                placeholder="logoURL"
                {...field}
                value={field.value?.[0]}
                onChange={(e) => field.onChange([e.target.value])}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="proposal.description"
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
    </fieldset>
  );
};
const CampaignBudgetGoals = () => {
  const form = useFormContext<z.infer<typeof DAOProposalFormSchema>>();
  //Modular selection: LP Pool, Treasury, KOL, AI Agent
  // SoftCap auto-calculation
  // Optional HardCap
  // Display % and minimums

  return (
    <fieldset className="w-full flex flex-row">
      <div className="flex flex-col justify-between">
        <h3>Governance Goals</h3>
        <FormField
          control={form.control}
          name="governanceGoals.subDAO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub DAO</FormLabel>
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
          name="governanceGoals.fundsAllocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funds Allocation</FormLabel>
              <FormControl>
                <Input
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
          name="governanceGoals.otherActions"
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
      </div>
      <div className="flex flex-col justify-between">
        <h3>Governance Funding</h3>
        <FormField
          control={form.control}
          name="governanceFunding.subDAOCreation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-DAO Creation</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sub-DAO Creation"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="governanceFunding.generalReserve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Reserve</FormLabel>
              <FormControl>
                <Input
                  placeholder="General Reserve"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
};

const AidropModules = () => {
  // const form = useFormContext<z.infer<typeof DAOProposalFormSchema>>();
  // DropScore / GTE toggle
  return <fieldset className="w-full"></fieldset>;
};

const Tokenomics = () => {
  const form = useFormContext<z.infer<typeof DAOProposalFormSchema>>();
  // Total Supply
  // Allocation sliders (DAO, Voters, Airdrop, etc.)

  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="quorum"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quorum</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e))}
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
  const form = useFormContext<z.infer<typeof DAOProposalFormSchema>>();
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
    </fieldset>
  );
};

const SummarySubmit = () => {
  const form = useFormContext<z.infer<typeof DAOProposalFormSchema>>();
  const values = useWatch<z.infer<typeof DAOProposalFormSchema>>();

  // Preview data
  // Wallet Connect + Ownership Check
  // Confirm & Submit to DAO

  return (
    <div>
      <h2 className="font-medium text-2xl mb-4">Summary</h2>
      <ul>
        <li>Proposal name: {values.proposal?.name}</li>
        <li>Proposal Description : {values.proposal?.description}</li>
        <li>
          Related Links:
          <ul className="ml-4">
            {values.proposal?.relatedLinks?.map((link, i) => (
              <li key={i} className="list-disc">
                {link}
              </li>
            ))}
          </ul>
        </li>
        <li>
          Governance Goals & Funding
          <ul className="ml-4 list-disc">
            <li>Sub-DAO: {values.governanceGoals?.subDAO ? "Yes" : "No"}</li>
            <li>Funds Allocation: {values.governanceGoals?.fundsAllocation}</li>
            <li>
              Other Actions:{" "}
              {values.governanceGoals?.otherActions ? "Yes" : "No"}
            </li>
            <li>
              Sub-DAO Creation: {values.governanceFunding?.subDAOCreation}
            </li>
            <li>General Reserve: {values.governanceFunding?.generalReserve}</li>
          </ul>
        </li>
        <li>Quorum: {values.quorum}</li>
        <li>Voting Days: {values.voting?.periodDays}</li>
        <li>Vote Unit: {values.voting?.voteUnit}</li>
      </ul>

      {!form.formState.isValid && form.formState.isSubmitted && (
        <div className="text-red-800">
          There is errors in this form. Please review previous steps.
        </div>
      )}
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
