import { Badge } from "@/components/ui/badge";
import type { TemplateStyle } from "@/components/portfolio/template-styles";

interface PortfolioSkillsProps {
  skills: string[];
  style: TemplateStyle;
  heading: string;
}

/** Server-rendered skills section (public). Renders nothing when empty. */
export function PortfolioSkills({ skills, style, heading }: PortfolioSkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className={`text-sm px-3 py-1 ${style.muted} border-[var(--portfolio-primary)]/40`}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
}
