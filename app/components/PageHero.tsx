import Image from "next/image";

type PageHeroProps = {
  src: string;
  alt?: string;
  contentPosition?: "top" | "center";
  children: React.ReactNode;
};

export default function PageHero({
  src,
  alt = "OC Volleyball",
  contentPosition = "center",
  children,
}: PageHeroProps) {
  const positionClass =
    contentPosition === "top"
      ? "justify-start pt-10 px-5 md:px-10"
      : "justify-center px-6";

  return (
    <section className='relative h-70 md:h-150 w-full overflow-hidden'>
      <Image src={src} alt={alt} fill priority quality={90} className='object-cover' />
      <div className='absolute inset-0 bg-black/40 z-10' />
      <div className={`relative z-20 h-full flex flex-col ${positionClass}`}>
        {children}
      </div>
    </section>
  );
}
