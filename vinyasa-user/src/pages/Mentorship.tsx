import MentorshipHero from "@/components/mentorship/MentorshipHero";
import WhyMentorship from "@/components/mentorship/WhyMentorship";
import MentorshipPrograms from "@/components/mentorship/MentorshipPrograms";
import MentorshipJourney from "@/components/mentorship/MentorshipJourney";
import SuccessStories from "@/components/mentorship/SuccessStories";
import MentorshipCTA from "@/components/mentorship/MentorshipCTA";

const MentorshipPage = () => {
  return (
    <main>
      <MentorshipHero />
      <WhyMentorship />
      <MentorshipPrograms />
      <MentorshipJourney />
      <SuccessStories />
      <MentorshipCTA />
    </main>
  );
};

export default MentorshipPage;