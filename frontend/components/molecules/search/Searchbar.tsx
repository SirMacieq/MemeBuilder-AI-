"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fundedTokenGetAll } from "@/lib/api/proposals/funded-token";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fundedTokenGetAll();
        const tokens = res.content?.fundedTokens || [];
        setProposals(tokens);
        setFiltered(tokens);
      } catch (e) {
        console.error("Error fetching tokens", e);
      }
    };

    fetchProposals();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const keyword = value.toLowerCase();
    const results = proposals.filter((proposal) => {
      const name = proposal.token?.name?.toLowerCase() || "";
      const symbol = proposal.token?.symbol?.toLowerCase() || "";
      return name.includes(keyword) || symbol.includes(keyword);
    });
    setFiltered(results);
  };

  return (
    <div className="relative w-full lg:w-[466px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BABABA] w-5 h-5" />
      <input
        type="text"
        placeholder="Search for..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full py-[10px] pl-12 pr-6 bg-[#151925] rounded-full border border-white/10 text-white placeholder-[#BABABA] focus:outline-none focus:ring-2 focus:ring-[#7912FF]"
      />
      {search && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-[#151925] border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto z-50">
          {filtered.length === 0 ? (
            <p className="text-white text-sm">No proposals found.</p>
          ) : (
            filtered.map((proposal) => (
              <div
                key={proposal.id}
                className="p-2 text-white border-b border-white/5 last:border-b-0"
              >
                <Link href={`/proposal/${proposal.proposal_id}`} onClick={()=>setSearch("")}>
                    <strong>{proposal.token?.name}</strong>{" "}
                    <span className="text-[#BABABA]">
                    ({proposal.token?.symbol})
                    </span>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
