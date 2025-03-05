"use client";
import {
  IconCar,
  IconCircles,
  IconGift,
  IconHeart,
  IconInvoice,
  IconMoneybag,
  IconMovie,
  IconShoppingBag,
  IconSoup,
  IconTimeline,
  IconUser,
} from "@tabler/icons-react";
import classNames from "classnames";
import currency from "currency.js";
import _ from "lodash";
import { api } from "~/trpc/react";
import moment from "moment";

type ExpenseCategory =
  | "FOOD"
  | "TRANSPORT"
  | "SHOPPING"
  | "BILLS"
  | "ENTERTAINMENT"
  | "HEALTH"
  | "OTHER";

type IncomeCategory = "SALARY" | "FREELANCE" | "INVESTMENT" | "GIFT" | "OTHER";

type Category = ExpenseCategory | IncomeCategory;
function Badge({ type }: { type: Category }) {
  const colors = {
    FOOD: {
      backgroundColor: "bg-red-200",
      textColor: "text-red-700",
      icon: <IconSoup size={20} stroke={2.5} />,
    },
    TRANSPORT: {
      backgroundColor: "bg-cyan-200",
      textColor: "text-cyan-700",
      icon: <IconCar size={20} stroke={2.5} />,
    },
    SHOPPING: {
      backgroundColor: "bg-yellow-200",
      textColor: "text-yellow-700",
      icon: <IconShoppingBag size={20} stroke={2.5} />,
    },
    BILLS: {
      backgroundColor: "bg-green-200",
      textColor: "text-green-700",
      icon: <IconInvoice size={20} stroke={2.5} />,
    },
    ENTERTAINMENT: {
      backgroundColor: "bg-purple-200",
      textColor: "text-purple-700",
      icon: <IconMovie size={20} stroke={2.5} />,
    },
    HEALTH: {
      backgroundColor: "bg-pink-200",
      textColor: "text-pink-700",
      icon: <IconHeart size={20} stroke={2.5} />,
    },
    SALARY: {
      backgroundColor: "bg-green-200",
      textColor: "text-green-700",
      icon: <IconMoneybag size={20} stroke={2.5} />,
    },
    FREELANCE: {
      backgroundColor: "bg-cyan-200",
      textColor: "text-cyan-700",
      icon: <IconUser size={20} stroke={2.5} />,
    },
    INVESTMENT: {
      backgroundColor: "bg-purple-200",
      textColor: "text-purple-700",
      icon: <IconTimeline size={20} stroke={2.5} />,
    },
    GIFT: {
      backgroundColor: "bg-yellow-200",
      textColor: "text-yellow-700",
      icon: <IconGift size={20} stroke={2.5} />,
    },
    OTHER: {
      backgroundColor: "bg-gray-200",
      textColor: "text-gray-700",
      icon: <IconCircles size={20} stroke={2.5} />,
    },
  };

  return (
    <div
      className={classNames(
        "flex aspect-square items-center justify-center rounded-full p-1.5",
        colors[type].backgroundColor,
        colors[type].textColor,
      )}
    >
      {colors[type].icon}
    </div>
  );
}

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
                <Badge type={transaction.category as Category} />
                <div
                  className={classNames("text-sm font-medium", {
                    "text-neutral-500": transaction.type === "expense",
                    "text-green-500": transaction.type === "income",
                  })}
                >
                  {transaction.type === "income" && "+"}
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
