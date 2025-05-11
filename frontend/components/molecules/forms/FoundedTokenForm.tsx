"use client";
import {
  useState,
  useEffect,
  Fragment,
  createContext,
  useContext,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import PotusAi from "../potusai/PotusAi";
import { predictCustom } from "@/lib/api/portusai/potus-ai";
import { X } from "lucide-react";
import Image from "next/image";
import { createTokenProposal } from "@/lib/net-api/chain";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProposalFormContext = createContext<{
  carouselApi: CarouselApi;
} | null>(null);

const FoundedTokenFormSchema = z.object({
  token: z.object({
    name: z.string(),
    symbol: z.string(),
    description: z.string(),
    logoURL: z.string(),
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
});

const FoundedTokenForm = () => {
  const wallet = useAnchorWallet();

  const form = useForm<z.infer<typeof FoundedTokenFormSchema>>({
    resolver: zodResolver(FoundedTokenFormSchema),
    defaultValues: {
      token: {
        name: "",
        symbol: "",
        description: "",
        logoURL: "",
      },
      selectedGoals: {
        lp: false,
        treasury: false,
        kol: false,
        ai: false,
      },
      fundingGoals: {
        lp: 0,
        treasury: 0,
        kol: 0,
        ai: 0,
      },
      softCap: 0,
      hardCap: "dynamic",
      fundingModel: {
        dynamicUnlock: false,
        endsEarlyOnHardCap: false,
      },
      airdropModules: {
        dropScore: false,
      },
      voting: {
        periodDays: 0,
        voteUnit: "",
        escrowedFunds: false,
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
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof FoundedTokenFormSchema>) => {
    if (!wallet) {
      alert("Please connect your wallet to submit a proposal");
      return;
    }
    setDialogMessage("Connecting to the blockchain...");
    const tx = await createTokenProposal(wallet, {
      token: {
        name: values.token.name,
        symbol: values.token.symbol,
        description: values.token.description,
        //@ts-expect-error error expected due to mismatching typo between chain and backend
        logoUrl: values.token.logoURL, //
      },
      selectedGoals: values.selectedGoals,
      fundingGoals: values.fundingGoals,
      softCap: 0,
      hardCap: 0,
      fundingModel: values.fundingModel,
      airdropModules: {
        dropScore: values.airdropModules?.dropScore ?? false,
      },
      voting: {
        periodDays: values.voting.periodDays,
        voteUnit: values.voting.voteUnit,
        escrowedFund: values.voting.escrowedFunds,
      },
    });
    setCreatedProposalHash(tx);
    setDialogMessage("Proposal submitted successfully!");

    // await createAction(values);
  };
  const [formState, setFormState] = useState<number>(0);
  const [errorSections, setErrorSections] = useState<string[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: string; content: string; refusal?: any }[]
  >([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [iaInfoOpen, setAiInfoOpen] = useState<boolean>(true);
  const [createdProposalHash, setCreatedProposalHash] = useState<string>("");

  const [resGpt, setResGpt] = useState<{
    historical: { role: string; content: string; refusal?: any }[];
    result: { role: string; content: string; refusal?: any };
    structure: typeof FoundedTokenFormSchema;
  } | null>(null);

  const updateFormObject = () => {
    if (!resGpt?.structure) return;

    Object.entries(resGpt.structure).forEach(([key, value]) => {
      form.setValue(key as any, value, {
        shouldDirty: true,
        shouldTouch: true,
      });
    });
    setIsChatOpen(false);
  };

  const handleSendMessage = (message: string) => {
    setIsLoading(true);

    const payload = {
      text: message,
      historical:
        resGpt?.historical && resGpt.historical.length > 0
          ? [...resGpt.historical, { role: "user", content: message }]
          : undefined,
    };
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    predictCustom(payload).then((res) => {
      if (res.status === 200) {
        if (res.resGPT?.result.role) {
          setMessages((prevMessages) => [...prevMessages, res.resGPT?.result]);
        }
        setResGpt(res.resGPT);
      }

      if (res.status === 500) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "Oups, an error occured, please try again",
          },
        ]);
      }

      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!api) return;
    setFormState(api.selectedScrollSnap());
    api.on("select", () => {
      setFormState(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full pt-[32px]">
      <Dialog open={form.formState.isSubmitting || true}>
        <DialogTrigger />
        <DialogContent>
          <DialogTitle>We're cooking it...</DialogTitle>
          <DialogDescription className="text-wrap wrap-anywhere">
            You should see your wallet asking you to validate transaction to
            create the proposal
            <div>Status: {dialogMessage}</div>
            {createdProposalHash && (
              <>
                <br />
                Proposal hash: {createdProposalHash}
                <br />
                <Link
                  href={`https://explorer.solana.com/tx/${createdProposalHash}`}
                  target="_blank"
                  className="text-[#f5a856]"
                >
                  View on Solana explorer
                </Link>
                <br />
                <Link href="/dashboard" className="text-[#f5a856]">
                  Go to dashboard
                </Link>
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <ProposalFormContext.Provider value={{ carouselApi: api }}>
        <Breadcrumb className="my-[16px]">
          <BreadcrumbList className="flex flex-row justify-center">
            {formStates.map((el, id) => (
              <Fragment key={id}>
                <BreadcrumbItem
                  className={
                    (id === formState ? "text-[#f5a856]" : "") +
                    " cursor-pointer" +
                    (errorSections.includes(el.key) ? " text-red-500" : "")
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
                    <Card className="pt-0">
                      <CardContent className="flex items-center justify-center p-6">
                        <ErrorCatcher
                          setError={(b) =>
                            setErrorSections(
                              b
                                ? [...errorSections, formState.key]
                                : [
                                    ...errorSections.filter(
                                      (e) => e !== formState.key,
                                    ),
                                  ],
                            )
                          }
                          error={errorSections.includes(formState.key)}
                        >
                          {formState.element}
                        </ErrorCatcher>
                      </CardContent>
                      <CardFooter className="grid gap-[10px] grid-cols-2 w-full">
                        <>
                          {i !== 0 ? (
                            <PrevButton className="order-1" />
                          ) : (
                            <div></div>
                          )}
                          {i !== formStates.length - 1 && (
                            <NextButton className="order-2" />
                          )}
                          {i === formStates.length - 1 && (
                            <SubmitButton className="order-2" />
                          )}
                        </>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </form>
        </Form>
        <PotusAi
          onSendMessage={handleSendMessage}
          messages={messages}
          isLoading={isLoading}
          isOpen={isChatOpen}
          validation={updateFormObject}
          onClose={() => setIsChatOpen(false)}
        />
        <div className="fixed bottom-[70px] right-0 p-4">
          {iaInfoOpen && (
            <>
              <div className="flex justify-end mb-2 mr-4">
                <button
                  onClick={() => setAiInfoOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="bg-[#0e131f] p-[16px] w-[278px] mb-6 mr-4 rounded-[12px]">
                Yoo! I’m Potus AI 🤖 Ready to help you create your very own
                memecoin! 🚀
              </p>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-transparent hover:bg-transparent"
              onClick={() => setIsChatOpen(true)}
            >
              <Image
                src="/images/potusai.jpeg"
                alt=""
                className="rounded-[222px]"
                width={63}
                height={63}
              />
            </button>
          </div>
        </div>
      </ProposalFormContext.Provider>
    </div>
  );
};
export default FoundedTokenForm;

const TokenIdentity = () => {
  const form = useFormContext<z.infer<typeof FoundedTokenFormSchema>>();
  // DONE token name,symbol
  // blockchain
  // DONE logo upload + desc
  // social links
  return (
    <fieldset className="w-full">
      <h2 className="font-bold text-2xl mb-6">Token Identity</h2>
      <FormField
        control={form.control}
        name="token.name"
        render={({ field }) => (
          <FormItem>
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
            <FormControl>
              <Input placeholder="Symbol (e.g. $MEME)" {...field} />
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
            <FormControl>
              <Textarea placeholder="Short Description..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  );
};
const CampaignBudgetGoals = () => {
  const form = useFormContext<z.infer<typeof FoundedTokenFormSchema>>();
  const watchIsLp = useWatch({
    control: form.control,
    name: "selectedGoals.lp",
  });
  const watchIsTreasury = useWatch({
    control: form.control,
    name: "selectedGoals.treasury",
  });
  const watchIsKol = useWatch({
    control: form.control,
    name: "selectedGoals.kol",
  });
  const watchIsAi = useWatch({
    control: form.control,
    name: "selectedGoals.ai",
  });

  //Modular selection: LP Pool, Treasury, KOL, AI Agent
  // SoftCap auto-calculation
  // Optional HardCap
  // Display % and minimums

  return (
    <fieldset className="w-full">
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="selectedGoals.lp"
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
        <FormField
          control={form.control}
          name="fundingGoals.lp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LP %</FormLabel>
              <FormControl>
                <Input
                  placeholder="LP %"
                  disabled={!watchIsLp}
                  {...field}
                  type="number"
                  // min="0"
                  // max="100"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="selectedGoals.treasury"
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
        <FormField
          control={form.control}
          name="fundingGoals.treasury"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treasury</FormLabel>
              <FormControl>
                <Input
                  placeholder="Treasury"
                  disabled={!watchIsTreasury}
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                  type="number"
                  // min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="selectedGoals.kol"
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
        <FormField
          control={form.control}
          name="fundingGoals.kol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kol</FormLabel>
              <FormControl>
                <Input
                  placeholder="kol"
                  disabled={!watchIsKol}
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="selectedGoals.ai"
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
        <FormField
          control={form.control}
          name="fundingGoals.ai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ai</FormLabel>
              <FormControl>
                <Input
                  placeholder="ai"
                  disabled={!watchIsAi}
                  {...field}
                  type="number"
                  // min="0"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
                min="0"
                value={field.value}
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
                placeholder="Hard Cap"
                {...field}
                type="number"
                // min="0"
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "0" ? "dynamic" : Number(e.target.value),
                  )
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
const ErrorCatcher = ({
  children,
  setError,
  error,
}: {
  children: React.ReactNode;
  setError: (hasError: boolean) => void;
  error: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const form = useFormContext();
  useEffect(() => {
    const namesList: string[] = [];
    ref.current?.querySelectorAll("[aria-invalid='true']").forEach((input) => {
      // @ts-expect-error indeed has name attribute
      namesList.push(input.name);
    });
    // console.log("namelist", namesList);
    if (error && !(namesList.length > 0)) {
      setError(false);
    }
    if (!error && namesList.length > 0) {
      setError(true);
    }
  }, [form, form.formState.errors, error, setError]);

  return (
    <div className="w-full" ref={ref}>
      {children}
    </div>
  );
};

const AidropModules = () => {
  const form = useFormContext<z.infer<typeof FoundedTokenFormSchema>>();

  // TODO:
  // const thisForm = useRef<HTMLFieldSetElement | null>(null);
  // console.log(
  //   "champs invalides",
  //   thisForm.current?.querySelector("input[aria-invalid]"),
  // );

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
    </fieldset>
  );
};

const Tokenomics = () => {
  const form = useFormContext<z.infer<typeof FoundedTokenFormSchema>>();
  // Total Supply
  // Allocation sliders (DAO, Voters, Airdrop, etc.)

  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="fundingModel.dynamicUnlock"
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
    </fieldset>
  );
};

const NarrativeVisuals = () => {
  // Markdown support
  // Campaign Slogan / Suggested Tweet
  // Optional Image / Meme Upload

  // TODO: Add narrative visuals
  return <div>narrative visuals</div>;
};

const VotingRules = () => {
  const form = useFormContext<z.infer<typeof FoundedTokenFormSchema>>();
  // 1 NFT = 1 vote (or token equivalent)
  // Funds are escrowed
  // SoftCap must be met
  // HardCap ends proposal early
  // Refund if SoftCap not reached

  return (
    <fieldset className="w-full">
      <FormField
        control={form.control}
        name="fundingModel.endsEarlyOnHardCap"
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
    </fieldset>
  );
};

const SummarySubmit = () => {
  const form = useFormContext<z.infer<typeof FoundedTokenFormSchema>>();
  const values = useWatch<z.infer<typeof FoundedTokenFormSchema>>();

  // Preview data
  // Wallet Connect + Ownership Check
  // Confirm & Submit to DAO

  return (
    <div>
      <h2 className="font-medium text-2xl mb-4">Summary</h2>
      <ul>
        <li>Token name: {values.token?.name}</li>
        <li>Token symbol: {values.token?.symbol}</li>
        <li>Token Description : {values.token?.description}</li>
        <li>
          Goals:
          <ul className="ml-4">
            {values.selectedGoals &&
              Object.entries(values.selectedGoals).map(([key, val]) => {
                if (
                  val === true &&
                  values.fundingGoals &&
                  Object.keys(values.fundingGoals).includes(key)
                ) {
                  return (
                    <li key={key} className="list-disc">
                      {key}:{" "}
                      {typeof values.fundingGoals?.[
                        key as "lp" | "treasury" | "kol" | "ai"
                      ] === "number" &&
                        values.fundingGoals?.[
                          key as "lp" | "treasury" | "kol" | "ai"
                        ]}
                    </li>
                  );
                }
                return;
              })}
          </ul>
        </li>
        <li>SoftCap: {values.softCap}</li>
        <li>HardCap: {values.hardCap}</li>
        <li>Dynamic Unlock: {values.fundingModel?.dynamicUnlock}</li>
        <li>
          Ends early on HardCap: {values.fundingModel?.endsEarlyOnHardCap}
        </li>
        <li>Drop Score: {values.airdropModules?.dropScore}</li>
        <li>Voting Days: {values.voting?.periodDays}</li>
        <li>Vote unit: {values.voting?.voteUnit}</li>
        <li>Escrowed funds: {values.voting?.escrowedFunds}</li>
      </ul>

      {!form.formState.isValid && form.formState.isSubmitted && (
        <div className="text-red-800">
          There is errors in this form. Please review previous steps.
        </div>
      )}
    </div>
  );
};
const NextButton = ({ className }: { className: string }) => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  return (
    <Button
      className={className}
      type="button"
      onClick={() => api.carouselApi?.scrollNext()}
    >
      Next
    </Button>
  );
};
const PrevButton = ({ className }: { className: string }) => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  const onClick = () => {
    api.carouselApi?.scrollPrev();
  };
  return (
    <Button
      className={className}
      type="button"
      variant="secondary"
      onClick={onClick}
    >
      Previous
    </Button>
  );
};
const SubmitButton = ({ className }: { className: string }) => {
  const api = useContext(ProposalFormContext);
  if (!api) return null;
  return (
    <Button className={className} type="submit">
      Submit
    </Button>
  );
};
