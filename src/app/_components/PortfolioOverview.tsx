"use client";
import React from "react";
import { api } from "~/trpc/react";
import currency from "currency.js";
import classNames from "classnames";

const ValueChange = ({ value }: { value: number }) => {
  return (
    <div
      className={classNames("flex items-center rounded-lg px-2 py-1", {
        "bg-green-100 text-green-500": value > 0,
        "bg-red-100 text-red-500": value < 0,
        "bg-neutral-100 text-neutral-500": value === 0,
      })}
    >
      <span className="text-xs font-semibold">
        {value > 0 ? "+" : ""}
        {value}%
      </span>
    </div>
  );
};

export default function PortfolioOverview() {
  const [portfolio] = api.portfolio.getPorfolio.useSuspenseQuery();
  const value = currency(portfolio.totalValue, {
    fromCents: true,
    symbol: "£",
    precision: 2,
  });
  return (
    <div className="mt-5">
      <h2 className="font-medium text-neutral-500">Total Portfolio Value</h2>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-3xl font-bold">{value.format()}</span>
        <ValueChange value={2.5} />
      </div>
    </div>
  );
}
