import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

import { useAuth } from "../auth/store/customHooks";
import photo from "../../assets/photos/photo.png";

import { ChevronDown, ChevronUp } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  icon: string;
  active?: boolean;
}

interface NoticeProps {
  title: string;
  content: string;
}

const getFormattedDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
const getRemainingDays = () => {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const diffTime = endOfMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
const remainingDays = getRemainingDays();
const bgColor =
  remainingDays <= 5
    ? "bg-red-700"
    : remainingDays <= 10
    ? "bg-yellow-700"
    : "bg-green-700";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [supervisors] = useState([
    { name: "Dr. A Sharma", role: "Supervisor", src: "/supervisor1.jpg" },
    {
      name: "Prof. B Patel",
      role: "Head of Department",
      src: "/supervisor2.jpg",
    },
    { name: "Dr. C Rao", role: "Associate Dean", src: "/supervisor3.jpg" },
    { name: "Dr. D Menon", role: "Dean", src: "/supervisor4.jpg" },
  ]);
  const [stats, setStats] = useState([
    { title: "Total Accepted", count: 15, icon: "✅" },
    { title: "Latest Applications", count: 3, icon: "🕒", active: true },
    { title: "Pending Approval", count: 5, icon: "⏳" },
  ]);
  const [scholarships, setScholarships] = useState(true);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="px-10 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans space-y-12">
      {/* Welcome Section */}
      <div className="flex items-center justify-between bg-purple-600 dark:bg-purple-700 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-[1.005] transition-all duration-300 border border-gray-200 dark:border-none">
        <div className="flex flex-col">
          <p className="text-sm mb-1 text-purple-100 dark:text-purple-200">{getFormattedDate()}</p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mt-2 text-white"
          >
            Welcome back,{" "}
            <span className="text-purple-200 dark:text-purple-300 font-extrabold">
              <Typewriter
                words={[user?.name || "NULL"]}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </motion.h1>

          <p className="text-sm text-purple-100 dark:text-purple-200">
            Always stay updated in your student portal
          </p>
        </div>
        <div className="w-40 h-40">
          {/* <img
            src="/student-avatar.png"
            alt="Student Avatar"
            className="object-contain w-full h-full"
          /> */}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left (2/3) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Scholarship Stats */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Scholarship Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((stat, idx) => (
                <StatCard
                  key={idx}
                  title={stat.title}
                  count={stat.count}
                  icon={stat.icon}
                  active={stat.active}
                />
              ))}
            </div>
          </div>

          {/* Scholarship Notification */}
          {scholarships && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Scholarship Notifications</h2>
              <div
                className="flex items-center justify-between cursor-pointer bg-purple-100 dark:bg-purple-700 rounded-lg px-4 py-3 border border-purple-200 dark:border-purple-600 shadow-sm"
                onClick={() => setOpen((prev) => !prev)}
              >
                <div>
                  <h3 className="text-purple-900 dark:text-white text-base font-semibold">
                    🎓 Unreleased Scholarships Found
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      remainingDays <= 10 ? "text-red-600 dark:text-red-300" : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {remainingDays} days left
                  </span>
                  {open ? (
                    <ChevronUp size={18} className="text-purple-700 dark:text-purple-200" />
                  ) : (
                    <ChevronDown size={18} className="text-purple-700 dark:text-purple-200" />
                  )}
                </div>
              </div>
              {/* AnimatePresence handles exit animation */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 inline-block mx-auto bg-purple-700 hover:bg-purple-600 rounded-md px-4 py-2 text-sm font-medium text-white cursor-pointer text-center shadow"
                    onClick={() =>
                      navigate("/dashboard/student/scholarship/")
                    }
                  >
                    View & Release Now →
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right (1/3) */}
        <div className="space-y-10">
          {/* Supervisors */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {supervisors.map((sup, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.1, // 👈 stagger animation
                    ease: "easeOut",
                  }}
                  className="aspect-square flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={sup.src}
                    alt={sup.name}
                    onError={(e) => (e.currentTarget.src = photo)}
                    className="w-24 h-24 rounded-full object-cover border-2 border-purple-500 mb-2"
                  />
                  <p className="text-sm font-medium text-purple-800 dark:text-white">{sup.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{sup.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily Notices */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Daily Notice</h2>
              {/* <button className="text-purple-400 hover:underline">
                See all
              </button> */}
            </div>
            {/* FIX: Changed border-gray-200 to border-purple-200 for a light purple border */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 space-y-4 border border-purple-200 dark:border-gray-700 shadow-sm">
              <Notice
                title="Beta Version Notice"
                content="The site is under beta version. Developers are working to improve the site. Please provide any bugs or suggestions using the feedback form."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Components
const StatCard: React.FC<StatCardProps> = ({ title, count, icon, active }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`text-center py-10 px-4 rounded-xl shadow-sm border transition font-medium 
      ${active
        ? "bg-purple-600 dark:bg-purple-800 border-2 border-purple-500 scale-[1.02] text-white shadow-lg" // Active card background (purple) text is white
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg"}
    `}
  >
    {/* <div className="text-4xl mb-3">{icon}</div> */}
    {/* FIX: Number in purple box to be white, others to be purple-800 */}
    <div className={`text-5xl font-extrabold ${active ? 'text-white' : 'text-purple-800'} dark:text-white mb-1`}>{count}</div>
    {/* FIX: Label in purple box to be white, labels in white boxes to be purple-900 */}
    <div className={`text-sm ${active ? 'text-white' : 'text-purple-900'} dark:text-gray-400 h-8 flex items-center justify-center`}>{title}</div>
  </motion.div>
);

const Notice: React.FC<NoticeProps> = ({ title, content }) => (
  <motion.div
    initial={{ x: 40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <h4 className="text-sm font-semibold">{title}</h4>
    <p className="text-xs text-gray-400">{content}</p>
  </motion.div>
);