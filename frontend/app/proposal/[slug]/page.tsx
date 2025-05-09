"use client"
import React from "react";
import Detail from "@/components/organisms/proposal/Detail";
import { useParams } from 'next/navigation';

const Proposal = () => {
  const params = useParams();
 
  return (
    <>
      <Detail id={params.slug} />
    </>
  );
};

export default Proposal;
