"use client";
import React from "react";
import { parseAsFloat, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ChangeDay = () => {
  const [month, setMonth] = useQueryState("month", parseAsFloat);
  const [year, setYear] = useQueryState("year", parseAsFloat);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const handleBack = () => {
    if (!year) {
      setYear(currentYear);
    }
    if (!year || !month) {
      if (currentMonth === 1) {
        setYear(currentYear - 1);
        setMonth(12);
      } else {
        setMonth(currentMonth - 1);
      }
      return;
    }
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };
  const handleForward = () => {
    if (!year) {
      setYear(currentYear);
    }
    if (!year || !month) {
      if (currentMonth === 12) {
        setYear(currentYear + 1);
        setMonth(1);
      } else {
        setMonth(currentMonth + 1);
      }
      return;
    }
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };
  return (
    <div className="flex items-center gap-x-6">
      <Button size="icon" variant="ghost" onClick={handleBack}>
        <ChevronLeft />
      </Button>
      <span className="font-bold text-lg">{year}年</span>
      <span className="font-bold text-lg">{month}月</span>
      <Button size="icon" variant="ghost" onClick={handleForward}>
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setYear(currentYear);
          setMonth(currentMonth);
        }}
      >
        今日
      </Button>
    </div>
  );
};

export default ChangeDay;
