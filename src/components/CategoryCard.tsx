import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  accentClass?: string;
}

const CategoryCard = ({ icon: Icon, title, description, to, accentClass = "bg-secondary/10 text-secondary" }: CategoryCardProps) => {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-sda-lg hover:-translate-y-1 hover:border-secondary/40"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentClass} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 mt-0.5 transition-all group-hover:text-secondary group-hover:translate-x-0.5" />
    </Link>
  );
};

export default CategoryCard;
