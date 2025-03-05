"use client";
import { IconArrowNarrowDown, IconArrowNarrowUp } from "@tabler/icons-react";
import classNames from "classnames";
import currency from "currency.js";
import _ from "lodash";
import { api } from "~/trpc/react";
import moment from "moment";

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
              <div className="flex items-center gap-2">
                <div
                  className={classNames(
                    "flex aspect-square items-center justify-center rounded-full p-1.5",
                    {
                      "bg-neutral-200 text-neutral-500":
                        transaction.type === "EXPENSE",
                      "bg-green-200 text-green-500":
                        transaction.type === "INCOME",
                    },
                  )}
                >
                  {transaction.type === "EXPENSE" ? (
                    <IconArrowNarrowUp size={14} stroke={3} />
                  ) : (
                    <IconArrowNarrowDown size={14} stroke={3} />
                  )}
                </div>
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
                  {moment(transaction.createdAt).fromNow()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
