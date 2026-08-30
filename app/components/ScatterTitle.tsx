"use client";

export default function ScatterTitle() {
  const text = "curate.";
  

  const transforms = [
    "group-hover:-translate-x-8 group-hover:-translate-y-12 group-hover:-rotate-12 group-hover:opacity-0 group-hover:blur-[4px]",
    "group-hover:translate-x-6 group-hover:-translate-y-10 group-hover:rotate-12 group-hover:opacity-0 group-hover:blur-[4px]",
    "group-hover:-translate-x-4 group-hover:translate-y-10 group-hover:-rotate-6 group-hover:opacity-0 group-hover:blur-[4px]",
    "group-hover:translate-x-8 group-hover:translate-y-8 group-hover:rotate-12 group-hover:opacity-0 group-hover:blur-[4px]",
    "group-hover:-translate-x-12 group-hover:-translate-y-4 group-hover:-rotate-12 group-hover:opacity-0 group-hover:blur-[4px]",
    "group-hover:translate-x-12 group-hover:-translate-y-6 group-hover:rotate-12 group-hover:opacity-0 group-hover:blur-[4px]",
    "group-hover:translate-x-4 group-hover:translate-y-12 group-hover:rotate-45 group-hover:opacity-0 group-hover:blur-[4px]",
  ];

  return (
    <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter lowercase flex justify-center pb-2 cursor-default select-none">
      {text.split("").map((char, i) => (
        <span key={i} className="group relative inline-block">
          <span className="absolute inset-0 z-10 w-full h-full scale-150"></span>
          
          <span
            className={`
              inline-block transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:duration-300 group-hover:ease-out
              bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/40 bg-clip-text text-transparent drop-shadow-sm
              ${transforms[i]}
            `}
          >
            {char}
          </span>
        </span>
      ))}
    </h1>
  );
}
