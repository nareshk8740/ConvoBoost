export const dynamic = "force-dynamic";

import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {
  getAllCompanions,
  getRecentSessions,
  getBookmarkedIds,
} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const Page = async () => {
  const user = await currentUser();
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentSessions(10);

  let bookmarkedIds: string[] = [];
  if (user) {
    bookmarkedIds = await getBookmarkedIds(user.id);
  }

  const companionsWithBookmarks = companions.map((companion) => ({
    ...companion,
    bookmarked: bookmarkedIds.includes(companion.id),
  }));

  return (
    <main>
      <h1>Popular Companions</h1>

      <section className="home-section">
        {companionsWithBookmarks.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
            bookmarked={companion.bookmarked} // ✅ pass this!
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
