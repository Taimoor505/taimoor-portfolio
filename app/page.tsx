import { pageMeta } from "@/lib/site";
import Hero from "@/components/home/Hero";
import ProofStrip from "@/components/home/ProofStrip";
import Wings from "@/components/home/Wings";
import ReleaseHistory from "@/components/home/ReleaseHistory";
import Practice from "@/components/home/Practice";
import SayHello from "@/components/home/SayHello";

export const metadata = pageMeta({
  title: "Taimoor Asif · AI Automation Engineer",
  description:
    "AI automation engineer building production voice AI agents, CRM automations, and AI workflows for businesses.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Wings />
      <ReleaseHistory />
      <Practice />
      <SayHello />
    </>
  );
}
