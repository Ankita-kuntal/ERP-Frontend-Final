import React, { useEffect, useState } from "react";
import { getStages } from "../services/scholarship";
import type { Stage, Status } from "../types/stage";
import type { Roles } from "../types/Roles";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import config from "../conf.json";

interface StepperProps {
  scholarshipId: number;
}

const roles: Roles[] = ["FAC", "HOD", "AD", "DEAN"];

const Stepper: React.FC<StepperProps> = ({ scholarshipId }) => {
  const [approvalStages, setApprovalStages] = useState<Stage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const stages = await getStages({ id: scholarshipId });
        setApprovalStages(stages);
      } catch (err) {
        console.error("Failed to fetch approval stages:", err);
        setError("Failed to load approval stages");
      }
    };

    if (scholarshipId) {
      fetchStages();
    }
  }, [scholarshipId]);

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case "1":
        return "bg-green-500";
      case "2":
        return "bg-yellow-500";
      case "0":
        return "bg-red-500";
      default:
        return "bg-gray-300 dark:bg-gray-600";
    }
  };

  const getStatusLabel = (status: Status): string => {
    return config.status[status] || "Upcoming";
  };

  const getStatusIcon = (status: Status) => {
    if (status === "1") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }
    if (status === "0") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="text-red-500 text-sm mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-y-4 sm:gap-2">
        {/* Row 1: Nodes + Lines */}
        <div className="col-span-full flex flex-wrap items-center justify-between gap-x-2">
          {roles.map((role, index) => {
            const stage = approvalStages.find((s) => s.role === role);
            const status = stage?.status ?? "2";
            const comment = stage?.comments ?? "";
            const hasComment = comment && comment.trim().length > 0;
            const color = getStatusColor(status);
            const icon = getStatusIcon(status);

            const Node = (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${color}`}
              >
                {icon}
              </motion.div>
            );

            return (
              <React.Fragment key={role}>
                {hasComment ? (
                  <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <div className="flex flex-col items-center">{Node}</div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="center"
                        className="bg-black text-white text-xs px-3 py-2 rounded shadow-md z-50 max-w-xs text-wrap"
                      >
                        {comment}
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                ) : (
                  <div className="flex flex-col items-center">{Node}</div>
                )}

                {index < roles.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{
                      backgroundColor:
                        status === "1"
                          ? "#22c55e"
                          : status === "0"
                          ? "#ef4444"
                          : status === "2"
                          ? "#eab308"
                          : "#9ca3af",
                      scaleX: 1,
                    }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex-1 h-1 origin-left mx-1 rounded-full ${color}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Row 2: Labels */}
        <div className="col-span-full flex justify-between flex-wrap items-start gap-x-2 mt-2">
          {roles.map((role, index) => {
            const stage = approvalStages.find((s) => s.role === role);
            const status = stage?.status ?? "2";
            const label = getStatusLabel(status);

            const alignment =
              index === 0
                ? "items-start text-left"
                : index === roles.length - 1
                ? "items-end text-right"
                : "items-center text-center";

            return (
              <div key={role} className={`flex flex-col w-20 ${alignment}`}>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {(config.college.roles && config.college.roles[role]) ? config.college.roles[role] : role}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper; 