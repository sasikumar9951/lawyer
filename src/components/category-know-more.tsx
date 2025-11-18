"use client";

import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

type Props = {
  href: string;
  label?: string;
};

const CategoryKnowMore = ({ href, label = "Know More" }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div className="mt-auto flex justify-center">
      <InteractiveHoverButton
        onClick={handleClick}
        className="!bg-white !text-black !border !border-black hover:!bg-cyan-500 hover:!text-white !rounded-full [&>div>div]:!bg-cyan-500 [&>div:last-child]:!text-white"
      >
        {label}
      </InteractiveHoverButton>
    </div>
  );
};

export default CategoryKnowMore;


