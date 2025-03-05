"use client";
import classNames from "classnames";
import currency from "currency.js";
import _ from "lodash";
import { api } from "~/trpc/react";

export default function TransactionHistory() {
  const [transactions] = api.transactions.getTransactions.useSuspenseQuery();

  return (
    <div>
      <h2 className="text-lg font-semibold">Transaction History</h2>
      {_.isEmpty(transactions) ? (
        <div className="flex justify-center">
          <span className="text-lg font-medium text-neutral-500">
            You have no transactions yet
          </span>
        </div>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b border-neutral-200 py-2"
            >
              <div>
                <div
                  className={classNames("text-sm font-medium", {
                    "text-neutral-500": transaction.type === "EXPENSE",
                    "text-green-500": transaction.type === "INCOME",
                  })}
                >
                  {transaction.type === "INCOME" && "+"}
                  {currency(Math.abs(transaction.amount), {
                    fromCents: true,
                    symbol: "£",
                    precision: 2,
                  }).format()}
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
