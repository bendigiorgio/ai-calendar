"use client";
import React from "react";
import EventGenChat from "./sidebar/event-generation-chat";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { SidebarClose, SidebarOpen } from "lucide-react";
import EventQueryChat from "./sidebar/event-query-chat";

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <motion.aside
      animate={{ width: isOpen ? 384 : 56 }}
      transition={{ delay: isOpen ? 0 : 0.4 }}
      className="w-96 border-r h-screen py-4 px-2 overflow-hidden overflow-y-auto"
    >
      <div className="flex items-center justify-between w-full relative py-2 min-h-14 shrink-0">
        <motion.h2
          className="-z-10 font-bold text-lg"
          animate={{
            opacity: isOpen ? 1 : 0,
            position: isOpen ? "relative" : "absolute",
          }}
        >
          予定を生成する
        </motion.h2>
        <Button
          className="absolute right-0 z-10"
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <SidebarClose /> : <SidebarOpen />}
        </Button>
      </div>
      <motion.div className="shrink-0" animate={{ opacity: isOpen ? 1 : 0 }}>
        <EventGenChat />
      </motion.div>
      <motion.div
        className="mt-8 overflow-hidden"
        animate={{ opacity: isOpen ? 1 : 0 }}
      >
        <h3 className="text-lg font-bold">クエリー</h3>
        <EventQueryChat />
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
