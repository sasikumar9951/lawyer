import Navbar from "@/components/non-auth-comp/navbar";
import First from "@/components/non-auth-comp/first";
import Second from "@/components/non-auth-comp/second";
import Third from "@/components/non-auth-comp/third";
import Fourth from "@/components/non-auth-comp/fourth";
import Fifth from "@/components/non-auth-comp/fifth";
import Sixth from "@/components/non-auth-comp/sixth";
import Seventh from "@/components/non-auth-comp/seventh";
import Eighth from "@/components/non-auth-comp/eighth";
import Ninth from "@/components/non-auth-comp/ninth";
import Tenth from "@/components/non-auth-comp/tenth";
import CursorEffect from "@/components/ui/cursor-effect";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CursorEffect />
      <Navbar />
      <First />
      <Second />
      <Third />
      <Fourth />
      <Fifth />
      <Sixth />
      <Seventh />
      <Eighth />
      <Ninth />
      <Tenth />
    </main>
  );
}
