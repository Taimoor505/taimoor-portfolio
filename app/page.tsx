import { pageMeta } from "@/lib/site";
import Hero from "@/components/home/Hero";
import Wings from "@/components/home/Wings";
import BuiltShippedLive from "@/components/home/BuiltShippedLive";
import ReleaseHistory from "@/components/home/ReleaseHistory";
import Practice from "@/components/home/Practice";
import SayHello from "@/components/home/SayHello";

export const metadata = pageMeta({
  title: "Taimoor Asif, AI Engineer",
  description:
    "AI engineer in Lahore building voice AI agents, CRM automation and AI workflows for teams abroad. Open to remote roles and freelance builds.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Wings />
      <BuiltShippedLive />
      <ReleaseHistory />
      <Practice />
      <SayHello />
    </>
  );
}
