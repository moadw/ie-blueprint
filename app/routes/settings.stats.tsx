import { SectionHeader } from "~/routes/settings/_components/section-header";
import { StatCard } from "~/routes/settings/_components/stats/stat-card";
import { WeeklyChain } from "~/routes/settings/_components/stats/weekly-chain";
import { JourneyProgress } from "~/routes/settings/_components/stats/journey-progress";
import { RoutineCard } from "~/routes/settings/_components/stats/routine-card";
import { statsFixture } from "~/routes/settings/_fixtures";

export default function SettingsStatsRoute() {
  const stats = statsFixture;

  return (
    <div className="max-w-2xl space-y-5">
      <SectionHeader
        title="My Stats"
        subtitle="Track your mindfulness journey and celebrate your progress."
      />

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard value={stats.minutesPracticed} label="Total Practice Time" />
        <StatCard value={stats.dayStreak} label="Current Day Streak" />
        <StatCard value={stats.longestStreak} label="Longest Streak" />
        <StatCard
          value={stats.practicesCompleted}
          suffix={`/${stats.totalPractices}`}
          label="Course Completion"
        />
      </div>

      {/* Weekly Chain */}
      <WeeklyChain
        completedDays={stats.completedDays}
        currentDayIndex={stats.currentDayIndex}
      />

      {/* Journey Progress */}
      <JourneyProgress
        currentPractice={stats.practicesCompleted}
        totalPractices={stats.totalPractices}
      />

      {/* Routine Card */}
      <RoutineCard averageDaysPerWeek={stats.averageDaysPerWeek} />
    </div>
  );
}
