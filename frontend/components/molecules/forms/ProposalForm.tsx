"use client";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProposalForm = () => {
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
      <Breadcrumb>
        <BreadcrumbList className="flex flex-row justify-center">
          {formStates.map((el, id) => (
            <>
              <BreadcrumbItem
                className={
                  (id === formState ? "text-blue-800" : "") + " cursor-pointer"
                }
                onClick={() => {
                  api?.scrollTo(id);
                }}
              >
                {el.name}
              </BreadcrumbItem>
              {id !== formStates.length - 1 && <BreadcrumbSeparator />}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Carousel
        className="block mx-12"
        orientation="horizontal"
        setApi={setApi}
      >
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
export default ProposalForm;

const TokenIdentity = () => {
  return <div>token identity</div>;
};
const CampaignBudgetGoals = () => {
  return <div>campaign budget goals</div>;
};
const AidropModules = () => {
  return <div>airdrop modules</div>;
};
const Tokenomics = () => {
  return <div>tokenomics</div>;
};
const NarrativeVisuals = () => {
  return <div>narrative visuals</div>;
};
const VotingRules = () => {
  return <div>voting rules</div>;
};
const SummarySubmit = () => {
  return <div>summary submit</div>;
};
