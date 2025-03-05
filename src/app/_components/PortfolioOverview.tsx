"use client";
import React, { useEffect, useState, useRef } from "react";
import { api } from "~/trpc/react";
import currency from "currency.js";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";

const ValueChange = ({ value }: { value: number | null }) => {
  return (
    <div
      className={classNames("flex items-center rounded-lg px-2 py-1", {
        "bg-green-100 text-green-500": !_.isNull(value) && value > 0,
        "bg-red-100 text-red-500": !_.isNull(value) && value < 0,
        "bg-neutral-100 text-neutral-500": _.isNull(value) || value === 0,
      })}
    >
      {_.isNull(value) ? (
        <span className="text-xs font-semibold">-%</span>
      ) : (
        <span className="text-xs font-semibold">
          {value > 0 ? "+" : ""}
          {value}%
        </span>
      )}
    </div>
  );
};

const DigitTransition = ({
  digit,
  direction,
  isSpecialChar = false,
  initialIndex,
}: {
  digit: string;
  direction: "increasing" | "decreasing" | null;
  isSpecialChar?: boolean;
  initialIndex: number;
}) => {
  const getWidth = () => {
    if (digit === "1") return "w-4";
    if (digit === "," || digit === ".") return "w-3";
    return "w-5";
  };

  const getInitialAnimationProps = () => {
    return initialIndex % 2 === 0 ? { y: 30, x: 0 } : { y: -30, x: 0 };
  };

  return (
    <div className={`relative h-9 ${getWidth()} inline-block overflow-hidden`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={getInitialAnimationProps()}
          animate={{ y: 0, x: 0 }}
          exit={{ y: direction === "increasing" ? -30 : 30, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
            delay: initialIndex * 0.03,
          }}
          className={`absolute inset-0 flex items-center justify-center ${
            isSpecialChar ? "text-3xl font-bold" : "text-3xl font-bold"
          }`}
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function PortfolioOverview() {
  const [portfolio] = api.portfolio.getPortfolio.useSuspenseQuery();
  const [direction, setDirection] = useState<
    "increasing" | "decreasing" | null
  >(null);
  const prevPortfolioRef = useRef<number | null>(null);
  const [initialRender, setInitialRender] = useState(true);
  console.log(portfolio);
  const totalValue = portfolio.totalValue;

  const isNegative = totalValue < 0;

  const formattedValue = currency(Math.abs(totalValue), {
    fromCents: true,
    symbol: "£",
    precision: 2,
  }).format();

  const displayValue = isNegative ? `-${formattedValue}` : formattedValue;

  const valueArray = displayValue.split("");

  useEffect(() => {
    if (initialRender) {
      const timer = setTimeout(() => {
        setInitialRender(false);
      }, 600);

      return () => clearTimeout(timer);
    }

    if (
      prevPortfolioRef.current !== null &&
      prevPortfolioRef.current !== totalValue
    ) {
      setDirection(
        totalValue > prevPortfolioRef.current ? "increasing" : "decreasing",
      );
    }

    prevPortfolioRef.current = totalValue;
  }, [totalValue, initialRender]);

  return (
    <div className="mt-5">
      <h2 className="font-medium text-neutral-500">Total Balance</h2>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center">
          <div className="-mx-0.5 flex">
            {valueArray.map((char, index) => {
              if (char === "£") {
                return (
                  <motion.span
                    key="currency-symbol"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mr-0.5 text-3xl font-bold"
                  >
                    £
                  </motion.span>
                );
              } else if (char === "-") {
                return (
                  <motion.span
                    key="negative-sign"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mr-0.5 text-3xl font-bold"
                  >
                    -
                  </motion.span>
                );
              } else if (char === "," || char === ".") {
                return (
                  <DigitTransition
                    key={`special-${index}`}
                    digit={char}
                    direction={direction}
                    isSpecialChar={true}
                    initialIndex={index}
                  />
                );
              } else {
                return (
                  <DigitTransition
                    key={`digit-${index}`}
                    digit={char}
                    direction={direction}
                    initialIndex={index}
                  />
                );
              }
            })}
          </div>
        </div>
        <ValueChange value={portfolio.percentageChange} />
      </div>
    </div>
  );
}
