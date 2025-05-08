import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PresaleProposalsTable from "../../molecules/proposals/PresaleProposalsTable";
import GeneralDAOTable from "../../molecules/proposals/GeneralDAOTable";
import TreasuryBackedTable from "../../molecules/proposals/TreasuryBackedTable";

const FoundedTokenFeed = () => {
  return (
    <Tabs defaultValue="presale-proposals">
      <TabsList>
        <TabsTrigger value="presale-proposals">Presale Proposals</TabsTrigger>
        <TabsTrigger value="treasury-backed">Treasury Backed</TabsTrigger>
        <TabsTrigger value="genereal-dao">General DAO</TabsTrigger>
      </TabsList>
      <TabsContent value="presale-proposals">
        <PresaleProposalsTable />
      </TabsContent>
      <TabsContent value="treasury-backed">
        <TreasuryBackedTable />
      </TabsContent>
      <TabsContent value="genereal-dao">
        <GeneralDAOTable />
      </TabsContent>
    </Tabs>
  );
};

export default FoundedTokenFeed;
